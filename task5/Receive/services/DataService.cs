using Receive.Interface;
using Receive.Models;
using MySqlConnector;
using System.Text;
using Receive.Queue;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using Receive.Services.Mongo;
// using Log4NetSample.LogUtility;
using Microsoft.Extensions.Logging;
using log4net;
[assembly: log4net.Config.XmlConfigurator(Watch=true)]
namespace Receive.Services.Data
{
    public class DataService : IDataService
    {
        private readonly IQueueService _queueService;
        private readonly MongoService _mongoService;

        private readonly ILogger<DataService> _logger;
        public DataService(MongoService mongoService, ILogger<DataService> logger)
        {
            _logger = logger;
            _mongoService = mongoService;
            _queueService = new QueueService();
        }
        UserValidator UserValidator = new UserValidator();
        SalaryValidator SalaryValidator = new SalaryValidator();
        public async void InsertData(List<User> UsersList, List<Salary> SalariesList, string filename)
        {
            var ConnectionString = "Server=localhost;User=root;Password=Nabeel@zeus123;Database=task5;AllowLoadLocalInfile=true;";
            try
            {
                using (MySqlConnection mConnection = new MySqlConnection(ConnectionString))
                {
                    mConnection.Open();
                    for (int i = 0; i < UsersList.Count; i += 10000)
                    {
                        StringBuilder UserQuery = new StringBuilder("INSERT INTO user (UserId, Email, Name, Country,State,City,TelephoneNumber,AddressLine1,AddressLine2,DateOfBirth) VALUES ");
                        List<string> Users = new List<string>();
                        string BatchName = filename + "_users_" + i;
                        _logger.LogInformation(BatchName);
                        for (int j = i; j < Math.Min(i + 10000, UsersList.Count); j++)
                        {
                            Users.Add(string.Format("('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}')",
                            MySqlHelper.EscapeString(UsersList[j].UserId.ToString()),
                            MySqlHelper.EscapeString(UsersList[j].Email),
                            MySqlHelper.EscapeString(UsersList[j].Name),
                            MySqlHelper.EscapeString(UsersList[j].Country),
                            MySqlHelper.EscapeString(UsersList[j].State),
                            MySqlHelper.EscapeString(UsersList[j].City),
                            MySqlHelper.EscapeString(UsersList[j].TelephoneNumber),
                            MySqlHelper.EscapeString(UsersList[j].AddressLine1),
                            MySqlHelper.EscapeString(UsersList[j].AddressLine2),
                            MySqlHelper.EscapeString(UsersList[j].DateOfBirth)
                            ));
                        }
                        UserQuery.Append(string.Join(",", Users));
                        UserQuery.Append(" ON DUPLICATE KEY UPDATE UserId = VALUES(UserId), Email = VALUES(Email), Name=VALUES(Name), Country = VALUES(Country), State = VALUES(State), City = VALUES(City) , TelePhoneNumber = VALUES(TelePhoneNumber), AddressLine1 = VALUES(AddressLine1), AddressLine2 = VALUES(AddressLine2)");
                        UserQuery.Append(";");
                        await _mongoService.CreateAsync(new BatchLog { filename = filename, batchName = BatchName, status = "uploaded" });
                        _queueService.AddTask(UserQuery, filename, BatchName);
                    }

                    for (int i = 0; i < SalariesList.Count; i += 10000)
                    {
                        string BatchName = filename + "_salaries_" + i;
                        _logger.LogInformation(BatchName);
                        StringBuilder SalaryQuery = new StringBuilder("INSERT INTO salary (UserId,year, amount) VALUES ");
                        List<string> Salaries = new List<string>();
                        for (int j = i; j < Math.Min(i + 10000, SalariesList.Count); j++)
                        {
                            Salaries.Add(string.Format("('{0}','{1}','{2}')",
                            MySqlHelper.EscapeString(SalariesList[j].UserId.ToString()),
                            MySqlHelper.EscapeString(SalariesList[j].year),
                            MySqlHelper.EscapeString(SalariesList[j].amount.ToString())));
                        }
                        SalaryQuery.Append(string.Join(",", Salaries));
                        SalaryQuery.Append(" ON DUPLICATE KEY UPDATE  UserId = VALUES(UserId), year = VALUES(year), amount=VALUES(amount)");
                        SalaryQuery.Append(";");
                        await _mongoService!.CreateAsync(new BatchLog { filename = filename, batchName = BatchName, status = "uploaded" });
                        _queueService.AddTask(SalaryQuery, filename, BatchName);
                    }
                }
                _logger.LogInformation($"Data Queued in Batches Successfully");
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"{ex.ToString()} - {DateTime.UtcNow.ToLongTimeString()}");
            }

        }

        public (List<User>, List<Salary>) CleanData(string[][] results, string[] headers)
        {
            List<User> UsersList = new List<User>();
            List<Salary> SalariesList = new List<Salary>();
            for (int j = 1; j < results.Length; j++)
            {
                string[] row = results[j];
                if (row.Length < 14) continue;
                for (int k = 10; k < row.Length; k++)
                {
                    Salary salary = new Salary
                    {
                        UserId = Convert.ToInt32(row[0]),
                        year = headers[k],
                        amount = Decimal.Parse(row[k]),
                    };
                    if (SalaryValidator.Validate(salary).IsValid) SalariesList.Add(salary);
                }
                User user = new User
                {
                    UserId = Convert.ToInt32(row[0]),
                    Email = row[1],
                    Name = row[2],
                    Country = row[3],
                    State = row[4],
                    City = row[5],
                    TelephoneNumber = row[6],
                    AddressLine1 = row[7],
                    AddressLine2 = row[8],
                    DateOfBirth = row[9],
                    Salaries = []

                };
                if (UserValidator.Validate(user).IsValid) UsersList.Add(user);
            }
            return (UsersList, SalariesList);

        }
    }
}


// using (MySqlCommand myCmd = new MySqlCommand(UserQuery.ToString(), mConnection))
// {
//     myCmd.CommandType = System.Data.CommandType.Text;
//     response = await myCmd.ExecuteNonQueryAsync();

//     myCmd.CommandText = SalaryQuery.ToString();
//     myCmd.CommandType = System.Data.CommandType.Text;
//     response += await myCmd.ExecuteNonQueryAsync();
// }