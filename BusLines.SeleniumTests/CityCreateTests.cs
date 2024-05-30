using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace BusLines.SeleniumTests
{
    public class CityCreateTests : IDisposable
    {
        private readonly IWebDriver _driver;
        private readonly WebDriverWait _wait;

        public CityCreateTests()
        {
            _driver = new ChromeDriver();
            _wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
        }

        public void Dispose()
        {
            _driver.Quit();
        }

        [Fact]
        public void AddCity_ShouldShowSuccessMessage()
        {
            // Navigate to the page
            _driver.Navigate().GoToUrl("http://localhost:5173/admin/cities/addCity");

            // Find the city name input and enter a value
            var cityNameInput = _driver.FindElement(By.Id("cityName"));
            cityNameInput.SendKeys("New City");

            // Find and click the submit button
            var submitButton = _driver.FindElement(By.CssSelector("button[type='submit']"));
            submitButton.Click();

            // Wait for the success message to appear
            _wait.Until(d => d.FindElement(By.CssSelector(".text-green-500")));

            // Verify the success message
            var successMessage = _driver.FindElement(By.CssSelector(".text-green-500")).Text;
            Assert.Contains("City \"New City\" added successfully.", successMessage);
        }
    }
}
