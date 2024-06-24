using Microsoft.AspNetCore.Mvc;
using MyApp.Interfaces.Upload;
using MyApp.Models;
using MyApp.Contexts;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using NuGet.Protocol;
using MySqlConnector;
using System.Text;

namespace MyApp.Services.UploadService
{

    public class UploadService : ControllerBase, IUploadService
    {

        private readonly MyAppContext _context;

        public UploadService(MyAppContext context)
        {
            _context = context;
        }

        public async Task<ActionResult<string>> HandleUpload(IFormFile file)
        {
            string filename = file.FileName;

            var extension = Path.GetExtension(filename);

            if (extension != ".csv")
            {
                return BadRequest("file must be a csv");
            }
            await InsertData(file);

            return Ok("Done Uploading");
        }

        public async Task<int> InsertData(IFormFile file)
        {
            byte[] data;
            using Stream stream = file.OpenReadStream();
            data = new byte[stream.Length];
            await stream.ReadAsync(data, 0, (int)stream.Length);

            string data_string = System.Text.Encoding.ASCII.GetString(data);
            string[] rows = data_string.Replace("\r", "").Split("\n");

            string[][] results = new string[rows.Length][];
            int i = 0;
            foreach (string row in rows)
            {
                results[i++] = row.Split(',');
            }

            List<User> users = new List<User>();
            List<Salary> salaries = new List<Salary>();
            // List<string> final_rows = new List<string>();
            string[] headers = rows[0].Split(',');

            for (int j = 1; j < results.Length; j++)
            {
                string[] row = results[j];
                if (row.Length < 14) continue;
                for (int k = 10; k < row.Length; k++)
                {
                    salaries.Add(new Salary
                    {
                        UserId = Convert.ToInt32(row[0]),
                        year = headers[k],
                        amount = Decimal.Parse(row[k]),
                    });
                }
                users.Add(new User
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
                });
            }

            //MySQL connector
            var conString = "Server=localhost;User=root;Password=Nabeel@zeus123;Database=task5;AllowLoadLocalInfile=true;";
            StringBuilder sCommand = new StringBuilder("INSERT INTO user (UserId, Email, Name, Country,State,City,TelephoneNumber,AddressLine1,AddressLine2,DateOfBirth) VALUES ");
            StringBuilder query = new StringBuilder("INSERT INTO salary (Id, UserId,year, amount) VALUES ");
            try
            {
                using (MySqlConnection mConnection = new MySqlConnection(conString))
                {
                    mConnection.Open();
                    List<string> Rows = new List<string>();
                    List<string> salary = new List<string>();
                    // Console.WriteLine(users[1].DateOfBirth.GetType());
                    for (int j = 0; j < users.Count; j++)
                    {
                        Rows.Add(string.Format("('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}')",
                        MySqlHelper.EscapeString(users[j].UserId.ToString()),
                        MySqlHelper.EscapeString(users[j].Email),
                        MySqlHelper.EscapeString(users[j].Name),
                        MySqlHelper.EscapeString(users[j].Country),
                        MySqlHelper.EscapeString(users[j].State),
                        MySqlHelper.EscapeString(users[j].City),
                        MySqlHelper.EscapeString(users[j].TelephoneNumber),
                        MySqlHelper.EscapeString(users[j].AddressLine1),
                        MySqlHelper.EscapeString(users[j].AddressLine2),
                        MySqlHelper.EscapeString(users[j].DateOfBirth)
                        ));
                    }

                    for (int j = 0; j < salaries.Count; j++)
                    {
                        salary.Add(string.Format("('{0}','{1}','{2}','{3}')",
                        MySqlHelper.EscapeString(salaries[j].Id.ToString()),
                        MySqlHelper.EscapeString(salaries[j].UserId.ToString()),
                        MySqlHelper.EscapeString(salaries[j].year),
                        MySqlHelper.EscapeString(salaries[j].amount.ToString())));
                    }


                    sCommand.Append(string.Join(",", Rows));
                    sCommand.Append("ON DUPLICATE KEY UPDATE UserId = VALUES(UserId), Email = VALUES(Email), Name=VALUES(Name), Country = VALUES(Country), State = VALUES(State), City = VALUES(City) , TelePhoneNumber = VALUES(TelePhoneNumber), AddressLine1 = VALUES(AddressLine1), AddressLine2 = VALUES(AddressLine2)");
                    sCommand.Append(";");
                    query.Append(string.Join(",", salary));
                    query.Append("ON DUPLICATE KEY UPDATE UserId = VALUES(UserId), year = VALUES(year), amount=VALUES(amount)");
                    query.Append(";");

                    using (MySqlCommand myCmd = new MySqlCommand(sCommand.ToString(), mConnection))
                    {
                        
                        myCmd.CommandType = System.Data.CommandType.Text;
                        await myCmd.ExecuteNonQueryAsync();
                    }
                    using (MySqlCommand myCmd = new MySqlCommand(query.ToString(), mConnection))
                    {
                        myCmd.CommandType = System.Data.CommandType.Text;
                        await myCmd.ExecuteNonQueryAsync();
                    }

                }
                return 1;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return -1;
            }
        }
    }


}