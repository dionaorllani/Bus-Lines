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

        [HttpGet("questions/{id}")]
        public async Task<IActionResult> GetUserQuestion(string id)
        {
            var userQuestion = await _mongoDbContext.UserQuestions.Find(uq => uq.Id == id).FirstOrDefaultAsync();
            if (userQuestion == null)
                return NotFound("User question not found");

            return Ok(userQuestion);
        }

        [HttpPut("questions/{id}")]
        public async Task<IActionResult> UpdateUserQuestion(string id, [FromBody] UserQuestion userQuestion)
        {
            try
            {
                var filter = Builders<UserQuestion>.Filter.Eq(uq => uq.Id, id);
                var update = Builders<UserQuestion>.Update
                    .Set(uq => uq.Question, userQuestion.Question)
                    .Set(uq => uq.AskedAt, userQuestion.AskedAt);

                var result = await _mongoDbContext.UserQuestions.UpdateOneAsync(filter, update);

                if (result.ModifiedCount == 0)
                    return NotFound("User question not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("questions/{id}")]
        public async Task<IActionResult> DeleteUserQuestion(string id)
        {
            try
            {
                var result = await _mongoDbContext.UserQuestions.DeleteOneAsync(uq => uq.Id == id);

                if (result.DeletedCount == 0)
                    return NotFound("User question not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
