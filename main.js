const rooms = [
  "conference",
  "reception",
  "server",

  "security",
  "staff",
  "archives",
];

const employees = [
  "receptionist",
  "ittechnician",
  "security",
  "nettoyage",
  "other",
];

const roomWithEachEmployees = {
  conference: ["nettoyage", "other", "manager"],
  reception: ["receptionists", "nettoyage", "manager"], //
  server: ["ittechnicians", "nettoyage", "manager"], //
  security: ["security", "nettoyage"], //
  staff: ["staff", "nettoyage", "other", "manager"],
  archives: ["other", "manager"],
};

const data = [];

const createEmployeeButton = document.getElementById("createEmployeeButton");
const unsignedEmployees = document.getElementById("unsignedEmployees");
const closeBtn = document.getElementById("closeModal");
const overlay = document.getElementById("modalOverlay");
const form = document.getElementById("employeeForm");
const toastContainer = document.getElementById("toastContainer");

createEmployeeButton.addEventListener("click", () => {
  overlay.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.classList.add("hidden");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const employee = {
    name: form.name.value,
    role: form.role.value,
    photo: form.photo.value,
    email: form.email.value,
    phone: form.phone.value,
    workExperience: form.workExperience.value,
  };

  console.log(form.role.value)

  if (employee.name.length < 3) {
    showToast("Name must be at least 3 characters long!", "error");
    return;
  }

  if (!employees.includes(employee.role)) {
    showToast("Please select a valid role!", "error");
    return;
  }

  addUnsignedEmployee(employee);

  overlay.classList.add("hidden");
  form.reset();
  showToast("Employee added successfully!", "success");
});

function addUnsignedEmployee(employee) {
  data.push(employee);

  const card = document.createElement("div");
  card.className =
    "flex w-fit cursor-pointer items-center p-2 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 gap-2";

  card.innerHTML = `
    <img
      class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
      src="${employee.photo}"
      alt="Employee Photo"
    />
    <div class="flex flex-col">
      <h2 class="text-sm font-semibold text-gray-800">${employee.name}</h2>
      <p class="text-xs text-gray-500">${employee.role}</p>
    </div>
  `;

  unsignedEmployees.appendChild(card);
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Displays a toast message with a given message and type.
 * @param {string} message The message to be displayed.
 * @param {string} [type="success"] The type of the toast. Can be "success" or "error".
 */
/*******  d2f9769b-d971-485c-8f62-9e729b9c7e96  *******/
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `
    px-4 py-2 rounded shadow-lg text-white
    ${type === "success" ? "bg-green-500" : "bg-red-500"}
    animate-slide-in
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
