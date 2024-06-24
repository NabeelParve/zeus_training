using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using myapi.Models;

namespace myapi.Controllers
{
    [Route("api/edit")]
    [ApiController]
    public class CrudController : ControllerBase
    {
        private readonly UserContext _context;

        public CrudController(UserContext context)
        {
            _context = context;
        }

        // GET: api/Crud
        [HttpGet]
        public async Task<ActionResult<List<User>>> Getusers(int pageNo)
        {
            var start = pageNo*20;
            
            return await _context.users.Skip(start).Take(20).ToListAsync();
        }

        // GET: api/Crud/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }
        
        [HttpGet("all")]
        public async Task<ActionResult<int>> GetCount()
        {
            var count = await _context.users.CountAsync();

            return count;
        }

        // PUT: api/Crud/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Crud
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        [HttpPost("multiple")]
        public async Task<ActionResult<IEnumerable<User>>> PostUsers(List<User> users)
        {
            foreach(User user in users){
            _context.users.Add(user);
            }
            await _context.SaveChangesAsync();

            return  users;
        }

        // DELETE: api/Crud/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        

        private bool UserExists(int id)
        {
            return _context.users.Any(e => e.Id == id);
        }
    }
}
