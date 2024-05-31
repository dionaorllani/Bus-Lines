namespace server.Services.Imp
{
    public interface IChatCompletionService
    {
        Task<string> GetChatCompletionAsync(string question);
    }
}
