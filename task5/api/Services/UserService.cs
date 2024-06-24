using Microsoft.AspNetCore.Mvc;
using MyApp.Interfaces.User;

namespace MyApp.Services.UserService{
    public class UserService : IUserInterface
    {
        public Task<ActionResult<int>> DeleteUserByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public Task<ActionResult<string>> GetUserByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public Task<ActionResult<List<string>>> GetUserByPageNo(int pageNo)
        {
            throw new NotImplementedException();
        }

        public Task<ActionResult<string>> UpdateUserByEmail(string email, string user)
        {
            throw new NotImplementedException();
        }
    }


}