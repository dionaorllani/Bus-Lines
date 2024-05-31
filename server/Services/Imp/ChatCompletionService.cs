using server.Models;
using System.Text;
using System.Text.Json;

namespace server.Services.Imp
{
    public class ChatCompletionService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        : IChatCompletionService
    {

        public async Task<string> GetChatCompletionAsync(string question)
        {
            var httpClient = httpClientFactory.CreateClient("ChtpGPT");

            ChatCompletionRequest completionRequest = new()
            {
                Model = "gpt-3.5-turbo",
                MaxTokens = 1000,
                Messages = [
                                new Message()
                                {
                                    Role = "user",
                                    Content = question,

                                }
                            ]
            };


            using var httpReq = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            httpReq.Headers.Add("Authorization", $"Bearer {configuration["OpenAIKey"]}");

            string requestString = JsonSerializer.Serialize(completionRequest);
            httpReq.Content = new StringContent(requestString, Encoding.UTF8, "application/json");

            using HttpResponseMessage? httpResponse = await httpClient.SendAsync(httpReq);
            httpResponse.EnsureSuccessStatusCode();

            var completionResponse = httpResponse.IsSuccessStatusCode ? JsonSerializer.Deserialize<ChatCompletionResponse>(await httpResponse.Content.ReadAsStringAsync()) : null;

            return completionResponse.Choices?[0]?.Message?.Content;

        }
    }
}