using Microsoft.AspNetCore.Mvc;

[Route("api/vehicles")]
[ApiController]
public class VehicleController : ControllerBase
{
    private readonly VehicleDbContext _context;

    public VehicleController(VehicleDbContext context)
    {
        _context = context;
    }

    [HttpGet("hello")]
    public IActionResult HelloWorld()
    {
        return Ok("Hello World!");
    }

    // Implement CRUD actions here
}
