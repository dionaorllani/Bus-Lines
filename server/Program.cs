using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using server.DataAccess;
using server.Mappings;
using server.Services;
using server.Services.Imp;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// Configure ReactConnection
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:5173") 
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

// Configure Database Connection
builder.Services.AddDbContext<BusDbContext>(options =>
options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

//Register BusLineService
builder.Services.AddScoped<IBusLineService, BusLineService>();

// Register BusScheduleService
builder.Services.AddScoped<IBusScheduleService, BusScheduleService>();

//Register CityService
builder.Services.AddScoped<ICityService, CityService>();

//Register OperatorService
builder.Services.AddScoped<IOperatorService, OperatorService>();

//Register TicketService
builder.Services.AddScoped<ITicketService, TicketService>();

//Register UserService
builder.Services.AddScoped<IUserService, UserService>();

//Register UserService
builder.Services.AddScoped<IStopService, StopService>();

// Register JwtService
builder.Services.AddSingleton<JwtService>();

// Configure JWT authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = configuration["Jwt:Issuer"],
        ValidAudience = configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
    };
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

// Enable authentication
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
