using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace BusLines.SeleniumTests
{
    public class StopCreateTests : IDisposable
    {
        private readonly IWebDriver _driver;
        private readonly WebDriverWait _wait;

        public StopCreateTests()
        {
            _driver = new ChromeDriver();
            _wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
        }

        public void Dispose()
        {
            _driver.Quit();
        }

        [Fact]
        public void AddStop_ShouldShowSuccessMessage()
        {
            // Navigate to the page
            _driver.Navigate().GoToUrl("http://localhost:5173/admin/stops/addStop"); // Adjust the URL as needed

            // Find the station name input and enter a value
            var stationNameInput = _driver.FindElement(By.Id("stationName"));
            stationNameInput.SendKeys("New Station");

            //Wait for the city dropdown to be populated and select a city
            _wait.Until(d => d.FindElement(By.Id("cityName")).FindElements(By.TagName("option")).Count > 1);
            var cityNameSelect = new SelectElement(_driver.FindElement(By.Id("cityName")));
            cityNameSelect.SelectByText("Prishtina"); // Adjust based on available cities

            // Find and click the submit button
            var submitButton = _driver.FindElement(By.CssSelector("button[type='submit']"));
            submitButton.Click();

            // Wait for the success message to appear
            _wait.Until(d => d.FindElement(By.CssSelector(".text-green-500")));

            // Verify the success message
            var successMessage = _driver.FindElement(By.CssSelector(".text-green-500")).Text;
            Assert.Contains("Stop \"Station 4\" in \"Prishtina\" added successfully.", successMessage);
        }
    }
}
