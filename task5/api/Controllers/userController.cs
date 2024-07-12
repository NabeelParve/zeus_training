using Microsoft.AspNetCore.Mvc;
using MyApp.Interfaces.UserInterface;
using MyApp.Models;

namespace MyApp.Controllers{
    [Route("/api/user")]
    [ApiController]

    public class UserController : ControllerBase{

        private readonly IUserInterface _userService;
        public UserController(IUserInterface userService){
            _userService = userService; 
        }

        [HttpGet("{PageNo}")]
        public async Task<ActionResult> GetUserByPageNo([FromRoute] int PageNo){
            var response = await _userService.GetUserByPageNo(PageNo);
            if(response.Item1!=null || response.Item2?.Count == 0) return BadRequest(new {
                    error = "",
                    message = "No data found",
                    data = response.Item1
                });
            return Ok(new {
                error = "",
                message = "",
                data = response.Item2
            });
        }

        [HttpGet("email")]
        public async Task<ActionResult<User>> GetUserByEmail(string email){
            if(email==null) return BadRequest("Bad request");
            var result = await _userService.GetUserByEmail(email);
            if(result.Item1=="No Data") return BadRequest(new {
                    error = "",
                    message = "No User found",
                    data = result.Item1
                });
            return Ok(new {
                error = "",
                message = "",
                data = result.Item2
            });
        }

        [HttpGet("id")]
        public async Task<ActionResult<User>> GetUserById(int id){
            if(id==null) return BadRequest(new {
                    error = "",
                    message = "no user found",
                    data = ""
                });
            var result = await _userService.GetUserById(id);
            if(result.Item1=="No Data") return BadRequest(new {
                    error = "",
                    message = "no user found",
                    data = result.Item1
                });
            return Ok(new {
                error = "",
                message = "",
                data = result.Item2
            });
        }
    }
}