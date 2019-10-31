using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DotNet.API.Data;
using DotNet.API.Dtos;
using DotNet.API.Helpers;
using DotNet.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DotNet.API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class AdminController : ControllerBase
  {
    private readonly IDatingRepository _repo;
    private readonly DataContext _context;
    private readonly UserManager<User> _userManager;
    private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
    private Cloudinary _cloudinary;
    public AdminController(IDatingRepository repo, DataContext context, UserManager<User> userManager, IOptions<CloudinarySettings> cloudinaryConfig)
    {
      _repo = repo;
      _context = context;
      _userManager = userManager;
      _cloudinaryConfig = cloudinaryConfig;

      Account acc = new Account(
          _cloudinaryConfig.Value.CloudName,
          _cloudinaryConfig.Value.ApiKey,
          _cloudinaryConfig.Value.ApiSecret
      );

      _cloudinary = new Cloudinary(acc);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("usersWithRoles")]
    public async Task<IActionResult> GetUsersWithRoles()
    {
      var userList = await _context.Users
          .OrderBy(x => x.UserName)
          .Select(user => new
          {
            Id = user.Id,
            UserName = user.UserName,
            Roles = (from userRole in user.UserRoles
                     join role in _context.Roles
                       on userRole.RoleId
                       equals role.Id
                     select role.Name
              ).ToList()
          }).ToListAsync();
      return Ok(userList);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("editRoles/{userName}")]
    public async Task<IActionResult> EditRoles(string userName, RoleEditDto roleEditDto)
    {
      var user = await _userManager.FindByNameAsync(userName);

      var userRoles = await _userManager.GetRolesAsync(user);

      var selectedRoles = roleEditDto.RoleNames;

      selectedRoles = selectedRoles ?? new string[] { };
      var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

      if (!result.Succeeded)
        return BadRequest("Failed to add to roles");

      result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

      if (!result.Succeeded)
        return BadRequest("Failed to remove the roles");

      return Ok(await _userManager.GetRolesAsync(user));
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photosForModeration")]
    public async Task<IActionResult> GetPhotosForModeration()
    {
      var photosForModeration = await _context.Photos
        .Where(p => !p.IsApproved)
        .OrderBy(p => p.DateAdded)
        .ToListAsync();

      return Ok(photosForModeration);
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpPost("photos/{id}/approve")]
    public async Task<IActionResult> ApprovePhoto(int id)
    {
      var photoFromRepo = await _repo.GetPhoto(id);

      if (photoFromRepo.IsApproved)
        return BadRequest("This photo has already been approved");

      photoFromRepo.IsApproved = true;

      if (await _repo.SaveAll())
        return NoContent();

      return BadRequest("Could not approve photo");
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpPost("photos/{id}/decline")]
    public async Task<IActionResult> DeletePhoto(int id)
    {
      var photoFromRepo = await _repo.GetPhoto(id);

      if (photoFromRepo.PublicId != null)
      {
        var deleteParams = new DeletionParams(photoFromRepo.PublicId);

        var result = _cloudinary.Destroy(deleteParams);

        if (result.Result == "ok")
          _repo.Delete(photoFromRepo);
      }
      else
      {
        _repo.Delete(photoFromRepo);
      }

      if (await _repo.SaveAll())
        return Ok();

      return BadRequest("Failed to delete the photo");
    }
  }
}
