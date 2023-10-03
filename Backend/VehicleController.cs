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

    [HttpGet("all")]
    public IActionResult GetAllVehicles()
    {
        var vehicles = _context.Vehicles.ToList();
        return Ok(vehicles);
    }

    [HttpGet("get/{id}")]
    public IActionResult GetVehicleById(int id)
    {
        var vehicle = _context.Vehicles.Find(id);

        if (vehicle == null)
            return NotFound(); // 404

        return Ok(vehicle);
    }

    [HttpPost("create")]
    public IActionResult CreateVehicle([FromBody] Vehicle vehicle)
    {
        if (vehicle == null)
            return BadRequest(); // 400, incase request body is empty or somehow invalid

        _context.Vehicles.Add(vehicle);
        _context.SaveChanges();

        return CreatedAtAction(nameof(GetVehicleById), new { id = vehicle.Id }, vehicle);
    }

    [HttpPut("update/{id}")]
    public IActionResult UpdateVehicle(int id, [FromBody] Vehicle updatedVehicle)
    {
        if (updatedVehicle == null)
            return BadRequest(); // 400, incase request body is empty or somehow invalid

        var existingVehicle = _context.Vehicles.Find(id);

        if (existingVehicle == null)
            return NotFound(); // 404

        // Update the properties of the existing vehicle with the values from updatedVehicle.
        existingVehicle.VIN = updatedVehicle.VIN;
        existingVehicle.LicensePlateNumber = updatedVehicle.LicensePlateNumber;
        existingVehicle.ModelName = updatedVehicle.ModelName;
        existingVehicle.Brand = updatedVehicle.Brand;
        existingVehicle.VehicleEquipment = updatedVehicle.VehicleEquipment;

        _context.SaveChanges();

        return Ok(existingVehicle);
    }

    [HttpDelete("delete/{id}")]
    public IActionResult DeleteVehicle(int id)
    {
        var vehicle = _context.Vehicles.Find(id);

        if (vehicle == null)
            return NotFound(); // 404

        _context.Vehicles.Remove(vehicle);
        _context.SaveChanges();

        return NoContent(); // 204 return if success
    }

    [HttpGet("hello")]
    public IActionResult HelloWorld()
    {
        return Ok("Hello World!");
    }
}
