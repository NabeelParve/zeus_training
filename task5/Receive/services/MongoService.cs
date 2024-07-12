using Receive.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Microsoft.Extensions.Hosting;

namespace Receive.Services.Mongo
{
    public class MongoService
    {
        private readonly IMongoCollection<BatchLog> _logCollection;
 
    public MongoService(MongoSettings mongoSetting)
    {
        var mongoClient = new MongoClient(
            mongoSetting.ConnectionString);
 
        var mongoDatabase = mongoClient.GetDatabase(
            mongoSetting.DatabaseName);
 
        _logCollection = mongoDatabase.GetCollection<BatchLog>(
            mongoSetting.CollectionName);
    }
 
    public async Task<List<BatchLog>> GetAsync() =>
        await _logCollection.Find(_ => true).ToListAsync();
 
    public async Task<BatchLog?> GetAsync(string id) =>
        await _logCollection.Find(x => x.filename == id).FirstOrDefaultAsync();
 
    public async Task<BatchLog?> FindByFileName(string filename) =>
        await _logCollection.Find(x => x.filename == filename).FirstOrDefaultAsync();
 
    public async Task CreateAsync(BatchLog batchLog) =>
        await _logCollection.InsertOneAsync(batchLog);
 
    public async Task UpdateAsync(string filename, string status) {
        var filter = Builders<BatchLog>.Filter
                    .Eq(x => x.filename, filename);
        var update = Builders<BatchLog>.Update
        .Set(x => x.status, status);
        await _logCollection.UpdateOneAsync(filter, update);
 
    }
 
    public async Task RemoveAsync(string filename) =>
        await _logCollection.DeleteOneAsync(x => x.filename == filename);
    }
}