using Microsoft.AspNetCore.Mvc;
using server.Services.Imp;

namespace OpenAI_ChatGPT.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatCompletionController(IChatCompletionService chatCompletionService) : ControllerBase
    {

        [HttpGet("answer")]
        public async Task<IActionResult> Get(string question)
        {
            var response = await chatCompletionService.GetChatCompletionAsync(question);
            return Ok(response);
        }
    }
}