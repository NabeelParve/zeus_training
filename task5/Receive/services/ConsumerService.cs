using MongoDB.Driver;
using Receive.Interface;
using Receive.Services.Data;
using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System.Text;
using Newtonsoft.Json;
using Receive.Models;

namespace Receive.Services.consumer
{
    public class ConsumerService
    {
        private readonly IDataService _dataService;
        public ConsumerService(IDataService dataService){
            _dataService = dataService;
            // start();
        }
        public void start()
        {
            var factory = new ConnectionFactory { HostName = "localhost" };

            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();
            var mongoClient = new MongoClient("mongodb://localhost:27017");

            var mongoDatabase = mongoClient.GetDatabase("logs");

            var logCollection = mongoDatabase.GetCollection<FileLog>("logs");

            channel.QueueDeclare(queue: "fileQueue",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);

            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += async (model, ea) =>
            {
                try
                {
                    byte[] body = ea.Body.ToArray();
                    dynamic? queueObject = JsonConvert.DeserializeObject(Encoding.UTF8.GetString(body));
                    string? filename = queueObject?.filename;
                    Console.WriteLine(filename);
                    byte[]? data = queueObject?.data;
                    DateTime? TimeStamp = queueObject?.TimeStamp;
                    string data_string = System.Text.Encoding.ASCII.GetString(data!);
                    string[] rows = data_string.Replace("\r", "").Split("\n");
                    string[][] results = new string[rows.Length][];

                    int i = 0;
                    foreach (string row in rows)
                    {
                        results[i++] = row.Split(',');
                    }

                    string[] headers = results[0];
                    var watch = System.Diagnostics.Stopwatch.StartNew();

                    //cleaning
                    Console.WriteLine("Data cleaning Started");
                    (List<User> UsersList, List<Salary> SalaryList) = _dataService.CleanData(results, headers);

                    //insertion
                    Console.WriteLine("Data insetion Started");

                    if (UsersList.Count <= 0 && SalaryList.Count <= 0)
                    {
                        Console.WriteLine("Nothing Found");
                        channel.BasicReject(deliveryTag: ea.DeliveryTag, false);
                        //insert failed log to mongo
                    }
                    else _dataService.InsertData(UsersList, SalaryList, filename!);
                    watch.Stop();
                    await logCollection.UpdateOneAsync(Builders<FileLog>.Filter.Eq(x => x.filename, filename), Builders<FileLog>.Update.Set("status", "insertion started"));
                    var elapsedMs = watch.ElapsedMilliseconds;
                    Console.WriteLine($"Time takes: {elapsedMs / 1000}s");

                    channel.BasicAck(deliveryTag: ea.DeliveryTag, false);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    channel.BasicReject(deliveryTag: ea.DeliveryTag, false);
                }
            };
            channel.BasicConsume(queue: "fileQueue",
                                    autoAck: true,
                                    consumer: consumer);
            Console.WriteLine(" Press [enter] to exit.");
        }
    }

}