using API.DTO.LDAP;
using API.DTO.Requests.ActiveQuestionnaire;
using API.Exceptions;
using API.Extensions;
using API.Interfaces;
using Database.Enums;
using Database.Models;
using Settings.Models;

namespace API.Services;

public class ActiveQuestionnaireService(IUnitOfWork unitOfWork, LdapService ldap, IConfiguration configuration)
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly LdapService _ldap = ldap;
    private readonly LDAPSettings _ldapSettings = ConfigurationBinderService.Bind<LDAPSettings>(configuration);
    private readonly JWTSettings _JWTSettings = ConfigurationBinderService.Bind<JWTSettings>(configuration);

    public async Task<ActiveQuestionnaireModel> ActivateTemplate(ActivateQuestionnaire request)
    {
        _ldap.Authenticate(_ldapSettings.SA, _ldapSettings.SAPassword);

        if (!_ldap.connection.Bound) throw new Exception("Failed to bind to the LDAP server.");

        // If the student or teacher is not found in the database, generate a new model for them.
        StudentModel student = await _unitOfWork.User.GetStudentAsync(request.StudentId) ?? GenerateStudentModel(request.StudentId);

        TeacherModel teacher = await _unitOfWork.User.GetTeacherAsync(request.TeacherId) ?? GenerateTeacherModel(request.TeacherId);

        QuestionnaireTemplateModel questionnaireTemplate = await _unitOfWork.QuestionnaireTemplate.GetEntireTemplate(request.TemplateId)
            ?? throw new SQLException.ItemNotFound("Questionnaire template not found.");

        ActiveQuestionnaireModel activeQuestionnaire = questionnaireTemplate.ToActiveQuestionnaire(student, teacher);

        await _unitOfWork.ActiveQuestionnaire.AddAsync(activeQuestionnaire);

        await _unitOfWork.SaveChangesAsync();

        return activeQuestionnaire;
    }

    public async Task<Guid?> GetOldestActiveQuestionnaireForUser(Guid id)
    {
        return await _unitOfWork.User.GetIdOfOldestActiveQuestionnaire(id);
    }

    // The new() constraint on generics don't allow classes with required properties, so we can't make this generic :v
    private StudentModel GenerateStudentModel(Guid id)
    {
        BasicUserInfo ldapStudent = _ldap.SearchByObjectGUID<BasicUserInfo>(id);
        string studentRole = _JWTSettings.Roles.FirstOrDefault(x => ldapStudent.MemberOf.StringValue.Contains(x.Key)).Value;
        
        return new()
        {
            Guid = id,
            UserName = ldapStudent.Username.StringValue,
            FullName = ldapStudent.DisplayName.StringValue,
            PrimaryRole = (UserRoles)Enum.Parse(typeof(UserRoles), studentRole, true),
            Permissions = (UserPermissions)Enum.Parse(typeof(UserPermissions), studentRole, true)
        };
    }

    private TeacherModel GenerateTeacherModel(Guid id)
    {
        BasicUserInfo ldapTeacher = _ldap.SearchByObjectGUID<BasicUserInfo>(id);
        string teacherRole = _JWTSettings.Roles.FirstOrDefault(x => ldapTeacher.MemberOf.StringValue.Contains(x.Key)).Value;
        
        return new()
        {
            Guid = id,
            UserName = ldapTeacher.Username.StringValue,
            FullName = ldapTeacher.DisplayName.StringValue,
            PrimaryRole = (UserRoles)Enum.Parse(typeof(UserRoles), teacherRole, true),
            Permissions = (UserPermissions)Enum.Parse(typeof(UserPermissions), teacherRole, true)
        };
    }
}
