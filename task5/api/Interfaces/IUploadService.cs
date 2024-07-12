using Microsoft.AspNetCore.Mvc;

namespace MyApp.Interfaces.Upload{
    public interface IUploadService{
        Task<ActionResult> HandleUpload(IFormFile fileName);
    }

}