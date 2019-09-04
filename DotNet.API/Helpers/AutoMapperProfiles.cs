using AutoMapper;
using DotNet.API.Dtos;
using DotNet.API.Models;

namespace DotNet.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>();
            CreateMap<User, UserForDetailedDto>();
        }
    }
}
