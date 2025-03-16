document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("startCheck").addEventListener("click", function () {
    let accounts = document.getElementById("accountList").value.trim();

    if (accounts.length > 0) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "startCheck",
          accounts: accounts,
        });
      });
    } else {
      alert("Please enter at least one account.");
    }
  });
});
