/**
 * Find all the tickets on the page
 * @returns {Array} Array of ticket objects
 */
function getTickets() {
  const availableTicketsField = document.querySelector(
    "[data-testid='available-tickets-list']",
  );

  if (!availableTicketsField) {
    return [];
  }

  const listItems = availableTicketsField.getElementsByTagName("li");
  const tickets = [];

  for (let i = 0; i < listItems.length; i++) {
    const ticket = listItems[i];
    const ticketAmount = parseInt(
      ticket.getElementsByTagName("h4")[0].innerText.split(" ")[0],
    );
    const ticketPrice = parseFloat(
      ticket.getElementsByTagName("strong")[0].innerText.split("\n")[0]
        .substring(1),
    );
    tickets.push({ htmlElement: ticket, ticketAmount, ticketPrice });
  }

  return tickets;
}

/**
 * Follow the provided ticket
 * @param {{ htmlElement: HTMLElement, ticketAmount: number, ticketPrice: number }} ticket
 */
function selectTicket(ticket) {
  ticket.htmlElement.getElementsByTagName("a")[0].click();
}

/**
 * Search the page for the buy ticket button
 * @returns {HTMLElement} The buy ticket button
 */
function findBuyTicketButton() {
  const buttons = document.getElementsByTagName("button");

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    if (button.innerText === "Buy ticket") {
      return button;
    }
  }
}

/**
 * Reload the page
 */
function reloadPage() {
  console.log("Reloading page in " + interval / 1000 + " seconds");
  setTimeout(() => {
    window.location.reload();
  }, interval);
}

/**
 * Automatically search for tickets
 */
function checkForTickets() {
  console.log("Checking for tickets...");
  // Stop when disabled
  if (disabled) {
    return;
  }

  // Get the tickets
  const tickets = getTickets();

  // Check if there are any tickets
  if (tickets.length === 0) {
    console.log("No tickets found");

    // Retry ticket search
    reloadPage();
    return;
  }

  // Check all the available tickets
  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];

    // Check if the ticket is within the price range
    if (
      (ticket.ticketAmount <= maxAmount && ticket.ticketAmount >= minAmount) &&
      ticket.ticketPrice >= minPrice && ticket.ticketPrice <= maxPrice
    ) {
      console.log("Matching ticket found!");
      selectTicket(ticket);

      // Wait for new page load
      setTimeout(() => {
        findBuyTicketButton().click();
      }, 3000);
      return;
    } else {
      console.log("Ticket didn't match price range");
    }
  }

  // Retry ticket search
  reloadPage();
}

// User variables
let minPrice = 0.0,
  maxPrice = 100.0,
  minAmount = 1,
  maxAmount = 10,
  interval = 5000,
  disabled = true;

// Get user variables from storage
chrome.storage.sync.get([
  "ticketmain_price_min",
  "ticketmain_price_max",
  "ticketmain_amount_min",
  "ticketmain_amount_max",
  "ticketmain_interval",
  "ticketmain_disabled",
], function (result) {
  minPrice = result.ticketmain_price_min;
  maxPrice = result.ticketmain_price_max;
  minAmount = result.ticketmain_amount_min;
  maxAmount = result.ticketmain_amount_max;
  interval = result.ticketmain_interval;
  disabled = result.ticketmain_disabled;

  // Register listener for changes in user variables
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync") {
      for (const key in changes) {
        switch (key) {
          case "ticketmain_price_min":
            minPrice = changes[key].newValue;
            break;
          case "ticketmain_price_max":
            maxPrice = changes[key].newValue;
            break;
          case "ticketmain_amount_min":
            minAmount = changes[key].newValue;
            break;
          case "ticketmain_amount_max":
            maxAmount = changes[key].newValue;
            break;
          case "ticketmain_interval":
            interval = changes[key].newValue;
            break;
          case "ticketmain_disabled":
            disabled = changes[key].newValue;
            if (!disabled) checkForTickets();
            break;
        }
      }
    }
  });

  if (!disabled) checkForTickets();
});
