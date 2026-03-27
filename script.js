
let groups = [];
let currentGroupIndex = null;

let members = [];
let expenses = [];


// CREATEING GROUP
function createGroup() {
  const name = document.getElementById("groupName").value;

  if (name === "") return;

  const group = {
    name: name,
    members: [],
    expenses: []
  };

  groups.push(group);
  currentGroupIndex = groups.length - 1;

  document.getElementById("groupName").value = "";

  updateGroupDropdown();
  loadCurrentGroup();
}


//  UPDATE GROUP DROPDOWN
function updateGroupDropdown() {
  const select = document.getElementById("groupSelect");
  select.innerHTML = "";

  groups.forEach((g, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = g.name;
    select.appendChild(option);
  });

  select.value = currentGroupIndex;
}


// SWITCH GROUP
function switchGroup() {
  currentGroupIndex = parseInt(document.getElementById("groupSelect").value);
  loadCurrentGroup();
}


// LOAD CURRENT GROUP
function loadCurrentGroup() {
  if (currentGroupIndex === null) return;

  const group = groups[currentGroupIndex];

  members = group.members;
  expenses = group.expenses;

  renderMembers();
  updatePaidByDropdown();
  renderExpenses();
  calculateBalances();
}


// ADD MEMBER
function addMember() {
  if (currentGroupIndex === null) return;

  const name = document.getElementById("name").value;
  if (name === "") return;

  members.push(name);

  document.getElementById("name").value = "";

  renderMembers();
  updatePaidByDropdown();
}


// RENDER MEMBERS
function renderMembers() {
  const list = document.getElementById("members");
  list.innerHTML = "";

  members.forEach(m => {
    const li = document.createElement("li");
    li.innerText = m;
    list.appendChild(li);
  });
}


// UPDATE PAID BY DROPDOWN
function updatePaidByDropdown() {
  const select = document.getElementById("paidBy");
  select.innerHTML = "";

  members.forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    option.text = m;
    select.appendChild(option);
  });
}


// ADD EXPENSE
function addExpense() {
  if (currentGroupIndex === null) return;

  const amount = parseFloat(document.getElementById("amount").value);
  const desc = document.getElementById("desc").value;
  const paidBy = document.getElementById("paidBy").value;

  if (!amount || members.length === 0 || !paidBy) return;

  const splitAmount = amount / members.length;

  expenses.push({
    desc,
    amount,
    paidBy,
    splitAmount
  });

  renderExpenses();
  calculateBalances();

  document.getElementById("amount").value = "";
  document.getElementById("desc").value = "";
}


// RENDER EXPENSES
function renderExpenses() {
  const list = document.getElementById("expenseList");
  list.innerHTML = "";

  expenses.forEach(exp => {
    const li = document.createElement("li");
    li.innerText = `${exp.desc} - ₹${exp.amount} (Paid by ${exp.paidBy})`;
    list.appendChild(li);
  });
}


// CALCULATE BALANCES
function calculateBalances() {
  let balances = {};

  members.forEach(m => balances[m] = 0);

  expenses.forEach(exp => {

    // sabka share minus
    members.forEach(m => {
      balances[m] -= exp.splitAmount;
    });

    // jisne pay kiya usko add
    balances[exp.paidBy] += exp.amount;
  });

  renderBalances(balances);
  calculateSettlements(balances);
}


// RENDER BALANCES
function renderBalances(balances) {
  const div = document.getElementById("balances");
  div.innerHTML = "";

  for (let person in balances) {
    const p = document.createElement("p");

    if (balances[person] > 0) {
      p.innerText = `${person} gets ₹${balances[person].toFixed(2)}`;
    } else {
      p.innerText = `${person} owes ₹${Math.abs(balances[person]).toFixed(2)}`;
    }

    div.appendChild(p);
  }
}


// SETTLEMENT LOGIC
function calculateSettlements(balances) {
  let creditors = [];
  let debtors = [];

  for (let person in balances) {
    if (balances[person] > 0) {
      creditors.push({ name: person, amount: balances[person] });
    } else if (balances[person] < 0) {
      debtors.push({ name: person, amount: -balances[person] });
    }
  }

  let result = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    let debit = debtors[i];
    let credit = creditors[j];

    let settleAmount = Math.min(debit.amount, credit.amount);

    result.push(`${debit.name} pays ₹${settleAmount.toFixed(2)} to ${credit.name}`);

    debit.amount -= settleAmount;
    credit.amount -= settleAmount;

    if (debit.amount === 0) i++;
    if (credit.amount === 0) j++;
  }

  renderSettlements(result);
}


// RENDER SETTLEMENTS
function renderSettlements(list) {
  const div = document.getElementById("settlements");
  div.innerHTML = "";

  list.forEach(item => {
    const p = document.createElement("p");
    p.innerText = item;
    div.appendChild(p);
  });
}