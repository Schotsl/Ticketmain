document.addEventListener("DOMContentLoaded", function () {
  letclar
   popupInputs = document.getElementsByTagName("input");
  let popupDisabled = false;

  const imgElement = document.getElementById("ticketmain_img");
  const minElement = document.getElementById("ticketmain_min");
  const maxElement = document.getElementById("ticketmain_max");
  const bodyElement = document.getElementById("ticketmain_body");
  const amountElement = document.getElementById("ticketmain_amount");
  const intervalElement = document.getElementById("ticketmain_interval");

  chrome.storage.sync.get(
    ["ticketmain_min"],
    (result) => minElement.value = result.ticketmain_min,
  );
  chrome.storage.sync.get(
    ["ticketmain_max"],
    (result) => maxElement.value = result.ticketmain_max,
  );
  chrome.storage.sync.get(
    ["ticketmain_amount"],
    (result) => amountElement.value = result.ticketmain_amount,
  );
  chrome.storage.sync.get(
    ["ticketmain_interval"],
    (result) => intervalElement.value = result.ticketmain_interval / 1000,
  );
  chrome.storage.sync.get(["ticketmain_disabled"], (result) => {
    popupDisabled = result.ticketmain_disabled;

    if (popupDisabled) {
      imgElement.classList.add("disabled");
      bodyElement.classList.add("disabled");
    } else {
      imgElement.classList.remove("disabled");
      bodyElement.classList.remove("disabled");
    }
  });

  intervalElement.addEventListener(
    "input",
    () =>
      chrome.storage.sync.set({
        ticketmain_interval: parseInt(intervalElement.value) * 1000,
      }),
  );
  amountElement.addEventListener(
    "input",
    () =>
      chrome.storage.sync.set({
        ticketmain_amount: parseInt(amountElement.value),
      }),
  );
  maxElement.addEventListener(
    "input",
    () =>
      chrome.storage.sync.set({ ticketmain_max: parseInt(maxElement.value) }),
  );
  minElement.addEventListener(
    "input",
    () =>
      chrome.storage.sync.set({ ticketmain_min: parseInt(minElement.value) }),
  );
  imgElement.addEventListener("click", () => {
    popupDisabled = !popupDisabled;
    chrome.storage.sync.set({ ticketmain_disabled: popupDisabled });

    if (popupDisabled) {
      imgElement.classList.add("disabled");
      bodyElement.classList.add("disabled");

      for (let popupInput of popupInputs) {
        popupInput.setAttribute("disabled", true);
      }
    } else {
      imgElement.classList.remove("disabled");
      bodyElement.classList.remove("disabled");

      for (let popupInput of popupInputs) {
        popupInput.removeAttribute("disabled");
      }
    }
  });
});
