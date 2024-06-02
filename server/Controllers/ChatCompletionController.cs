using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using server.DataAccess;
using server.Entities;
using server.Models;
using server.Services.Imp;
using System;
using System.Threading.Tasks;

namespace OpenAI_ChatGPT.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatCompletionController : ControllerBase
    {
        private readonly IChatCompletionService _chatCompletionService;
        private readonly MongoDbContext _mongoDbContext;

        public ChatCompletionController(IChatCompletionService chatCompletionService, MongoDbContext mongoDbContext)
        {
            _chatCompletionService = chatCompletionService;
            _mongoDbContext = mongoDbContext;
        }

        [HttpGet("answer")]
        public async Task<IActionResult> Get(string question)
        {
            // Store the question in MongoDB
            var userQuestion = new UserQuestion
            {
                Id = Guid.NewGuid().ToString(),
                Question = question,
                AskedAt = DateTime.UtcNow
            };

            await _mongoDbContext.UserQuestions.InsertOneAsync(userQuestion);

/*            var response = await _chatCompletionService.GetChatCompletionAsync(question);*/
            return Ok();
        }

        [HttpGet("questions")]
        public async Task<IActionResult> GetUserQuestions()
        {
            var userQuestions = await _mongoDbContext.UserQuestions.Find(_ => true).ToListAsync();
            return Ok(userQuestions);
        }
    }
}
