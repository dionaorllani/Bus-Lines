using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Security.Cryptography;

namespace server.Utilities
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            return $"{Convert.ToBase64String(salt)}:{hashed}";
        }

        public static bool VerifyPassword(string enteredPassword, string hashedPassword)
        {
            // Separate salt and hashed password
            var parts = hashedPassword.Split(':');
            if (parts.Length != 2)
            {
                return false; // Invalid format
            }

            var salt = Convert.FromBase64String(parts[0]);
            var hashed = Convert.FromBase64String(parts[1]);

            // Hash the entered password with the retrieved salt
            var enteredHashed = KeyDerivation.Pbkdf2(
                password: enteredPassword,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8);

            // Compare the two hashed passwords
            return hashed.SequenceEqual(enteredHashed);
        }
    }
}