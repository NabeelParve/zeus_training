namespace MyApp.Interfaces.Queue{
    public interface IQueueService{
        void AddTask(string filename, byte[] FileStream){}

        void ListenTask(){}
    }
}