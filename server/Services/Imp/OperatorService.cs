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
            return await _context.Operators.ToListAsync();
        }

        public async Task<Operator> GetOperatorByIdAsync(int id)
        {
            // This method asynchronously retrieves an Operator entity with the specified id from the database
            return await _context.Operators.FindAsync(id);
        }

        public async Task<Operator> AddOperatorAsync(OperatorDTO operatorDTO)
        {
            // Checks if an Operator with the same name already exists
            var existingOperator = await _context.Operators.FirstOrDefaultAsync(c => c.Name == operatorDTO.Name);
            if (existingOperator != null)
            {
                throw new ArgumentException("Operator already exists.");
            }

            // Creates a new Operator instance from the DTO
            var oper = new Operator
            {
                Name = operatorDTO.Name
            };

            // Adds the new Operator entity to the database context
            _context.Operators.Add(oper);

            // Saves the changes to the database asynchronously
            await _context.SaveChangesAsync();

            // Returns the newly added Operator entity
            return oper;
        }

        public async Task UpdateOperatorAsync(int id, OperatorDTO operatorDTO)
        {
            // Finds the Operator entity with the specified id
            var oper = await _context.Operators.FindAsync(id);
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
            // Finds the Operator entity with the specified id
            var oper = await _context.Operators.FindAsync(id);
            if (oper == null)
            {
                throw new ArgumentException("Operator not found.");
            }

            // Removes the Operator entity from the database context
            _context.Operators.Remove(oper);

            // Saves the changes to the database asynchronously
            await _context.SaveChangesAsync();
        }
    }
}
