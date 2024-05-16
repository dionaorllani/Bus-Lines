namespace server.Entities
{
    public enum UserRole
    {
        User = 0,
        Admin = 1
    }

    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; } // Add Role property
    }
}