using Microsoft.AspNetCore.Mvc;
using MyApp.Interfaces.Upload;


namespace MyApp.Controllers
{
    [Route("api/file")]
    [ApiController]
    public class UploadController : ControllerBase
    {   

        private readonly IUploadService _uploadService;
        public UploadController(IUploadService uploadService){
            _uploadService = uploadService;
        }

        [HttpPost]
        public async Task<ActionResult<string>> FileUpload(IFormFile file)
        {
            return await _uploadService.HandleUpload(file);
        }
    }
}
