let currentLanguage = 'en';
let selectedCategory = '';
const USERS = [{ username: "agscoop", password: "ags2025" }];

const translations = {
  en: {
    loginTitle: "Login",
    username: "Username",
    password: "Password",
    loginButton: "Login",
    loginError: "Invalid login",
    languageLabel: "Language",
    logout: "Logout",
    headerTitle: "Inventory System",
    addTitle: "Add / Edit Material",
    saveBtn: "Save Material",
    inventoryTitle: "Inventory",
    name: "Name",
    type: "Type",
    category: "Category",
    quantity: "Quantity",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    placeholderName: "Material Name",
    placeholderType: "Material Type",
    placeholderCategory: "Category",
    placeholderQty: "Quantity",
    categoryHeader: "Select Category"
  },
  it: {
    loginTitle: "Accesso",
    username: "Nome utente",
    password: "Password",
    loginButton: "Accedi",
    loginError: "Accesso non valido",
    languageLabel: "Lingua",
    logout: "Esci",
    headerTitle: "Sistema di Inventario",
    addTitle: "Aggiungi / Modifica Materiale",
    saveBtn: "Salva Materiale",
    inventoryTitle: "Inventario",
    name: "Nome",
    type: "Tipo",
    category: "Categoria",
    quantity: "Quantità",
    actions: "Azioni",
    edit: "Modifica",
    delete: "Elimina",
    placeholderName: "Nome del Materiale",
    placeholderType: "Tipo di Materiale",
    placeholderCategory: "Categoria",
    placeholderQty: "Quantità",
    categoryHeader: "Seleziona Categoria"
  }
};

function changeLanguage(lang) {
  currentLanguage = lang;
  const t = translations[lang];
  document.getElementById("login-title").innerText = t.loginTitle;
  document.getElementById("username").placeholder = t.username;
  document.getElementById("password").placeholder = t.password;
  document.getElementById("login-btn").innerText = t.loginButton;
  document.getElementById("lang-label").innerText = `${t.languageLabel} / Lingua:`;

  document.getElementById("logout-btn").innerText = t.logout;
  document.getElementById("header-title").innerText = t.headerTitle;
  document.getElementById("add-title").innerText = t.addTitle;
  document.getElementById("save-btn").innerText = t.saveBtn;
  document.getElementById("inventory-title").innerText = t.inventoryTitle;
  document.getElementById("th-name").innerText = t.name;
  document.getElementById("th-type").innerText = t.type;
  document.getElementById("th-category").innerText = t.category;
  document.getElementById("th-quantity").innerText = t.quantity;
  document.getElementById("th-actions").innerText = t.actions;
  document.getElementById("material-name").placeholder = t.placeholderName;
  document.getElementById("material-type").placeholder = t.placeholderType;
  document.getElementById("material-category").placeholder = t.placeholderCategory;
  document.getElementById("material-qty").placeholder = t.placeholderQty;
  document.getElementById("category-header").innerText = t.categoryHeader;

  loadCategories();
  loadMaterials();
}

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  const valid = USERS.some(user => user.username === u && user.password === p);
  if (valid) {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("category-screen").style.display = "block";
    loadCategories();
  } else {
    alert(translations[currentLanguage].loginError);
  }
}

function logout() {
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("category-screen").style.display = "none";
  document.getElementById("app").style.display = "none";
}

function goToCategories() {
  document.getElementById("app").style.display = "none";
  document.getElementById("category-screen").style.display = "block";
  loadCategories();
}

function loadCategories() {
  const materials = JSON.parse(localStorage.getItem("materials") || "[]");
  const uniqueCategories = [...new Set(materials.map(m => m.category))];
  const list = document.getElementById("category-list");
  list.innerHTML = "";

  uniqueCategories.forEach(cat => {
    const div = document.createElement("div");
    div.className = "category-block";
    div.innerText = cat;
    div.onclick = () => openCategory(cat);

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.innerText = "✕";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteCategory(cat);
    };
    div.appendChild(delBtn);
    list.appendChild(div);
  });

  const addBlock = document.createElement("div");
  addBlock.className = "category-block add-category";
  addBlock.innerText = "+";
  addBlock.onclick = () => {
    const newCat = prompt("Enter new category name:");
    if (newCat) {
      const materials = JSON.parse(localStorage.getItem("materials") || "[]");
      if (!materials.some(m => m.category === newCat)) {
        materials.push({ name: "__placeholder__", type: "", category: newCat, quantity: 0 });
        localStorage.setItem("materials", JSON.stringify(materials));
        loadCategories();
      }
    }
  };
  list.appendChild(addBlock);
}

function deleteCategory(cat) {
  const confirmed = confirm(`Are you sure you want to delete the category "${cat}"?`);
  if (!confirmed) return;

  let materials = JSON.parse(localStorage.getItem("materials") || "[]");
  materials = materials.filter(m => m.category !== cat);
  localStorage.setItem("materials", JSON.stringify(materials));
  loadCategories();
}

function openCategory(category) {
  selectedCategory = category;
  document.getElementById("material-category").value = category;
  document.getElementById("category-screen").style.display = "none";
  document.getElementById("app").style.display = "block";
  loadMaterials();
}

function loadMaterials() {
  const materials = JSON.parse(localStorage.getItem("materials") || "[]");
  const tbody = document.getElementById("material-table-body");
  tbody.innerHTML = "";

  const filtered = materials.filter(mat =>
    mat.category === selectedCategory &&
    mat.name !== "__placeholder__"
  );

  filtered.forEach((mat, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Name">${mat.name}</td>
      <td data-label="Type">${mat.type || "-"}</td>
      <td data-label="Category">${mat.category}</td>
      <td data-label="Quantity">${mat.quantity}</td>
      <td data-label="Actions">
        <button onclick="editMaterial(${index})">${translations[currentLanguage].edit}</button>
        <button onclick="deleteMaterial(${index})">${translations[currentLanguage].delete}</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function filterCategories() {
  const search = document.getElementById("category-search").value.toLowerCase();
  const blocks = document.querySelectorAll(".category-block:not(.add-category)");
  blocks.forEach(block => {
    block.style.display = block.innerText.toLowerCase().includes(search) ? "block" : "none";
  });
}

function filterMaterials() {
  const value = document.getElementById("material-search").value.toLowerCase();
  const rows = document.querySelectorAll("#material-table-body tr");

  rows.forEach(row => {
    const name = row.children[0].innerText.toLowerCase();
    const type = row.children[1].innerText.toLowerCase();
    const quantity = row.children[3].innerText.toLowerCase();

    const match = name.includes(value) || type.includes(value) || quantity.includes(value);
    row.style.display = match ? "table-row" : "none";
  });
}


function saveMaterial() {
  const name = document.getElementById("material-name").value.trim();
  const type = document.getElementById("material-type").value.trim();
  const category = selectedCategory;
  const qty = parseInt(document.getElementById("material-qty").value);
  const index = document.getElementById("edit-index").value;

  if (!name || isNaN(qty)) {
    alert("Fill all fields correctly.");
    return;
  }

  let materials = JSON.parse(localStorage.getItem("materials") || "[]");

  if (index === "") {
    materials.push({ name, type, category, quantity: qty });
  } else {
    const filtered = materials.filter(m => m.category === selectedCategory && m.name !== "__placeholder__");
    const realIndex = materials.findIndex(m =>
      m.name === filtered[index].name &&
      m.category === filtered[index].category
    );
    materials[realIndex] = { name, type, category, quantity: qty };
    document.getElementById("edit-index").value = "";
  }

  localStorage.setItem("materials", JSON.stringify(materials));
  clearForm();
  loadMaterials();
}

function editMaterial(index) {
  const materials = JSON.parse(localStorage.getItem("materials") || "[]");
  const filtered = materials.filter(m => m.category === selectedCategory && m.name !== "__placeholder__");
  const mat = filtered[index];
  document.getElementById("material-name").value = mat.name;
  document.getElementById("material-type").value = mat.type || "";
  document.getElementById("material-qty").value = mat.quantity;
  document.getElementById("edit-index").value = index;
}

function deleteMaterial(index) {
  let materials = JSON.parse(localStorage.getItem("materials") || "[]");
  const filtered = materials.filter(m => m.category === selectedCategory && m.name !== "__placeholder__");
  const mat = filtered[index];
  const realIndex = materials.findIndex(m => m.name === mat.name && m.category === mat.category);
  materials.splice(realIndex, 1);
  localStorage.setItem("materials", JSON.stringify(materials));
  loadMaterials();
}

function clearForm() {
  document.getElementById("material-name").value = "";
  document.getElementById("material-type").value = "";
  document.getElementById("material-qty").value = "";
  document.getElementById("edit-index").value = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const loginVisible = document.getElementById("login-screen").style.display !== "none";
    const appVisible = document.getElementById("app").style.display !== "none";
    if (loginVisible) login();
    else if (appVisible) saveMaterial();
  }
});