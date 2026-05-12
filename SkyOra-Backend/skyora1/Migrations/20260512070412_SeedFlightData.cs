using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace skyora1.Migrations
{
    /// <inheritdoc />
    public partial class SeedFlightData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Delete existing flights and reset identity
            migrationBuilder.Sql("SET IDENTITY_INSERT [flights] OFF");
            migrationBuilder.Sql("DELETE FROM [flights]");
            migrationBuilder.Sql("DBCC CHECKIDENT ('[flights]', RESEED, 0)");
            
            migrationBuilder.InsertData(
                table: "flights",
                columns: new[] { "FlightId", "ArrivalTime", "AvailableBusinessSeats", "AvailableEconomySeats", "BusinessPrice", "DepartureTime", "Destination", "EconomyPrice", "FlightNo", "Source", "TotalBusinessSeats", "TotalEconomySeats" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 5, 13, 11, 0, 0, 0, DateTimeKind.Unspecified), 32, 150, 15000m, new DateTime(2026, 5, 13, 8, 0, 0, 0, DateTimeKind.Unspecified), "Delhi", 8000m, "SK101", "Mumbai", 32, 150 },
                    { 2, new DateTime(2026, 5, 13, 13, 0, 0, 0, DateTimeKind.Unspecified), 32, 150, 14000m, new DateTime(2026, 5, 13, 9, 0, 0, 0, DateTimeKind.Unspecified), "Bengaluru", 7500m, "SK102", "Delhi", 32, 150 },
                    { 3, new DateTime(2026, 5, 13, 12, 0, 0, 0, DateTimeKind.Unspecified), 32, 150, 10000m, new DateTime(2026, 5, 13, 10, 0, 0, 0, DateTimeKind.Unspecified), "Chennai", 5500m, "SK103", "Bengaluru", 32, 150 },
                    { 4, new DateTime(2026, 5, 13, 13, 0, 0, 0, DateTimeKind.Unspecified), 32, 150, 6000m, new DateTime(2026, 5, 13, 11, 0, 0, 0, DateTimeKind.Unspecified), "Pune", 3000m, "SK104", "Mumbai", 32, 150 },
                    { 5, new DateTime(2026, 5, 13, 13, 0, 0, 0, DateTimeKind.Unspecified), 32, 150, 5000m, new DateTime(2026, 5, 13, 12, 0, 0, 0, DateTimeKind.Unspecified), "Jaipur", 2500m, "SK105", "Delhi", 32, 150 },
                    { 6, new DateTime(2026, 5, 13, 16, 0, 0, 0, DateTimeKind.Unspecified), 32, 150, 12000m, new DateTime(2026, 5, 13, 13, 0, 0, 0, DateTimeKind.Unspecified), "Delhi", 6500m, "SK106", "Kolkata", 32, 150 },
                    { 7, new DateTime(2026, 5, 13, 16, 0, 0, 0, DateTimeKind.Unspecified), 32, 150, 9000m, new DateTime(2026, 5, 13, 14, 0, 0, 0, DateTimeKind.Unspecified), "Bengaluru", 4500m, "SK107", "Hyderabad", 32, 150 },
                    { 8, new DateTime(2026, 5, 13, 17, 0, 0, 0, DateTimeKind.Unspecified), 32, 150, 8000m, new DateTime(2026, 5, 13, 15, 0, 0, 0, DateTimeKind.Unspecified), "Ahmedabad", 4000m, "SK108", "Mumbai", 32, 150 },
                    { 9, new DateTime(2026, 5, 13, 18, 0, 0, 0, DateTimeKind.Unspecified), 32, 150, 9500m, new DateTime(2026, 5, 13, 16, 0, 0, 0, DateTimeKind.Unspecified), "Bengaluru", 5000m, "SK109", "Kochi", 32, 150 },
                    { 10, new DateTime(2026, 5, 13, 19, 0, 0, 0, DateTimeKind.Unspecified), 32, 150, 7000m, new DateTime(2026, 5, 13, 17, 0, 0, 0, DateTimeKind.Unspecified), "Delhi", 3500m, "SK110", "Lucknow", 32, 150 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "flights",
                keyColumn: "FlightId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "flights",
                keyColumn: "FlightId",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "flights",
                keyColumn: "FlightId",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "flights",
                keyColumn: "FlightId",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "flights",
                keyColumn: "FlightId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "flights",
                keyColumn: "FlightId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "flights",
                keyColumn: "FlightId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "flights",
                keyColumn: "FlightId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "flights",
                keyColumn: "FlightId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "flights",
                keyColumn: "FlightId",
                keyValue: 10);
        }
    }
}
