const API = "http://localhost:5000";

const titleEl = document.getElementById("title");
const amountEl = document.getElementById("amount");
const dateEl = document.getElementById("date");
const categoryEl = document.getElementById("category");
const listEl = document.getElementById("list");
const totalEl = document.getElementById("total");
const balanceInput = document.getElementById("balanceInput");
const remainingEl = document.getElementById("remaining");

const savedBalance = localStorage.getItem("balance");
if (savedBalance) {
  balanceInput.value = savedBalance;
}
document.getElementById("saveBalance").onclick = () => {
  localStorage.setItem("balance", Number(balanceInput.value));
  calculateRemaining();
};
function calculateRemaining() {
  const balance = Number(localStorage.getItem("balance")) || 0;
  const totalExpenses = Number(totalEl.textContent) || 0;
  const remaining = balance - totalExpenses;
  remainingEl.textContent = remaining;
}

document.getElementById("addBtn").onclick = addExpense;

async function addExpense() {
  await fetch(`${API}/api/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: titleEl.value,
      amount: Number(amountEl.value),
      date: dateEl.value,
      category: categoryEl.value
    })
  });

  loadExpenses();
  loadTotal();
}

async function loadExpenses() {
  const res = await fetch(`${API}/api/expenses`);
  const data = await res.json();

  listEl.innerHTML = "";

  data.forEach(exp => {
    const tr = document.createElement("tr");

   tr.innerHTML = `
  <td>${exp.title}</td>
  <td>${exp.amount}</td>
  <td>${exp.category}</td>
  <td>${exp.date ? exp.date.slice(0, 10) : ""}</td>
  <td>
    <button class="delete-btn" data-id="${exp._id}">❌</button>
  </td>
`;


    tr.querySelector("button").onclick = async () => {
      await fetch(`${API}/api/expenses/${exp._id}`, {
        method: "DELETE"
      });
      loadExpenses();
      loadTotal();
    };

    listEl.appendChild(tr);
  });
}

async function loadTotal() {
  const res = await fetch(`${API}/api/analytics/total`);
  const data = await res.json();
  totalEl.textContent = data.total;
  calculateRemaining();
}



loadExpenses();
loadTotal();
