document.addEventListener('DOMContentLoaded', function () {
  const img = document.getElementById("ticketmain_img");
  const body = document.getElementById("ticketmain_body");

  img.addEventListener("click", () => {
    img.classList.toggle('disabled');
    body.classList.toggle('disabled');
  });

  const minElement = document.getElementById("ticketmain_min");
  const maxElement = document.getElementById("ticketmain_max");
  const amountElement = document.getElementById("ticketmain_amount");
  const intervalElement = document.getElementById("ticketmain_interval");

  minElement.addEventListener('input', () => chrome.storage.sync.set({ ticketmain_min: minElement.value }));
  maxElement.addEventListener('input', () => chrome.storage.sync.set({ ticketmain_max: minElement.value }));
  amountElement.addEventListener('input', () => chrome.storage.sync.set({ ticketmain_amount: minElement.value }));
  intervalElement.addEventListener('input', () => chrome.storage.sync.set({ ticketmain_interval: minElement.value }));
});

// const url = chrome.runtime.getURL("assets/audio/notification.mp3");
// const audio = new Audio(url);

// audio.play();
