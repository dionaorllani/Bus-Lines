using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
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

// Add Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // Define the BearerAuth scheme that's in use
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter into field the word 'Bearer' followed by a space and the JWT value.",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
          new OpenApiSecurityScheme
          {
            Reference = new OpenApiReference
            {
              Type = ReferenceType.SecurityScheme,
              Id = "Bearer"
            }
          },
          new string[] {}
        }
    });
});

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

// Register MongoDbContext
builder.Services.AddSingleton<MongoDbContext>(sp =>
{
    var connectionString = configuration["MongoDB:ConnectionString"];
    var databaseName = configuration["MongoDB:DatabaseName"];
    return new MongoDbContext(connectionString, databaseName);
});

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

//Register TokenService
builder.Services.AddTransient<ITokenService, TokenService>();

// Register HttpClient service
builder.Services.AddHttpClient();

// Register ChatCompletionService
builder.Services.AddScoped<IChatCompletionService, ChatCompletionService>();

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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),
        ClockSkew = TimeSpan.Zero
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
