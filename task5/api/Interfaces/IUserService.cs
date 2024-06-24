using Microsoft.AspNetCore.Mvc;

namespace MyApp.Interfaces.User{
    public interface IUserInterface{
        Task<ActionResult<List<string>>> GetUserByPageNo(int pageNo);

        Task<ActionResult<string>> GetUserByEmail(string email);

        Task<ActionResult<int>> DeleteUserByEmail(string email);

        Task<ActionResult<string>> UpdateUserByEmail(string email, string user);

    }
}