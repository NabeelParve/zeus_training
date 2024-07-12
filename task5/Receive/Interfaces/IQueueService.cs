using System.Text;

namespace Receive.Interface{
    public interface IQueueService{
        void AddTask(StringBuilder data, string filename, string BatchName){}

        void ListenTask(){}
    }
}