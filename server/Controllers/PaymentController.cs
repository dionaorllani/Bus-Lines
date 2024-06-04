using System;
using Microsoft.AspNetCore.Mvc;
using server.DataAccess;
using server.Models;
using server.Services.Imp;
using Microsoft.EntityFrameworkCore;
using Stripe;
using server.Entities;
using Stripe.Checkout;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Stripe.Climate;

namespace server.Controllers
{
    [ApiController]
    [Route("create-checkout-session")]
    public class PaymentsController : ControllerBase
    {
        private readonly BusDbContext _context;

        public PaymentsController(BusDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public ActionResult Create(int id)
        {
            var ticket = _context.Tickets.Include(t => t.BusSchedule).FirstOrDefault(t => t.Id == id);
            var domain = "http://localhost:5173";
            var options = new SessionCreateOptions
            {
                LineItems = new List<SessionLineItemOptions>
                {
                  new SessionLineItemOptions
                  {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long)ticket.BusSchedule.Price * 100,
                        Currency = "eur",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Bus Ticket",
                        },
                    },
                    Quantity = 1,
                  },
                },
                Mode = "payment",
                SuccessUrl = $"{domain}/success",
                CancelUrl = $"{domain}/cancel",
            };
            var service = new SessionService();
            Session session = service.Create(options);

            Response.Headers.Add("Location", session.Url);
            return new OkObjectResult(new { url = session.Url });
        }
    }
}

