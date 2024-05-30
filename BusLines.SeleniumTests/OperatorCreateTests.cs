using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using Xunit;

namespace MyApp.SeleniumTests
{
    public class OperatorCreateTests : IDisposable
    {
        private readonly IWebDriver _driver;
        private readonly WebDriverWait _wait;

        public OperatorCreateTests()
        {
            _driver = new ChromeDriver();
            _wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
        }

        public void Dispose()
        {
            _driver.Quit();
        }

        [Fact]
        public void AddOperator_ShouldShowSuccessMessage()
        {
            // Navigate to the page
            _driver.Navigate().GoToUrl("http://localhost:5173/admin/operators/addOperator"); 

            // Find the operator name input and enter a value
            var operatorNameInput = _driver.FindElement(By.Id("operatorName"));
            operatorNameInput.SendKeys("New Operator");

            // Find and click the submit button
            var submitButton = _driver.FindElement(By.CssSelector("button[type='submit']"));
            submitButton.Click();

            // Wait for the success message to appear
            _wait.Until(d => d.FindElement(By.CssSelector(".text-green-500")));

            // Verify the success message
            var successMessage = _driver.FindElement(By.CssSelector(".text-green-500")).Text;
            Assert.Contains("Operator \"New Operator\" added successfully.", successMessage);
        }
    }
}
