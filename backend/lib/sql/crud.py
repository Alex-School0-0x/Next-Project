from typing import Tuple, Optional, Sequence, overload, Union, Protocol
from sqlalchemy import Result, select
from sqlalchemy.orm import Session

from backend.lib.sql import schemas, models
from backend.lib.sql.utils import generate_random_string, id_exists
from backend.lib.sql.exceptions import TemplateNotFoundException, TemplateCreationError


class HasTemplateID(Protocol):
    template_id: str


@overload
def get_template_by_id(
    db: Session,
    *,
    template: HasTemplateID,
) -> Optional[schemas.QuestionTemplateModel]:
    """
    Retrieve a question template by its ID from the database.

    Args:
        db (Session): The database session to use for the query.
        template (HasTemplateID): The template schema containing the ID of the template to retrieve.

    Returns:
        Optional[schemas.QuestionTemplateModel]: The question template if found, otherwise None.
    """
    ...


@overload
def get_template_by_id(
    db: Session, *, template_id: str
) -> Optional[schemas.QuestionTemplateModel]:
    """
    Retrieve a question template by its ID from the database.

    Args:
        db (Session): The database session to use for the query.
        template_id (str): The ID of the template to retrieve.

    Returns:
        Optional[schemas.QuestionTemplateModel]: The question template if found, otherwise None.
    """
    ...


def get_template_by_id(
    db: Session,
    *,
    template: Optional[HasTemplateID] = None,
    template_id: Optional[str] = None,
) -> Optional[schemas.QuestionTemplateModel]:
    """
    Retrieve a question template by its ID from the database.

    Args:
        db (Session): The database session to use for the query.
        template (Optional[HasTemplateID]): The template schema containing the ID of the template to retrieve.

    Returns:
        Optional[schemas.QuestionTemplateModel]: The question template if found, otherwise None.
    """
    template_ref_id: str = ""
    if template is not None:
        template_ref_id = template.template_id
    elif template_id is not None:
        template_ref_id = template_id
    else:
        raise ValueError("Either template or template_id must be provided.")

    db.flush()
    result: Result[Tuple[schemas.QuestionTemplateModel]] = db.execute(
        statement=select(models.QuestionTemplate).where(
            models.QuestionTemplate.template_id == template_ref_id
        )
    )
    return result.scalars().first()


def get_templates(
    db: Session,
) -> Sequence[schemas.QuestionTemplateModel]:
    """
    Retrieve all question templates from the database.

    Args:
        db (Session): The database session to use for the query.

    Returns:
        Sequence[schemas.QuestionTemplateModel]: A sequence, typically a list, of all question templates in the database. If no templates are found, an empty sequence is returned.
    """
    db.flush()
    result: Result[Tuple[schemas.QuestionTemplateModel]] = db.execute(
        statement=select(models.QuestionTemplate)
    )
    return result.scalars().all()


def add_template(
    db: Session, template: schemas.CreateQuestionTemplateModel
) -> schemas.QuestionTemplateModel:
    """
    Adds a new question template to the database.

    Args:
        db (Session): The database session to use for the operation.
        template (schemas.QuestionTemplateCreate): The template data to be added.

    Returns:
        schemas.QuestionTemplateModel: The newly created question template instance.

    Raises:
        TemplateAlreadyExistsException: If a template with the given ID already exists.
    """
    new_template_id: str = generate_random_string()
    while id_exists(db=db, id=new_template_id):
        new_template_id = generate_random_string()

    try:
        new_template = models.QuestionTemplate(
            template_id=new_template_id,
            title=template.title,
            description=template.description,
            created_at=template.created_at,
            questions=[],
        )

        db.add(instance=new_template)
        db.flush()

        # Create the questions for the template and add them to the database
        for question in template.questions:
            new_question = models.Question(
                template_reference_id=new_template.template_id,
                title=question.title,
                selected_option=question.selected_option,
                custom_answer=question.custom_answer,
                options=[],
            )
            db.add(instance=new_question)
            db.flush()

            # Create the options for the question and add them to the database
            for option in question.options:
                new_option = models.Option(
                    question_id=new_question.id,
                    value=option.value,
                    label=option.label,
                    is_custom=option.is_custom,
                )
                db.add(instance=new_option)
                db.flush()

        # Return the newly created template
        created_template: Optional[schemas.QuestionTemplateModel] = get_template_by_id(
            db=db, template_id=new_template_id
        )
        if created_template is None:
            db.rollback()
            raise TemplateCreationError(template_id=new_template_id)

        db.commit()
        return created_template

    except Exception as error:
        # rollback on error
        db.rollback()
        raise error


def update_template(
    db: Session,
    existing_template_id: str,
    updated_template: schemas.UpdateQuestionTemplateModel,
) -> schemas.QuestionTemplateModel:
    """
    Update an existing question template in the database.

    Args:
        db (Session): The database session.
        template (schemas.QuestionTemplateUpdate): The template data to update.

    Returns:
        schemas.QuestionTemplateModel: The updated question template.

    Raises:
        TemplateNotFoundException: If the template with the given ID does not exist.
    """
    existing_template: Optional[schemas.QuestionTemplateModel] = get_template_by_id(
        db=db, template_id=existing_template_id
    )
    if not existing_template:
        raise TemplateNotFoundException(template_id=existing_template_id)

    try:
        # Update the base template data
        existing_template.title = updated_template.title
        existing_template.description = updated_template.description

        # Update the existing questions
        try:
            for existing_question, updated_question in zip(
                existing_template.questions, updated_template.questions, strict=True
            ):
                existing_question.title = updated_question.title
                existing_question.selected_option = updated_question.selected_option
                existing_question.custom_answer = updated_question.custom_answer

                # Update the existing options for the current question
                try:
                    for existing_option, updated_option in zip(
                        existing_question.options,
                        updated_question.options,
                        strict=True,
                    ):
                        existing_option.value = updated_option.value
                        existing_option.label = updated_option.label
                        existing_option.is_custom = updated_option.is_custom
                except ValueError:
                    if len(existing_question.options) > len(updated_question.options):
                        # Delete any extra options
                        for _ in range(
                            len(updated_question.options),
                            len(existing_question.options),
                        ):
                            db.delete(instance=existing_question.options.pop())
                    elif len(existing_question.options) < len(updated_question.options):
                        # Add any missing options
                        extra_options: int = len(existing_question.options)
                        for option in updated_question.options[extra_options:]:
                            new_option: schemas.OptionModel = add_option(
                                db=db,
                                option=option,
                                question_id=existing_question.id,
                            )
                            existing_question.options.append(new_option)
                    else:
                        raise

        except ValueError:
            if len(existing_template.questions) > len(updated_template.questions):
                # Delete any extra questions
                for _ in range(
                    len(updated_template.questions),
                    len(existing_template.questions),
                ):
                    db.delete(instance=existing_template.questions.pop())
            elif len(existing_template.questions) < len(updated_template.questions):
                # Add any missing questions
                extra_questions: int = len(existing_template.questions)
                for question in updated_template.questions[extra_questions:]:
                    new_question: schemas.QuestionModel = add_question(
                        db=db,
                        question=question,
                        template_id=existing_template.template_id,
                    )
                    existing_template.questions.append(new_question)
            else:
                raise

    except Exception as e:
        db.rollback()
        raise e

    db.commit()
    return existing_template


def delete_template(
    db: Session, template: schemas.DeleteQuestionTemplateModel
) -> schemas.QuestionTemplateModel:
    """
    Deletes a question template from the database.

    This function deletes a question template identified by the given template data.
    It first flushes the current state of the database session, retrieves the template
    by its ID, and raises an exception if the template is not found. If the template
    exists, it is deleted from the database and the session is committed.

    Args:
        db (Session): The database session to use for the operation.
        template (schemas.QuestionTemplateBase): The template data containing the ID of the template to delete.

    Returns:
        schemas.QuestionTemplateModel: The deleted question template.

    Raises:
        TemplateNotFoundException: If the template with the given ID is not found.
    """
    db.flush()
    deleted_template: Optional[schemas.QuestionTemplateModel] = get_template_by_id(
        db=db, template=template
    )
    if not deleted_template:
        raise TemplateNotFoundException(template_id=template.template_id)

    db.delete(instance=deleted_template)
    db.commit()
    return deleted_template


@overload
def add_question(
    db: Session,
    question: Union[schemas.CreateQuestionModel, schemas.UpdateQuestionModel],
    *,
    template_id: str,
) -> schemas.QuestionModel:
    """
    Adds a new question to the database.

    Args:
        db (Session): The database session to use for the operation.
        question (Union[schemas.QuestionCreate, schemas.QuestionUpdate]): The question data to be added.
        template_id (str): The ID of the template to which the question belongs.

    Returns:
        schemas.QuestionModel: The newly created question object.
    """
    ...


@overload
def add_question(
    db: Session,
    question: Union[schemas.CreateQuestionModel, schemas.UpdateQuestionModel],
    *,
    template: models.QuestionTemplate,
) -> schemas.QuestionModel:
    """
    Adds a new question to the database.

    Args:
        db (Session): The database session to use for the operation.
        question (Union[schemas.QuestionCreate, schemas.QuestionUpdate]): The question data to be added.
        template (models.QuestionTemplate): The template which contains the ID to associate the question with.

    Returns:
        schemas.QuestionModel: The newly created question object.
    """
    ...


def add_question(
    db: Session,
    question: Union[schemas.CreateQuestionModel, schemas.UpdateQuestionModel],
    *,
    template_id: Optional[str] = None,
    template: Optional[models.QuestionTemplate] = None,
) -> schemas.QuestionModel:
    """
    Adds a new question to the database.

    Accepts either a template ID or a template object to associate the question with.

    Overload 1:
        db (Session): The database session to use for the operation.
        question (schemas.QuestionCreate): The question data to be added.
        template_id (Optional[str]): The ID of the template to associate the question with.

    Overload 2:
        db (Session): The database session to use for the operation.
        question (schemas.QuestionCreate): The question data to be added.
        template (Optional[models.QuestionTemplate]): The template which contains the ID to associate the question with.

    Raises:
        ValueError: If neither template nor template_id is provided.

    Returns:
        schemas.QuestionModel: The newly created question instance.
    """
    template_ref_id: str = ""
    if template is not None:
        template_ref_id = template.template_id
    elif template_id is not None:
        template_ref_id = template_id
    else:
        raise ValueError("Either template or template_id must be provided.")

    new_question = models.Question(
        template_reference_id=template_ref_id,
        title=question.title,
        selected_option=question.selected_option,
        custom_answer=question.custom_answer,
        options=[],
    )

    db.add(instance=new_question)

    return schemas.QuestionModel.model_validate(obj=new_question)


@overload
def add_option(
    db: Session,
    option: Union[schemas.CreateOptionModel, schemas.UpdateOptionModel],
    *,
    question_id: int,
) -> schemas.OptionModel:
    """
    Adds a new option to the database.

    Args:
        db (Session): The database session to use for the operation.
        option (Union[schemas.OptionCreate, schemas.OptionUpdate]): The option data to be added.
        question_id (int): The ID of the question to which the option belongs.

    Returns:
        schemas.OptionModel: The newly created option object.
    """
    ...


@overload
def add_option(
    db: Session,
    option: Union[schemas.CreateOptionModel, schemas.UpdateOptionModel],
    *,
    question: models.Question,
) -> schemas.OptionModel:
    """
    Adds a new option to the database.

    Args:
        db (Session): The database session to use for the operation.
        option (Union[schemas.OptionCreate, schemas.OptionUpdate]): The option data to be added.
        question (models.Question): The question to which the option belongs.

    Returns:
        schemas.OptionModel: The newly created option object.
    """
    ...


def add_option(
    db: Session,
    option: Union[schemas.CreateOptionModel, schemas.UpdateOptionModel],
    *,
    question_id: Optional[int] = None,
    question: Optional[models.Question] = None,
) -> schemas.OptionModel:
    """
    Adds a new option to the database.

    Accepts either a question ID or a question object to associate the option with.

    Overload 1:
        db (Session): The database session to use for the operation.
        option (Union[schemas.OptionCreate, schemas.OptionUpdate]): The option data to be added.
        question_id (Optional[int]): The ID of the question to associate the option with.

    Overload 2:
        db (Session): The database session to use for the operation.
        option (Union[schemas.OptionCreate, schemas.OptionUpdate]): The option data to be added.
        question (Optional[models.Question]): The question which contains the ID to associate the option with.

    Raises:
        ValueError: If neither question nor question_id is provided.

    Returns:
        schemas.OptionModel: The newly created option instance.
    """
    question_ref_id: int = -1
    if question is not None:
        question_ref_id = question.id
    elif question_id is not None:
        question_ref_id = question_id
    else:
        raise ValueError("Either question or question_id must be provided.")

    new_option = models.Option(
        question_id=question_ref_id,
        value=option.value,
        label=option.label,
        is_custom=option.is_custom,
    )

    db.add(instance=new_option)

    return schemas.OptionModel.model_validate(obj=new_option)


def get_option_by_id(db: Session, option_id: int) -> Optional[schemas.OptionModel]:
    """
    Retrieve an option by its ID from the database.

    Args:
        db (Session): The database session to use for the query.
        option_id (int): The ID of the option to retrieve.

    Returns:
        Optional[schemas.OptionModel]: The option if found, otherwise None.
    """
    db.flush()
    result: Result[Tuple[schemas.OptionModel]] = db.execute(
        statement=select(models.Option).where(models.Option.id == option_id)
    )
    return result.scalars().first()


def get_options_by_question_id(
    db: Session, question_id: int
) -> Sequence[schemas.OptionModel]:
    """
    Retrieve all options for a given question from the database.

    Args:
        db (Session): The database session to use for the query.
        question_id (int): The ID of the question to retrieve options for.

    Returns:
        Sequence[schemas.OptionModel]: A sequence, typically a list, of all options for the given question. If no options are found, an empty sequence is returned.
    """
    db.flush()
    result: Result[Tuple[schemas.OptionModel]] = db.execute(
        statement=select(models.Option).where(models.Option.question_id == question_id)
    )
    return result.scalars().all()
