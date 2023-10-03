# README

Lösningen är skriven av Casper Strand

## Backend

Uppsatt i EntityFramework i .NET Core enligt instruktionerna, code-first datamodeller och nyttiga API-endpoints för allt som behövs.

# Misc

Server=localhost\SQLEXPRESS;Database=vehicledb;Trusted_Connection=True;TrustServerCertificate=True;

You need .NET Core installed and then to install EF use this:

dotnet tool install --global dotnet-ef

Then to setup database use:

dotnet ef migrations add InitialCreate
dotnet ef database update

https://localhost:7262/api/vehicles/hello

