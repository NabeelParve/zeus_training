using MySqlConnector;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using MyApp.Policy;
using MyApp.Models;
using Polly;
using System.Text;
using Newtonsoft.Json;
using MongoDB.Driver;


public class Processor
{
    public static void Main(string[] args)
    {
        var factory = new ConnectionFactory { HostName = "localhost" };
        ClassPolicy obj = new ClassPolicy();
        ResiliencePipeline pipeline = ClassPolicy.pipeline;
        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        var mongoClient = new MongoClient("mongodb://localhost:27017");

        var mongoDatabase = mongoClient.GetDatabase("logs");

        var logCollection = mongoDatabase.GetCollection<BatchObject>("logs");

        channel.QueueDeclare(queue: "batchQueue",
                            durable: false,
                            exclusive: false,
                            autoDelete: false,
                            arguments: null);


        var consumer = new EventingBasicConsumer(channel);
        consumer.Received += async (model, ea) =>
        {
            try
            {
                var body = ea.Body.ToArray();
                string data = System.Text.Encoding.ASCII.GetString(body);
                dynamic? BatchObject = JsonConvert.DeserializeObject(Encoding.UTF8.GetString(body)); 
                string? queryString = BatchObject?.query; 
                string? filename = BatchObject?.filename;
                string? BatchName = BatchObject?.batchName;
                Console.WriteLine(BatchName);
                int response = 0;
                var cancellationToken = new CancellationTokenSource();
                await pipeline.ExecuteAsync(async token =>{
                    var ConnectionString = "Server=localhost;User=root;Password=Nabeel@zeus123;Database=task5;AllowLoadLocalInfile=true;default command timeout=150;";
                    using (MySqlConnection mConnection = new MySqlConnection(ConnectionString))
                    {
                        mConnection.Open();
                    
                        using (MySqlCommand myCmd = new MySqlCommand(queryString?.ToString(), mConnection))
                        {
                            myCmd.CommandType = System.Data.CommandType.Text;
                            response = await myCmd.ExecuteNonQueryAsync();
                        }
                    }
                }, cancellationToken.Token);
                await logCollection.UpdateOneAsync(Builders<BatchObject>.Filter.Eq(x => x.batchName, BatchName), Builders<BatchObject>.Update.Set("status", "insertion completed"));
                Console.WriteLine("Finished Inserting");
            }
            catch (Exception ex)
            {
                Console.WriteLine("hi" + ex);
                channel.BasicReject(deliveryTag: ea.DeliveryTag, false);
            }
        };

        channel.BasicConsume(queue: "batchQueue",
                            autoAck: true,
                            consumer: consumer);

        Console.WriteLine(" Press [enter] to exit.");
        Console.ReadLine();
    }

}


