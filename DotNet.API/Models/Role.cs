using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace DotNet.API.Models
{
    public class Role: IdentityRole<int>
    {
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}
