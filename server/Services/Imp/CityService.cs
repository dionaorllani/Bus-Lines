﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Entities;
using server.Models;
using System.Linq;

namespace server.Services.Imp
{
    public class CityService : ICityService
    {
        private readonly BusDbContext _context;

        public CityService(BusDbContext context)
        {
            _context = context;
        }

        public async Task<List<City>> GetCitiesAsync()
        {
            // Get all cities that are not deleted
            return await _context.Cities.Where(c => !c.IsDeleted).ToListAsync();
        }

        public async Task<City> GetCityByIdAsync(int id)
        {
            // Find city by ID that is not deleted
            return await _context.Cities.FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
        }

        public async Task<City> AddCityAsync(CityDTO cityDTO)
        {
            var existingCity = await _context.Cities.FirstOrDefaultAsync(c => c.Name == cityDTO.Name);
            if (existingCity != null && !existingCity.IsDeleted)
            {
                throw new ArgumentException("City already exists.");
            }

            // If city exists and is deleted, update IsDeleted to false
            if (existingCity != null && existingCity.IsDeleted)
            {
                existingCity.IsDeleted = false;
                await _context.SaveChangesAsync();
                return existingCity;
            }

            var city = new City
            {
                Name = cityDTO.Name,
                IsDeleted = false
            };

            _context.Cities.Add(city);
            await _context.SaveChangesAsync();
            return city;
        }

        public async Task UpdateCityAsync(int id, CityDTO cityDTO)
        {
            // Find city by ID
            var city = await _context.Cities.FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
            if (city == null)
            {
                throw new ArgumentException("City not found.");
            }

            // Update city name if provided in the DTO (null-coalescing for optional assignment)
            if (!string.IsNullOrWhiteSpace(cityDTO.Name))
            {
                city.Name = cityDTO.Name;
            }
            // Mark city as modified in context
            _context.Entry(city).State = EntityState.Modified;
            // Save changes to the database
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCityAsync(int id)
        {
            // Find city by ID
            var city = await _context.Cities.FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);
            if (city == null)
            {
                throw new ArgumentException("City not found.");
            }

            // Set IsDeleted to true
            city.IsDeleted = true;
            // Mark city as modified in context
            _context.Entry(city).State = EntityState.Modified;
            // Save changes to the database
            await _context.SaveChangesAsync();
        }
    }
}
