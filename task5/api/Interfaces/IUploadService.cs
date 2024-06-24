using Microsoft.AspNetCore.Mvc;

namespace MyApp.Interfaces.Upload{
    public interface IUploadService{
        Task<ActionResult<string>> HandleUpload(IFormFile fileName);

        Task<int> InsertData(IFormFile file);
    }

}