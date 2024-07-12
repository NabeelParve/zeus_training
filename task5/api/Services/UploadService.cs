using Microsoft.AspNetCore.Mvc;
using MyApp.Interfaces.Queue;
using MyApp.Interfaces.Upload;
using MyApp.Models;
using Microsoft.Extensions.Options;
using Log4NetSample.LogUtility;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

[assembly: log4net.Config.XmlConfigurator(Watch=true)]
namespace MyApp.Services.UploadService
{
    public class UploadService : ControllerBase, IUploadService
    {
        private readonly ILogger<UploadService> _logger;
        private readonly IQueueService _queueService;
        private readonly IMongoCollection<FileLog> _logCollection;
        public UploadService(ILogger<UploadService> logger, IQueueService queueService, IOptions<MongoSetting> MongoSetting)
        {
            var mongoClient = new MongoClient(
            MongoSetting.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                MongoSetting.Value.DatabaseName);

            _logCollection = mongoDatabase.GetCollection<FileLog>(
                MongoSetting.Value.CollectionName);
            _logger = logger;
            _queueService = queueService;
        }

        public async Task<ActionResult> HandleUpload(IFormFile file)
        {
            string filename = Guid.NewGuid().ToString() + "_" + file.FileName;
            Console.WriteLine(filename);

            var extension = Path.GetExtension(filename);

            if (extension != ".csv")
            {
                _logger.LogError("Invalid file Uploaded");
                return BadRequest(new
                {
                    error = "InvalidFile",
                    message = "File must be a CSV",
                });
            }

            _logger.LogInformation($"CSV file is being processed - {DateTime.UtcNow.ToLongTimeString()}");
            byte[] data;
            using Stream stream = file.OpenReadStream();

            data = new byte[stream.Length];
            await stream.ReadAsync(data, 0, (int)stream.Length);
            await _logCollection.InsertOneAsync(new FileLog{filename = filename, Timestamp = DateTime.Now, status="uploaded"});
            _queueService.AddTask(filename, data);
            return Ok(new
            {
                error = "",
                message = "data uploaded successfully"
            });
        }
    }
}