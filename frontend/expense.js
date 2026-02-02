const API = "https://expense-backend.onrender.com";


const titleEl = document.getElementById("title");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");
const dateEl = document.getElementById("date");
const listEl = document.getElementById("list");
const totalEl = document.getElementById("total");

async function addExpense() {
  if (!titleEl.value || !amountEl.value || !dateEl.value) {
    alert("Fill all fields 🧾");
    return;
  }

  const res = await fetch(`${API}/api/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: titleEl.value,
      amount: Number(amountEl.value),
      category: categoryEl.value,
      date: dateEl.value
    })
  });

  if (!res.ok) {
    const err = await res.json();
    alert(err.error);
    return;
  }

  titleEl.value = "";
  amountEl.value = "";
  dateEl.value = "";

  loadExpenses();
  loadTotal();
}


async function loadExpenses() {
  const res = await fetch(`${API}/api/expenses`);
  const data = await res.json();

  listEl.innerHTML = "";

  data.forEach(e => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${e.title}</td>
      <td>₹${e.amount}</td>
      <td>${e.category}</td>
      <td>${new Date(e.date).toLocaleDateString()}</td>
      <td><button class="delete">✖</button></td>
    `;

    row.querySelector(".delete").onclick = async () => {
      await fetch(`${API}/api/expenses/${e._id}`, { method: "DELETE" });
      loadExpenses();
      loadTotal(); // 🔥 IMPORTANT
    };

    listEl.appendChild(row);
  });
}
async function loadTotal() {
  const res = await fetch(`${API}/api/analytics/total`);
  const data = await res.json();
 totalEl.textContent = data.total;

}

loadExpenses();
loadTotal();