using System.Text;
using System.Text.Json;
using MyApp.Interfaces.Queue;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace MyApp.Queue
{
    class QueueService : IQueueService
    {
        private readonly IConnectionFactory factory;
        public QueueService()
        {
            factory = new ConnectionFactory { HostName = "localhost" };
        }
        public void AddTask(string filename, byte[] FileStream)
        {
            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();
            channel.QueueDeclare(queue: "fileQueue",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);

            channel.BasicPublish(exchange: string.Empty,
                     routingKey: "fileQueue",
                     basicProperties: null,
                     body: Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new {
                        filename = filename,
                        data = FileStream,
                        Timestamp = DateTime.Now
                     })));
        }

        public void ListenTask()
        {
            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            channel.QueueDeclare(queue: "responseQueue",
                                durable: false,
                                exclusive: false,
                                autoDelete: false,
                                arguments: null);


            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += (model, ea) =>
            {
                var body = ea.Body.ToArray();
                string data_string = System.Text.Encoding.ASCII.GetString(body);
                Console.WriteLine(data_string);
            };

        }
    }
}