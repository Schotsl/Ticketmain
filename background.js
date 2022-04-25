chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ ticketmain_min: 0.00 });
  chrome.storage.sync.set({ ticketmain_max: 100.00 });
  chrome.storage.sync.set({ ticketmain_amount: 1.0 });
  chrome.storage.sync.set({ ticketmain_interval: 1 });
  chrome.storage.sync.set({ ticketmain_disabled: true });
});