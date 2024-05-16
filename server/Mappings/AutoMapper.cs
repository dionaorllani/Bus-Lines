using AutoMapper;
using server.DTOs;
using server.Entities;
using server.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace server.Mappings
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<BusLine, BusLineDTO>().ReverseMap();
            CreateMap<BusSchedule, BusScheduleDTO>().ReverseMap();
            CreateMap<City, CityDTO>().ReverseMap();
            CreateMap<Operator, OperatorDTO>().ReverseMap();
            CreateMap<Stop, StopDTO>().ReverseMap();
            CreateMap<Ticket, TicketDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();
        }
    }
}
