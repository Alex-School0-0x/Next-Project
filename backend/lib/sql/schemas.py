from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, AliasGenerator
from pydantic.alias_generators import to_camel

from backend.lib.api.auth.models import User


class CamelBaseModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=AliasGenerator(
            validation_alias=to_camel,
            serialization_alias=to_camel,
        ),
        populate_by_name=True,
        from_attributes=True,
    )


class BaseOptionModel(CamelBaseModel):
    """
    The base Pydantic model for an Option object.

    Applies camelCase aliasing to the model attributes, and allows for the model to be populated from attributes. Extends CamelBaseModel.

    Attributes:
        value (int): The value of the option.
        label (str): The label of the option.
        is_custom (bool): A boolean indicating whether the option is a custom answer. Defaults to False.
    """

    value: int
    label: str
    is_custom: bool = False


class CreateOptionModel(BaseOptionModel):
    """
    Pydantic model for creating an Option object. Extends BaseOptionModel.

    Attributes:
        value (int): The value of the option.
        label (str): The label of the option.
        is_custom (bool): A boolean indicating whether the option is a custom answer. Defaults to False.
    """

    pass


class UpdateOptionModel(BaseOptionModel):
    """
    Pydantic model for updating an Option object. Extends BaseOptionModel.

    Attributes:
        value (int): The value of the option.
        label (str): The label of the option.
        is_custom (bool): A boolean indicating whether the option is a custom answer. Defaults to False.
    """

    pass


class OptionModel(BaseOptionModel):
    """
    Pydantic model for an Option object. Extends BaseOptionModel.
    Should be a 1:1 representation of the Option object in the database.

    Attributes:
        value (int): The value of the option.
        label (str): The label of the option.
        is_custom (bool): A boolean indicating whether the option is a custom answer. Defaults to False.
        id (int): The DB autoincrement ID of the option.
    """

    id: int


class BaseQuestionModel(CamelBaseModel):
    """
    The base Pydantic model for a Question object.

    Applies camelCase aliasing to the model attributes, and allows for the model to be populated from attributes. Extends CamelBaseModel.

    Attributes:
        title (str): The title of the question.
    """

    title: str


class CreateQuestionModel(BaseQuestionModel):
    """
    Pydantic model for creating a Question object. Extends QuestionBase.

    Attributes:
        title (str): The title of the question.
        options (List[OptionCreate]): A list of OptionCreate objects.
    """

    options: List[CreateOptionModel]


class UpdateQuestionModel(BaseQuestionModel):
    """
    Pydantic model for updating a Question object. Extends QuestionBase.

    Attributes:
        title (str): The title of the question.
        options (List[OptionUpdate]): A list of OptionUpdate objects.
    """

    options: List[UpdateOptionModel]


class QuestionModel(BaseQuestionModel):
    """
    Pydantic model for a Question object. Extends QuestionBase.
    Should be a 1:1 representation of the Question object in the database.

    Attributes:
        title (str): The title of the question.
        options (List[Option]): A list of Option objects.
        id (int): The DB autoincrement ID of the question.
    """

    options: List[OptionModel]
    id: int


class BaseQuestionTemplateModel(CamelBaseModel):
    """
    The base Pydantic model for a QuestionTemplate object.

    Applies camelCase aliasing to the model attributes, and allows for the model to be populated from attributes. Extends CamelBaseModel.

    Attributes:
        title (str): The title of the template.
        description (str): The description of the template.
    """

    title: str
    description: str


class FetchQuestionTemplateModel(CamelBaseModel):
    """
    Pydantic model for fetching a QuestionTemplate object. Extends BaseQuestionTemplateModel.

    Attributes:
        created_at (datetime): The creation date of the template.
        last_updated (datetime): The last update date of the template.
        id (str): The ID of the template to fetch.
    """

    created_at: datetime
    last_updated: datetime
    id: str


class DeleteQuestionTemplateModel(CamelBaseModel):
    """
    Pydantic model for deleting a QuestionTemplate object. Extends BaseQuestionTemplateModel.

    Attributes:
        created_at (Optional[datetime]): The creation date of the template.
            If set, the template will only be deleted if the creation date matches.
        last_updated (Optional[datetime]): The last update date of the template.
            If set, the template will only be deleted if the last update date matches.
        id (str): The ID of the template to delete.
    """

    created_at: Optional[datetime] = None
    last_updated: Optional[datetime] = None
    id: str


class CreateQuestionTemplateModel(BaseQuestionTemplateModel):
    """
    Pydantic model for creating a QuestionTemplate object. Extends BaseQuestionTemplateModel.

    Attributes:
        title (str): The title of the template.
        description (str): The description of the template.
        questions (List[CreateQuestionModel]): A list of CreateQuestionModel objects.
    """

    questions: List[CreateQuestionModel]


class UpdateQuestionTemplateModel(BaseQuestionTemplateModel):
    """
    Pydantic model for updating a QuestionTemplate object. Extends BaseQuestionTemplateModel.

    Attributes:
        title (str): The title of the template.
        description (str): The description of the template.
        questions (List[QuestionUpdate]): A list of QuestionUpdate objects.
    """

    questions: List[UpdateQuestionModel]


class QuestionTemplateModel(BaseQuestionTemplateModel):
    """
    Pydantic model for a QuestionTemplate object. Extends BaseQuestionTemplateModel.
    Should be a 1:1 representation of the QuestionTemplate object in the database.

    Attributes:
        title (str): The title of the template.
        description (str): The description of the template.
        questions (List[Question]): A list of Question objects.
        id (str): A unique, server-generated ID for the template.
    """

    questions: List[QuestionModel]
    id: str


class QuestionnaireTemplateModel(CamelBaseModel):
    id: str
    title: str
    description: str


class ActiveQuestionnaireCreateModel(CamelBaseModel):
    student: User
    teacher: User
    id: str


class ActiveQuestionnaireModel(CamelBaseModel):
    id: str
    student: User
    teacher: User
    template: QuestionnaireTemplateModel
    created_at: datetime
    student_finished_at: Optional[datetime]
    teacher_finished_at: Optional[datetime]
