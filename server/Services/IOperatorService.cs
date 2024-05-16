using server.Entities;
using server.Models;

namespace server.Services
{
    public interface IOperatorService
    {
        public Task<List<Operator>> GetOperatorsAsync();
        public Task<Operator> GetOperatorByIdAsync(int id);
        public Task<Operator> AddOperatorAsync(OperatorDTO operatorDTO);
        public Task UpdateOperatorAsync(int id, OperatorDTO operatorDTO);
        public Task DeleteOperatorAsync(int id);

    }
}