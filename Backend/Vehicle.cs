using System;
using System.Text.Json;

public class Vehicle
{
    public int Id { get; set; }
    public string VIN { get; set; }
    public string LicensePlateNumber { get; set; }
    public string ModelName { get; set; }
    public string Brand { get; set; }
    public string VehicleEquipment { get; set; }

    public List<string> GetEquipmentList()
    {
        return JsonSerializer.Deserialize<List<string>>(VehicleEquipment);
    }
}