using RabbitMQ.Client;
using Receive.Models;

namespace Receive.Interface{
    public interface IDataService{
        public (List<User>, List<Salary>) CleanData(string[][] results, string[] headers);

        public void InsertData(List<User> UsersList, List<Salary> SalariesList, string filename);
    }

}