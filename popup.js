function validateInput(input, error, min, max) {
  // Remove error message if it exists
  error.textContent = "";

  console.log(input.value);

  // Make sure there is any input
  if (input.value === "") {
    error.textContent = "Minimum price is required";
    return false;
  }

  // Make sure the input is a number
  if (Number.isInteger(input.value)) {
    error.textContent = "Minimum price should be a number";
    return false;
  }

  // Make sure the input is between the given parameters
  if (parseFloat(input.value) < min) {
    error.textContent = `Minimum price should be equal or above ${min}`;
    return false;
  }

  if (parseFloat(input.value) > max) {
    error.textContent = `Minimum price should be equal or below ${max}`;
    return false;
  }

  return true;
}

function watchForm(inputs) {
  const form = document.getElementById("ticketmain_form");

  form.addEventListener("submit", (event) => {
    // Make sure the form doesn't process
    event.preventDefault();

    // Validate every input
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const { parent, target, error, min, max } = input;

      if (!validateInput(target, error, min, max)) {
        toggleLegend(parent, true);
        return;
      }
    }

    // Store every input in Chrome storage
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const { target, label } = input;

      chrome.storage.sync.set({ [label]: parseFloat(target.value) });
    }
  });
}

async function setupForm(inputs) {
  // Load every input from Chrome storage
  for (i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const { label, target } = input;
    const value = await chrome.storage.sync.get([label]);

    target.value = value[label];
  }
}

async function setupLegends() {
  const fields = [
    "ticketmain_fieldset_price",
    "ticketmain_fieldset_amount",
    "ticketmain_fieldset_advanced",
  ];

  const results = await chrome.storage.sync.get(fields);
  const elements = [
    document.getElementById("ticketmain_fieldset_price"),
    document.getElementById("ticketmain_fieldset_amount"),
    document.getElementById("ticketmain_fieldset_advanced"),
  ];

  // Set the status of the fieldsets
  elements.forEach((element) => {
    toggleLegend(element, results[element.id]);
  });
}

function watchLegends() {
  const legends = document.getElementsByTagName("legend");

  for (let i = 0; i < legends.length; i++) {
    const legend = legends[i];
    const parent = legend.parentElement;

    legend.addEventListener("click", () => toggleLegend(parent));
  }
}

function toggleLegend(fieldset, status = null) {
  const legend = fieldset.getElementsByTagName("legend")[0];
  const children = fieldset.getElementsByTagName("div");

  // If no status has been given we'll just toggle the fieldset
  status = status !== null
    ? status
    : legend.classList.contains("ticketmain_closed");

  // Update the storage
  chrome.storage.sync.set({ [fieldset.id]: status });

  // Update the plus / minus symbol
  if (status) {
    legend.classList.remove("ticketmain_closed");
  } else {
    legend.classList.add("ticketmain_closed");
  }

  // Hide every child div
  for (let j = 0; j < children.length; j++) {
    const child = children[j];

    if (status) {
      child.classList.remove("ticketmain_hidden");
    } else {
      child.classList.add("ticketmain_hidden");
    }
  }
}

async function setupButton() {
  const fields = [
    "ticketmain_dropdown_disabled",
  ];

  const results = await chrome.storage.sync.get(fields);
  const elements = [document.getElementById("ticketmain_toggle")];

  // Set the status of the fieldsets
  elements.forEach((element) => {
    toggleButton(element, results[element.id]);
  });
}

function watchButton() {
  const button = document.getElementById("ticketmain_toggle");

  button.addEventListener("change", () => toggleButton(button.checked));
}

function toggleButton(status) {
  const button = document.getElementById("ticketmain_toggle");
  const inputs = document.querySelectorAll("form input");
  const container = document.getElementById("ticketmain_container");

  button.checked = status;

  if (status) {
    container.classList.remove("disabled");
  } else {
    container.classList.add("disabled");
  }

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

    if (status) {
      input.removeAttribute("disabled");
    } else {
      input.setAttribute("disabled", true);
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const inputs = [
    {
      parent: document.getElementById("ticketmain_fieldset_price"),
      target: document.getElementById("ticketmain_price_min_input"),
      error: document.getElementById("ticketmain_price_min_error"),
      label: "ticketmain_price_min",
      max: 100,
      min: 0,
    },
    {
      parent: document.getElementById("ticketmain_fieldset_price"),
      target: document.getElementById("ticketmain_price_max_input"),
      error: document.getElementById("ticketmain_price_max_error"),
      label: "ticketmain_price_max",
      max: 100,
      min: 0,
    },
    {
      parent: document.getElementById("ticketmain_fieldset_amount"),
      target: document.getElementById("ticketmain_amount_min_input"),
      error: document.getElementById("ticketmain_amount_min_error"),
      label: "ticketmain_amount_min",
      max: 100,
      min: 0,
    },
    {
      parent: document.getElementById("ticketmain_fieldset_amount"),
      target: document.getElementById("ticketmain_amount_max_input"),
      error: document.getElementById("ticketmain_amount_max_error"),
      label: "ticketmain_amount_max",
      max: 100,
      min: 0,
    },
    {
      parent: document.getElementById("ticketmain_fieldset_advanced"),
      target: document.getElementById("ticketmain_advanced_interval_input"),
      error: document.getElementById("ticketmain_advanced_interval_error"),
      label: "ticketmain_advanced_interval",
      max: 10,
      min: 0.5,
    },
  ];

  await setupLegends();
  await setupButton();
  await setupForm(inputs);

  watchLegends();
  watchButton();
  watchForm(inputs);
});
