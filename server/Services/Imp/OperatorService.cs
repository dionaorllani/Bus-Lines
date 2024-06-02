using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;

namespace server.Services
{
    public class OperatorService : IOperatorService
    {
        private readonly BusDbContext _context; // Injected dependency - a DbContext instance for interacting with the database

        public OperatorService(BusDbContext context)
        {
            _context = context; // Assigns the injected DbContext instance to the private field
        }

        public async Task<List<Operator>> GetOperatorsAsync()
        {
            // This method asynchronously retrieves all Operator entities from the database and returns them as a list
            return await _context.Operators.Where(c => !c.IsDeleted).ToListAsync();
        }

        public async Task<Operator> GetOperatorByIdAsync(int id)
        {
            // This method asynchronously retrieves an Operator entity with the specified id from the database
            return await _context.Operators.FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted);
        }

        public async Task<Operator> AddOperatorAsync(OperatorDTO operatorDTO)
        {
            // Check if operator already exists with the same name
            var existingOperator = await _context.Operators.FirstOrDefaultAsync(o => o.Name == operatorDTO.Name);

            // If operator exists and is not deleted, throw an exception
            if (existingOperator != null && !existingOperator.IsDeleted)
            {
                throw new ArgumentException("Operator already exists.");
            }

            // If operator exists and is deleted, update IsDeleted to false
            if (existingOperator != null && existingOperator.IsDeleted)
            {
                existingOperator.IsDeleted = false;
                await _context.SaveChangesAsync();
                return existingOperator;
            }

            // If operator does not exist, create a new Operator entity from the DTO
            var oper = new Operator
            {
                Name = operatorDTO.Name,
                IsDeleted = false
            };

            // Add operator to context and save changes
            _context.Operators.Add(oper);
            await _context.SaveChangesAsync();

            // Return the newly created operator
            return oper;
        }

        public async Task UpdateOperatorAsync(int id, OperatorDTO operatorDTO)
        {
            // Finds the Operator entity with the specified id
            var oper = await _context.Operators.FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted);
            if (oper == null)
            {
                throw new ArgumentException("Operator not found.");
            }

            // Updates the Operator properties if values are provided in the DTO
            if (!string.IsNullOrWhiteSpace(operatorDTO.Name))
            {
                oper.Name = operatorDTO.Name;
            }

            // Sets the state of the entity to Modified to indicate changes
            _context.Entry(oper).State = EntityState.Modified;

            // Saves the changes to the database asynchronously
            await _context.SaveChangesAsync();
        }

        public async Task DeleteOperatorAsync(int id)
        {
            var oper = await _context.Operators.FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted);
            if (oper == null)
            {
                throw new ArgumentException("Operator not found.");
            }

            oper.IsDeleted = true;
            _context.Entry(oper).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }
    }
}
