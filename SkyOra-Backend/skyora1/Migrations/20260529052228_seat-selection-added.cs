using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace skyora1.Migrations
{
    /// <inheritdoc />
    public partial class seatselectionadded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SeatNumber",
                table: "passengers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SeatType",
                table: "passengers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SeatNumber",
                table: "passengers");

            migrationBuilder.DropColumn(
                name: "SeatType",
                table: "passengers");
        }
    }
}
