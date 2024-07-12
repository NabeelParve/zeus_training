using Receive.Services.Data;
using Receive.Services.Mongo;
using Receive.Queue;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Builder;
using System.Text;
using Newtonsoft.Json;
using Receive.Models;
using Receive.Services.consumer;
using Microsoft.Extensions.Options;
using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using MongoDB.Driver;
using Receive.Interface;
using Log4NetSample.LogUtility;

public class Reciever
{
    public Reciever()
    {
    }
    public static void Main(string[] args)
    {
        var builder = Host.CreateApplicationBuilder(args);
        builder.Services.Configure<MongoSettings>(
            builder.Configuration.GetSection("MongoSetting"));
        builder.Services.AddSingleton<MongoService>();
        builder.Services.AddSingleton<DataService>();
        builder.Services.AddScoped<ConsumerService>();
        builder.Services.AddScoped<Logger>();
        builder.Services.AddSingleton<MongoService>(sp =>
                {
                    var settings = sp.GetRequiredService<IOptions<MongoSettings>>().Value;
                    return new MongoService(settings);
                });
        builder.Services.AddSingleton<QueueService>();
        builder.Logging.AddLog4Net();
        var app = builder.Build();
        


        // ConsumerService consumerService = new ConsumerService(app.Services.GetRequiredService<DataService>());
        // consumerService.start();
        IDataService _dataService = app.Services.GetRequiredService<DataService>();

        var factory = new ConnectionFactory { HostName = "localhost" };
        var logger = new Logger();
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

                // channel.BasicAck(deliveryTag: ea.DeliveryTag, false);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                // channel.BasicReject(deliveryTag: ea.DeliveryTag, false);
            }
        };
        channel.BasicConsume(queue: "fileQueue",
                                autoAck: true,
                                consumer: consumer);
        Console.WriteLine(" Press [enter] to exit.");


        app.Run();

    }
}