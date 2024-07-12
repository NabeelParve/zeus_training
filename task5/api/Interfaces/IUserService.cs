using Microsoft.AspNetCore.Mvc;
using MyApp.Models;

namespace MyApp.Interfaces.UserInterface{
    public interface IUserInterface{
        Task<(string?, List<User>?)> GetUserByPageNo(int pageNo);

        Task<(string? , User?)> GetUserByEmail(string email);

        Task<(string?, User?)> GetUserById(int id);

        Task<ActionResult<int>> DeleteUserByEmail(string email);

        Task<ActionResult<string>> UpdateUserByEmail(string email, string user);

    }
}