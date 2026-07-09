using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using skyora1.Controllers;
using skyora1.Models;
using skyora1.Repository;
using Xunit;

namespace SkyOra1.Tests
{
    public class UserControllerTests
    {
        [Fact]
        public async Task GetAllUsers_ReturnsOkWithUserList()
        {
            var users = new List<User>
            {
                new User { UserId = 1, Name = "Test User", Email = "test@example.com" }
            };

            var mockRepo = new Mock<IUser>();
            mockRepo.Setup(r => r.GetAllUsers()).ReturnsAsync(users);

            var controller = new UserController(mockRepo.Object);
            var actionResult = await controller.GetAllUsers();

            var okResult = Assert.IsType<OkObjectResult>(actionResult);
            var returnedUsers = Assert.IsType<List<User>>(okResult.Value);
            Assert.Single(returnedUsers);
            Assert.Equal("Test User", returnedUsers[0].Name);
        }

        [Fact]
        public async Task GetUserById_ReturnsNotFound_WhenUserDoesNotExist()
        {
            var mockRepo = new Mock<IUser>();
            mockRepo.Setup(r => r.GetUserById(It.IsAny<int>())).ReturnsAsync((User)null!);

            var controller = new UserController(mockRepo.Object);
            var actionResult = await controller.GetUserById(999);

            Assert.IsType<NotFoundResult>(actionResult);
        }

        [Fact]
        public async Task GetUserById_ReturnsOk_WhenUserExists()
        {
            var expectedUser = new User { UserId = 42, Name = "SkyOra Tester", Email = "tester@skyora.com" };
            var mockRepo = new Mock<IUser>();
            mockRepo.Setup(r => r.GetUserById(42)).ReturnsAsync(expectedUser);

            var controller = new UserController(mockRepo.Object);
            var actionResult = await controller.GetUserById(42);

            var okResult = Assert.IsType<OkObjectResult>(actionResult);
            var returnedUser = Assert.IsType<User>(okResult.Value);
            Assert.Equal("SkyOra Tester", returnedUser.Name);
        }
    }
}
