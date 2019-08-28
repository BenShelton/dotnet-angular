using System.Threading.Tasks;
using DotNet.API.Data;
using DotNet.API.Dtos;
using DotNet.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace DotNet.API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly IAuthRepository _repo;
    public AuthController(IAuthRepository repo)
    {
      _repo = repo;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
    {
        // TODO: validate request

        userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

        if (await _repo.UserExists(userForRegisterDto.Username))
            return BadRequest("Username already exists");

        var userToCreate = new User
        {
            Username = userForRegisterDto.Username
        };

        var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

        return StatusCode(201); // TODO: Return user route
    }
  }
}
