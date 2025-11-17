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
  "manager",
  "security",
  "nettoyage",
  "other",
];

const roomWithEachEmployees = {
  conference: ["nettoyage", "other", "manager"],
  reception: ["receptionist", "nettoyage", "manager"], //
  server: ["ittechnician", "nettoyage", "manager"], //
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

const addToRoomsButtons = document.querySelectorAll(".addToRoom")
const choosePopup = document.getElementById("chooseEmployeePopup");
const chooseList = document.getElementById("chooseEmployeeList");
const closeChoosePopup = document.getElementById("closeChoosePopup");


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





let selectedRoom = null;

// open popup when clicking "+ room"
addToRoomsButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedRoom = btn.parentElement.dataset.room;
    openChoosePopup(selectedRoom);
  });
});

function openChoosePopup(room) {
  chooseList.innerHTML = "";

  const eligible = data.filter(emp => canEnterRoom(emp.role, room));

  if (eligible.length === 0) {
    chooseList.innerHTML = `<p class="text-gray-500 text-sm">No eligible employees.</p>`;
  } else {
    eligible.forEach(emp => {
      const card = document.createElement("div");

      card.className =
        "flex cursor-pointer items-center p-2 bg-white rounded-xl border shadow hover:shadow-lg transition-shadow duration-300 gap-2";

      card.innerHTML = `
        <img
          class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          src="${emp.photo}"
        />
        <div>
          <h2 class="text-sm font-semibold text-gray-800">${emp.name}</h2>
          <p class="text-xs text-gray-500">${emp.role}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        assignEmployeeToRoom(emp, room);
        choosePopup.classList.add("hidden");
      });

      chooseList.appendChild(card);
    });
  }

  choosePopup.classList.remove("hidden");
}

function canEnterRoom(role, room) {
  return roomWithEachEmployees[role]?.includes(room);
}


function assignEmployeeToRoom(employee, room) {
  const roomDiv = document.querySelector(`[data-room="${room}"]`);

  roomDiv.innerHTML = `
    <div class="p-2 flex items-center bg-white rounded-lg shadow gap-2">
      <img class="w-10 h-10 rounded-full" src="${employee.photo}" />
      <div>
        <h2 class="text-sm font-semibold">${employee.name}</h2>
        <p class="text-xs text-gray-500">${employee.role}</p>
      </div>
      <button
        class="removeEmployee px-2 py-1 bg-red-500 text-white rounded text-xs ml-auto"
      >
        X
      </button>
    </div>
  `;

  // remove employee from unsigned list
//   const index = data.indexOf(employee);
//   if (index !== -1) data.splice(index, 1);
}

function canEnterRoom(role, room) {
  const restricted = {
    receptionist: ["reception"],
    ittechnician: ["server"],
    security: ["security"],
    manager: ["conference", "reception", "server", "security", "staff", "archives"],
    nettoyage: ["conference", "reception", "server", "security", "staff"],
    other: ["conference", "reception", "staff"]
  };

  return restricted[role]?.includes(room);
}



closeChoosePopup.addEventListener("click", () => {
  choosePopup.classList.add("hidden");
});

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
