using Database.Models;

namespace Database.Interfaces;

public interface ITrackedRefreshTokenRepository : IGenericRepository<TrackedRefreshTokenModel>
{
    void RevokeToken(TrackedRefreshTokenModel trackedRefreshToken);
    Task RevokeOldTokensUntilThereAreNValid(Guid id, int n);
    Task<bool> IsTokenRevoked(byte[] token);
}
