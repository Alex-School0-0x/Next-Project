using API.Attributes;
using Novell.Directory.Ldap;

namespace API.Models.LDAP;

public class ObjectGuidAndMemberOf
{
    [LDAPMapping("objectGUID")]
    public LdapAttribute ObjectGUID { get; set; } = new LdapAttribute("objectGUID");
    [LDAPMapping("memberOf")]
    public LdapAttribute MemberOf { get; set; } = new LdapAttribute("memberOf");
}
