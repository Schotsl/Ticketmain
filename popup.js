const inputs = [
  {
    input: 'ticketmain_price_min_input',
    error: 'ticketmain_price_min_error',
    max: 100,
    min: 0,
  },
  {
    input: 'ticketmain_price_max_input',
    error: 'ticketmain_price_max_error',
    max: 100,
    min: 0,
  },
  {
    input: 'ticketmain_amount_min_input',
    error: 'ticketmain_amount_min_error',
    max: 100,
    min: 0,
  },
  {
    input: 'ticketmain_amount_min_input',
    error: 'ticketmain_amount_max_error',
    max: 100,
    min: 0,
  },
  {
    input: 'ticketmain_advanced_interval_input',
    error: 'ticketmain_advanced_interval_error',
    max: 10,
    min: 0.5,
  }
]

function validateInput(inputElement, errorElement, minValue, maxValue) {
  console.log(inputElement);
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
  let popupInputs = document.querySelectorAll('form input');
  let popupEnabled = false;

  const legendElements = document.getElementsByTagName("legend");
  
  const formElement = document.getElementById("ticketmain_form");
  const toggleElement = document.getElementById("ticketmain_toggle");
  const containerElement = document.getElementById("ticketmain_container");



  formElement.addEventListener('submit', (event) => {
    event.preventDefault();

    const valid = inputs.every(input => {
      const inputElement = document.getElementById(input.input);
      const errorElement = document.getElementById(input.error);

      return (!validateInput(inputElement, errorElement, input.min, input.max));
    });

    alert(valid);
  })
  
  // const minElement = document.getElementById("ticketmain_min");
  // const maxElement = document.getElementById("ticketmain_max");
  // const amountElement = document.getElementById("ticketmain_amount");
  // const intervalElement = document.getElementById("ticketmain_interval");

  // chrome.storage.sync.get(
  //   ["ticketmain_min"],
  //   (result) => minElement.value = result.ticketmain_min,
  // );
  // chrome.storage.sync.get(
  //   ["ticketmain_max"],
  //   (result) => maxElement.value = result.ticketmain_max,
  // );
  // chrome.storage.sync.get(
  //   ["ticketmain_amount"],
  //   (result) => amountElement.value = result.ticketmain_amount,
  // );
  // chrome.storage.sync.get(
  //   ["ticketmain_interval"],
  //   (result) => intervalElement.value = result.ticketmain_interval / 1000,
  // );
  // chrome.storage.sync.get(["ticketmain_disabled"], (result) => {
  //   popupDisabled = result.ticketmain_disabled;

  //   if (popupDisabled) {
  //     toggleElement.checked = false;
  //     bodyElement.classList.add("disabled");
  //   } else {
  //     toggleElement.checked = true;
  //     bodyElement.classList.remove("disabled");
  //   }
  // });

  // intervalElement.addEventListener(
  //   "input",
  //   () =>
  //     chrome.storage.sync.set({
  //       ticketmain_interval: parseInt(intervalElement.value) * 1000,
  //     }),
  // );
  // amountElement.addEventListener(
  //   "input",
  //   () =>
  //     chrome.storage.sync.set({
  //       ticketmain_amount: parseInt(amountElement.value),
  //     }),
  // );
  // maxElement.addEventListener(
  //   "input",
  //   () =>
  //     chrome.storage.sync.set({ ticketmain_max: parseInt(maxElement.value) }),
  // );
  // minElement.addEventListener(
  //   "input",
  //   () =>
  //     chrome.storage.sync.set({ ticketmain_min: parseInt(minElement.value) }),
  // );

  for (let i = 0; i < legendElements.length; i++) {
    const legendElement = legendElements[i];



    legendElement.addEventListener("click", () => {
      if (popupEnabled) {
      const divElements = legendElement.parentElement.getElementsByTagName('div');
      
      legendElement.classList.toggle('ticketmain_closed')

      for (let j = 0; j < divElements.length; j ++) {
        const divElement = divElements[j];

        divElement.classList.toggle("ticketmain_hidden");
      }
    }
    });
  }

  toggleElement.addEventListener("change", () => {
    popupEnabled = toggleElement.checked;
    chrome.storage.sync.set({ ticketmain_disabled: toggleElement.checked });

    if (toggleElement.checked) {
      containerElement.classList.remove("disabled");

      for (let popupInput of popupInputs) {
        popupInput.removeAttribute("disabled");
      }
    } else {
      containerElement.classList.add("disabled");

      for (let popupInput of popupInputs) {
        popupInput.setAttribute("disabled", true);
      }
    }
  });
});
