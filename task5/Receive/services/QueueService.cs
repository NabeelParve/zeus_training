using System.Text;
using Receive.Interface;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Receive.Models;
using Receive.Services.Data;

namespace Receive.Queue
{
    class QueueService : IQueueService
    {
        private readonly IConnectionFactory factory;
        public QueueService()
        {
            factory = new ConnectionFactory { HostName = "localhost" };
        }
        public void AddTask(StringBuilder data, string filename, string BatchName)
        {
            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();
            channel.QueueDeclare(queue: "batchQueue",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);

            channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);
            channel.BasicPublish(exchange: string.Empty,
                     routingKey: "batchQueue",
                     basicProperties: null,
                     body: Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(new {
                         filename = filename,
                         batchName = BatchName,
                         query = data.ToString()
                     })));
        }

        // public void ListenTask()
        // {
        //     using var connection = factory.CreateConnection();
        //     using var channel = connection.CreateModel();

        //     channel.QueueDeclare(queue: "fileQueue",
        //                         durable: false,
        //                         exclusive: false,
        //                         autoDelete: false,
        //                         arguments: null);

        //     var consumer = new EventingBasicConsumer(channel);
        //     consumer.Received += (model, ea) =>
        //     {
        //         try
        //         {
        //             byte[] body = ea.Body.ToArray();
        //             dynamic? queueObject = JsonConvert.DeserializeObject(Encoding.UTF8.GetString(body));
        //             string? filename = queueObject?.filename;
        //             Console.WriteLine(filename);
        //             byte[]? data = queueObject?.data;
        //             DateTime? TimeStamp = queueObject?.TimeStamp;
        //             string data_string = System.Text.Encoding.ASCII.GetString(data!);
        //             string[] rows = data_string.Replace("\r", "").Split("\n");
        //             string[][] results = new string[rows.Length][];

        //             int i = 0;
        //             foreach (string row in rows)
        //             {
        //                 results[i++] = row.Split(',');
        //             }

        //             string[] headers = results[0];
        //             var watch = System.Diagnostics.Stopwatch.StartNew();

        //             //cleaning
        //             Console.WriteLine("Data cleaning Started");
        //             (List<User> UsersList, List<Salary> SalaryList) = _dataService.CleanData(results, headers);

        //             //insertion
        //             Console.WriteLine("Data insetion Started");

        //             if (UsersList.Count <= 0 && SalaryList.Count <= 0)
        //             {
        //                 Console.WriteLine("Nothing Found");
        //                 channel.BasicReject(deliveryTag: ea.DeliveryTag, false);
        //                 //insert failed log to mongo
        //             }
        //             else _dataService.InsertData(UsersList, SalaryList, filename!);

        //             watch.Stop();

        //             var elapsedMs = watch.ElapsedMilliseconds;
        //             Console.WriteLine($"Time takes: {elapsedMs / 1000}s");

        //             channel.BasicAck(deliveryTag: ea.DeliveryTag, false);
        //         }
        //         catch (Exception ex)
        //         {
        //             Console.WriteLine(ex);
        //             channel.BasicReject(deliveryTag: ea.DeliveryTag, false);
        //         }
        //     };
        //     channel.BasicConsume(queue: "fileQueue",
        //                             autoAck: false,
        //                             consumer: consumer);
        //     Console.WriteLine(" Press [enter] to exit.");

        // }
    }
}