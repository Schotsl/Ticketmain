function validateInput(inputElement, errorElement, minValue, maxValue) {
  // Remove error message if it exists
  errorElement.textContent = "";

  // Make sure there is any input
  if (inputElement.value === "") {
    errorElement.textContent = "Minimum price is required";
    return false;
  }

  // Make sure the input is a number
  if (Number.isInteger(inputElement.value)) {
    errorElement.textContent = "Minimum price should be a number";
    return false;
  }

  // Make sure the input is between the given parameters
  if (inputElement.value < minValue) {
    errorElement.textContent = "Minimum price should be equal or above 0";
    return false;
  }

  if (inputElement.value > maxValue) {
    errorElement.textContent = "Minimum price should be equal or below 100";
    return false;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const inputObjects = [
    {
      input: document.getElementById("ticketmain_price_min_input"),
      error: document.getElementById("ticketmain_price_min_error"),
      label: "ticketmain_price_min",
      max: 100,
      min: 0,
    },
    {
      input: document.getElementById("ticketmain_price_max_input"),
      error: document.getElementById("ticketmain_price_max_error"),
      label: "ticketmain_price_max",
      max: 100,
      min: 0,
    },
    {
      input: document.getElementById("ticketmain_amount_min_input"),
      error: document.getElementById("ticketmain_amount_min_error"),
      label: "ticketmain_amount_min",
      max: 100,
      min: 0,
    },
    {
      input: document.getElementById("ticketmain_amount_max_input"),
      error: document.getElementById("ticketmain_amount_max_error"),
      label: "ticketmain_amount_max",
      max: 100,
      min: 0,
    },
    {
      input: document.getElementById("ticketmain_advanced_interval_input"),
      error: document.getElementById("ticketmain_advanced_interval_error"),
      label: "ticketmain_advanced_interval",
      max: 10,
      min: 0.5,
    },
  ];

  const popupInputs = document.querySelectorAll("form input");
  const legendElements = document.getElementsByTagName("legend");

  const formElement = document.getElementById("ticketmain_form");
  const toggleElement = document.getElementById("ticketmain_toggle");
  const containerElement = document.getElementById("ticketmain_container");

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();

    // if (!popupEnabled) return;

    // Validate every input
    inputObjects.forEach((inputObject) => {
      const { input, error, min, max } = inputObject;
      return !validateInput(input, error, min, max);
    });

    // Store every input in Chrome storage
    inputObjects.forEach((inputObject) => {
      const { input, label } = inputObject;
      chrome.storage.sync.set({ [label]: input.value });
    });
  });

  chrome.storage.sync.get(["ticketmain_dropdown_disabled"], (result) => {
    updatedDisabled(
      result.ticketmain_dropdown_disabled,
      containerElement,
      popupInputs,
      toggleElement,
    );
  });

  // Load every input from Chrome storage
  inputObjects.forEach((inputObject) => {
    const { label, input } = inputObject;

    chrome.storage.sync.get([label], (result) => {
      input.value = result[label];
    });
  });

  // Manage the dropdowns
  for (let i = 0; i < legendElements.length; i++) {
    const legendElement = legendElements[i];

    legendElement.addEventListener("click", () => {
      const divElements = legendElement.parentElement.getElementsByTagName(
        "div",
      );

      legendElement.classList.toggle("ticketmain_closed");

      for (let j = 0; j < divElements.length; j++) {
        const divElement = divElements[j];

        divElement.classList.toggle("ticketmain_hidden");
      }

      for (const popupInput of popupInputs) {
        popupInput.setAttribute("disabled", true);
      }
    });
  }

  // Manage the toggle
  toggleElement.addEventListener("change", () => {
    updatedDisabled(
      !toggleElement.checked,
      containerElement,
      popupInputs,
      toggleElement,
    );
  });
});

function updatedDisabled(
  disabled,
  containerElement,
  popupInputs,
  toggleElement,
) {
  // Update the chrome storage
  chrome.storage.sync.set({ ticketmain_dropdown_disabled: disabled });

  toggleElement.checked = !disabled;

  if (disabled) {
    containerElement.classList.add("disabled");

    for (const popupInput of popupInputs) {
      popupInput.setAttribute("disabled", true);
    }
  } else {
    containerElement.classList.remove("disabled");

    for (const popupInput of popupInputs) {
      popupInput.removeAttribute("disabled");
    }
  }
}
