using Settings.Interfaces;

namespace Settings.Default;

public class DefaultLDAP : ILDAPSettings
{
    public string Host { get; set; } = "example.com";
    public int Port { get; set; } = 389;
    public string BaseDN { get; set; } = "DC=example,DC=com";
    public string SA { get; set; } = string.Empty;
    public string SAPassword { get; set; } = string.Empty;
}
