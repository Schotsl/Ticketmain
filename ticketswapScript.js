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
    const ticketPrice = parseFloat(ticket.getElementsByTagName("strong")[0].innerText.split("\n")[0].substring(1));
    tickets.push({ htmlElement: ticket, ticketAmount, ticketPrice });
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

function reloadPage() {
  console.log("Reloading page in " + interval / 1000 + " seconds");
  setTimeout(() => {
    window.location.reload();
  }, interval);
}

function playNotification() {
  const url = chrome.runtime.getURL("assets/audio/notification.mp3");
  const audio = new Audio(url);

  audio.play();
}

function checkForTickets() {
  console.log("Checking for tickets...");
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
    reloadPage();
    return
  }

  // Check all the available tickets
  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];

    // Check if the ticket is within the price range
    if ((ticket.ticketAmount == amount || amount == 0) && ticket.ticketPrice >= minPrice && ticket.ticketPrice <= maxPrice) {
      console.log("Matching ticket found!");
      selectTicket(ticket);

      // playNotification();

      // Wait for new page load
      setTimeout(() => { findBuyTicketButton().click() }, 3000);
      return;
    } else {
      console.log("Ticket didn't match price range");
    }
  }

  // Retry ticket search
  reloadPage();
}

// Update options
let minPrice = 0, maxPrice = 100, amount = 0, interval = 10000, disabled = true;

chrome.storage.sync.get(["ticketmain_min", "ticketmain_max", "ticketmain_amount", "ticketmain_interval", "ticketmain_disabled"], function (result) {
  minPrice = result.ticketmain_min;
  maxPrice = result.ticketmain_max;
  amount = result.ticketmain_amount;
  interval = result.ticketmain_interval;
  disabled = result.ticketmain_disabled;

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync") {
      for (let key in changes) {
        switch (key) {
          case "ticketmain_min":
            minPrice = changes[key].newValue;
            break;
          case "ticketmain_max":
            maxPrice = changes[key].newValue;
            break;
          case "ticketmain_amount":
            amount = changes[key].newValue;
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

  console.log("TicketSwap detected! Running script...");

  if (!disabled) checkForTickets();
  else console.log("Extention is disabled");
});
