document.addEventListener("DOMContentLoaded", () => {
  // Load saved selectors when popup opens
  chrome.storage.sync.get(["emailID", "passwordID", "connectID"], (data) => {
    if (data.emailID)
      document.getElementById("emailInput").value = data.emailID;
    if (data.passwordID)
      document.getElementById("passwordInput").value = data.passwordID;
    if (data.connectID)
      document.getElementById("connectInput").value = data.connectID;
  });
});

document.getElementById("saveButton").addEventListener("click", () => {
  let emailID = document.getElementById("emailInput").value.trim();
  let passwordID = document.getElementById("passwordInput").value.trim();
  let connectID = document.getElementById("connectInput").value.trim();

  if (!emailID || !passwordID || !connectID) {
    alert("Please fill in all fields!");
    return;
  }

  // Save input field selectors in Chrome Storage
  chrome.storage.sync.set({ emailID, passwordID, connectID }, () => {
    alert("Selectors saved successfully!");
  });
});

document.getElementById("startCheck").addEventListener("click", () => {
  let accounts = document.getElementById("accountList").value;
  chrome.storage.sync.get(["emailID", "passwordID", "connectID"], (data) => {
    if (!data.emailID || !data.passwordID || !data.connectID) {
      alert("Please save input IDs first!");
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "startCheck",
        accounts,
        selectors: data,
      });
    });
  });
});
