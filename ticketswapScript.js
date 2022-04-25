function getTickets() {
  const availableTicketsField = document.querySelector(
    "[data-testid='available-tickets-list']"
    );
    
    if (!availableTicketsField) {
      return [];
    }
    
    const liItems = availableTicketsField.getElementsByTagName("li");
    const tickets = [];

    for (let i = 0; i < liItems.length; i++) {
      const ticket = liItems[i];
      const ticketAmount = parseInt(ticket.getElementsByTagName("h4")[0].innerText.split(" ")[0]);
      const ticketPrice = ticket.getElementsByTagName("strong")[0].innerText.split("\n")[0];
      tickets.push({htmlElement: ticket, ticketAmount, ticketPrice});
    }

    return tickets;
}

function selectTicket(ticket) {
  ticket.htmlElement.getElementsByTagName("a")[0].click();
}

function findBuyTicketButton() {
  const buttons = document.getElementsByTagName("button");
  
  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    if (button.innerText === "Buy ticket") {
      return button;
    }
  }
}

function reloadPage(interval = 10000) {
  console.log("Reloading page in " + interval / 1000 + " seconds");
  setTimeout(() => {
    window.location.reload();
  }, interval);
}

function checkForTickets() {
  console.log("Checking for tickets...");

  // Get options out of storage
  let minPrice, maxPrice, amount, interval, disabled;

  chrome.storage.sync.get(["minPrice", "maxPrice", "amount", "interval", "disabled"], function(items) {
    minPrice = items.minPrice || 0;
    maxPrice = items.maxPrice || 999999;
    amount = items.amount || 0;
    interval = items.interval || 10000;
    disabled = items.disabled || false;
  });

  // Stop when disabled
  if (disabled) {
    return;
  }

  // Get thje tickets
  const tickets = getTickets();

  // Check if there are any tickets
  if (tickets.length === 0) {
    console.log("No tickets found");

    // Retry ticket search
    reloadPage(interval);
    return
  }
  
  // Check all the available tickets
  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];

    // Check if the ticket is within the price range
    if ((ticket.ticketAmount == amount || amount == 0) && ticket.ticketPrice >= minPrice && ticket.ticketPrice <= maxPrice) {
      console.log("Matching ticket found!");
      selectTicket(ticket);
      
      // Wait for new page load
      setTimeout(findBuyTicketButton().click, 3000);
      break;
    } else {
      console.log("Ticket didn't match price range");
    }
  }

  // Retry ticket search
  reloadPage(interval);
}

console.log("TicketSwap detected! Running script...");
let disabled = false;

chrome.storage.sync.get(["disabled"], function(items) {
  disabled = items.disabled || false;
});

if (!disabled) checkForTickets();
else console.log("Extention is disabled");