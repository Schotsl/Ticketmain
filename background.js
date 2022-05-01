function setLogo(logoName = "logo") {
  chrome.action.setIcon({
    path: {
      "16": `/assets/${logoName}/icon_16.png`,
      "32": `/assets/${logoName}/icon_32.png`,
      "48": `/assets/${logoName}/icon_48.png`,
      "128": `/assets/${logoName}/icon_128.png`,
      "215": `/assets/${logoName}/icon_215.png`,
      "256": `/assets/${logoName}/icon_256.png`,
    },
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ ticketmain_min: 0.00 });
  chrome.storage.sync.set({ ticketmain_max: 100.00 });
  chrome.storage.sync.set({ ticketmain_amount: 1.0 });
  chrome.storage.sync.set({ ticketmain_interval: 5000 });
  chrome.storage.sync.set({ ticketmain_disabled: true });
});

chrome.runtime.onStartup.addListener(async () => {
  const result = await chrome.storage.sync.get(["ticketmain_disabled"]);

  if (result.ticketmain_disabled) {
    setLogo("logo_disabled");
  } else {
    setLogo();
  }
});

chrome.storage.onChanged.addListener(function (changes) {
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (key == "ticketmain_disabled") {
      if (newValue) setLogo("logo_disabled");
      else setLogo();
    }
  }
});
