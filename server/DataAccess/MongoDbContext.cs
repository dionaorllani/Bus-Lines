using MongoDB.Driver;
using server.Entities;
using server.Models;

namespace server.DataAccess
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(string connectionString, string databaseName)
        {
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }
        public IMongoCollection<UserQuestion> UserQuestions => _database.GetCollection<UserQuestion>("UserQuestions");
    }
}
