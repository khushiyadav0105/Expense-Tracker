const balanceValue = document.getElementById("balance-value");
const incomeValue = document.getElementById("income-value");
const expenseValue = document.getElementById("expense-value");
const historyList = document.getElementById("history-list");
const form = document.getElementById("transaction-form");
const transactionText = document.getElementById("transaction-text");
const transactionAmount = document.getElementById("transaction-amount");
const transactionDate = document.getElementById("transaction-date");
const errorMessage = document.getElementById('error-message');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, amount) => (acc += amount), 0).toFixed(2);
  const income = amounts
    .filter(amount => amount > 0)
    .reduce((acc, amount) => (acc += amount), 0)
    .toFixed(2);
  const expense = (
    amounts.filter(amount => amount < 0).reduce((acc, amount) => (acc += amount), 0) * -1
  ).toFixed(2);

  balanceValue.textContent = `$${total}`;
  incomeValue.textContent = `$${income}`;
  expenseValue.textContent = `$${expense}`;
  
  
  balanceValue.style.color = total >= 0 ? '#28a745' : '#dc3545';
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateHistory();
  updateValues();
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateHistory() {
  historyList.innerHTML = "";
  
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date)); 
  
  transactions.forEach(transaction => {
    const sign = transaction.amount > 0 ? "+" : "-";
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
      <span class="date">${transaction.date}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    listItem.classList.add(transaction.amount > 0 ? "income-item" : "expense-item");
    historyList.appendChild(listItem);
  });
}

function addTransaction(e) {
  e.preventDefault();

  const text = transactionText.value.trim();
  const amount = +transactionAmount.value.trim();
  const date = transactionDate.value.trim();

  if (!text || !amount || !date) {
    errorMessage.textContent = "Please enter valid description, amount, and date.";
    errorMessage.style.display = 'block';
    return;
  }

  errorMessage.style.display = 'none'; 

  const transaction = {
    id: Math.floor(Math.random() * 100000000),
    text,
    amount,
    date,
  };

  transactions.push(transaction);
  updateHistory();
  updateValues();
  localStorage.setItem('transactions', JSON.stringify(transactions));

  transactionText.value = "";
  transactionAmount.value = "";
  transactionDate.value = "";
}

form.addEventListener("submit", addTransaction);

// Initial load
updateHistory();
updateValues();
