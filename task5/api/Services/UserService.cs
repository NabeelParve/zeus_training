using Microsoft.AspNetCore.Mvc;
using MyApp.Interfaces.UserInterface;
using MySqlConnector;
using MyApp.Models;

namespace MyApp.Services.UserService
{
    public class UserService : IUserInterface
    {

        private readonly MySqlDataSource _database;
        private readonly ILogger _logger;
        public UserService(ILogger<UserService> logger, MySqlDataSource database, HttpClient client)
        {
            _database = database;
            _logger = logger;
        }
        public async Task<(string?, User?)> GetUserByEmail(string email)
        {
            User? user = null;
            try
            {
                string _email = email;
                using var connection = await _database.OpenConnectionAsync();
                using var command = connection.CreateCommand();
                command.CommandText = @"SELECT * from user where Email = @Email";
                command.Parameters.AddWithValue("@Email", _email);
                var reader = await command.ExecuteReaderAsync();
                if (!reader.HasRows) return ("No Data", null);
                while (await reader.ReadAsync())
                {
                    int userId = reader.GetInt32(0);
                    user = new User
                    {
                        UserId = reader.GetInt32(0),
                        Email = reader.GetString(1),
                        Name = reader.GetString(2),
                        Country = reader.GetString(3),
                        State = reader.GetString(4),
                        City = reader.GetString(5),
                        TelephoneNumber = reader.GetString(6),
                        AddressLine1 = reader.GetString(7),
                        AddressLine2 = reader.GetString(8),
                        DateOfBirth = reader.GetString(9),
                        Salaries = await GetSalary(userId)
                    };
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return (e.ToString(), null);
            }

            return (null, user);
        }

        public async Task<(string?, User?)> GetUserById(int id)
        {
            User? user = null;
            try
            {
                int _id = id;
                using var connection = await _database.OpenConnectionAsync();
                using var command = connection.CreateCommand();
                command.CommandText = @"SELECT * from user where UserId = @UserId";
                command.Parameters.AddWithValue("@UserId", _id);
                var reader = await command.ExecuteReaderAsync();
                if (!reader.HasRows) return ("No Data", null);
                while (await reader.ReadAsync())
                {
                    int userId = reader.GetInt32(0);
                    user = new User
                    {
                        UserId = reader.GetInt32(0),
                        Email = reader.GetString(1),
                        Name = reader.GetString(2),
                        Country = reader.GetString(3),
                        State = reader.GetString(4),
                        City = reader.GetString(5),
                        TelephoneNumber = reader.GetString(6),
                        AddressLine1 = reader.GetString(7),
                        AddressLine2 = reader.GetString(8),
                        DateOfBirth = reader.GetString(9),
                        Salaries = await GetSalary(userId)
                    };
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return (e.ToString(), null);
            }

            return (null, user);
        }
        public Task<ActionResult<int>> DeleteUserByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public async Task<(string?, List<User>?)> GetUserByPageNo(int pageNo)
        {
            List<User>? response = new List<User>();
            try
            {
                using var connection = await _database.OpenConnectionAsync();
                using var command = connection.CreateCommand();
                int Offset = pageNo * 20;
                command.CommandText = @"SELECT * from user limit 200 offset @Offset";
                command.Parameters.AddWithValue("@Offset", Offset);
                var reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    response.Add(new User
                    {
                        UserId = reader.GetInt32(0),
                        Email = reader.GetString(1),
                        Name = reader.GetString(2),
                        Country = reader.GetString(3),
                        State = reader.GetString(4),
                        City = reader.GetString(5),
                        TelephoneNumber = reader.GetString(6),
                        AddressLine1 = reader.GetString(7),
                        AddressLine2 = reader.GetString(8),
                        DateOfBirth = reader.GetString(9),
                        Salaries = await GetSalary(reader.GetInt32(0))
                    });
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.ToString());
                return (e.ToString() , null);
            }
            return (null, response);
        }


        public async Task<Salary[]> GetSalary(int id)
        {
            List<Salary> response = new List<Salary>();
            using var connection = await _database.OpenConnectionAsync();
            using var command = connection.CreateCommand();
            command.CommandText = @"SELECT * from salary where UserId = @id";
            command.Parameters.AddWithValue("@id", id);
            var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                response.Add(new Salary
                {
                    UserId = reader.GetInt32(0),
                    year = reader.GetString(1),
                    amount = reader.GetDecimal(2)
                });
            }

            Salary[] responseArray = response.ToArray();
            return responseArray;

        }

        public Task<ActionResult<string>> UpdateUserByEmail(string email, string user)
        {
            throw new NotImplementedException();
        }
    }
}