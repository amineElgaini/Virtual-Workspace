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

let data = [
  {
    name: "Amine L.",
    role: "security",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    email: "amine.security@example.com",
    phone: "0612345678",
    workExperience: "2 years",
    room: null,
  },
  {
    name: "Sara B.",
    role: "receptionist",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    email: "sara.reception@example.com",
    phone: "0623456789",
    workExperience: "1 year",
    room: "reception",
  },
  {
    name: "Youssef K.",
    role: "ittechnician",
    photo: "https://randomuser.me/api/portraits/men/55.jpg",
    email: "youssef.it@example.com",
    phone: "0634567890",
    workExperience: "3 years",
    room: "server",
  },
];
let selectedRoom = null;

const createEmployeeButton = document.getElementById("createEmployeeButton");
const unsignedEmployees = document.getElementById("unsignedEmployees");
const closeBtn = document.getElementById("closeModal");
const overlay = document.getElementById("modalOverlay");
const form = document.getElementById("employeeForm");
const toastContainer = document.getElementById("toastContainer");

const addToRoomsButtons = document.querySelectorAll(".addToRoom");
const choosePopup = document.getElementById("chooseEmployeePopup");
const chooseList = document.getElementById("chooseEmployeeList");
const closeChoosePopup = document.getElementById("closeChoosePopup");
firstPrint();

function firstPrint() {
  data.forEach((emp, index) => {
    if (emp.room === null) {
      addUnsignedEmployee(emp, index);
    } else {
      assignEmployeeToRoom(emp, index, emp.room);
    }
  });
}

function addUnsignedEmployee(employee, index) {
    
  const card = document.createElement("div");
  card.dataset.index = index;
  card.className =
    "unsignedEmployee flex w-fit cursor-pointer items-center p-2 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300 gap-2";

  card.innerHTML = `
    <img
      class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
      src="${employee.photo}"
      alt="Employee Photo"
    />
    <div class="flex flex-col">
      <h2 class="text-xs font-semibold text-gray-800">${employee.name}</h2>
      <p class="text-xs text-gray-500">${employee.role}</p>
    </div>
  `;

  unsignedEmployees.appendChild(card);
}

function openChoosePopup(room) {
  chooseList.innerHTML = "";

  const eligible = data.filter((emp) => canEnterRoom(emp.role, room));

  if (eligible.length === 0) {
    chooseList.innerHTML = `<p class="text-gray-500 text-sm">No eligible employees.</p>`;
  } else {
    eligible.forEach((emp, index) => {
      if (emp.room === null) {
        const card = document.createElement("div");

        card.className =
          "flex cursor-pointer items-center p-2 bg-white rounded-xl border shadow hover:shadow-lg transition-shadow duration-300 gap-2";

        card.innerHTML = `
        <img
          class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          src="${emp.photo}"
        />
        <div>
          <h2 class="text-xs font-semibold text-gray-800">${emp.name}</h2>
          <p class="text-xs text-gray-500">${emp.role}</p>
        </div>
      `;

        card.addEventListener("click", () => {
          assignEmployeeToRoom(emp, index, room);
          choosePopup.classList.add("hidden");
        });

        chooseList.appendChild(card);
      }
    });
  }

  choosePopup.classList.remove("hidden");
}

function canEnterRoom(role, room) {
  return roomWithEachEmployees[role]?.includes(room);
}

function assignEmployeeToRoom(employee, employeeIndex, room) {
    
    const roomDiv = document.querySelector(`[data-room="${room}"]`);
    const div = document.createElement("div");
    div.dataset.index = employeeIndex;

  div.className =
    "employee p-1 flex items-center bg-white rounded-lg shadow gap-1";

        data = data.map((emp, index) => {
          if (index === employeeIndex) {
            emp.room = room;
          }
          return emp;
        });


  div.innerHTML = `
      <img class="w-8 h-8 rounded-full" src="${employee.photo}" />
      <div>
        <h2 class="text-xs font-semibold">${employee.name}</h2>
        <p class="text-xs text-gray-500">${employee.role}</p>
      </div>
      <button data-index="${employeeIndex}"
        class="removeEmployee px-1 py-1 bg-red-500 text-white rounded text-xs ml-auto"
      >
        X
      </button>
  `;
    console.log(roomDiv, div);
  roomDiv.append(div);

  document
    .querySelector(`.removeEmployee[data-index="${employeeIndex}"]`)
    .addEventListener("click", () => {
      data = data.map((emp, index) => {
        if (index === employeeIndex) {
          emp.room = null;
        }
        return emp;
      });
      document
        .querySelector(`.employee[data-index="${employeeIndex}"]`)
        ?.remove();
      addUnsignedEmployee(employee, employeeIndex);
    });

  // remove employee from unsigned list if it exists
  document.querySelector(`.unsignedEmployee[data-index="${employeeIndex}"]`)?.remove();
}

function canEnterRoom(role, room) {
  const restricted = {
    receptionist: ["reception"],
    ittechnician: ["server"],
    security: ["security"],
    manager: [
      "conference",
      "reception",
      "server",
      "security",
      "staff",
      "archives",
    ],
    nettoyage: ["conference", "reception", "server", "security", "staff"],
    other: ["conference", "reception", "staff"],
  };

  return restricted[role]?.includes(room);
}

addToRoomsButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedRoom = btn.parentElement.dataset.room;
    openChoosePopup(selectedRoom);
  });
});

createEmployeeButton.addEventListener("click", () => {
  overlay.classList.remove("hidden");
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
    room: null,
  };

  if (employee.name.length < 3) {
    showToast("Name must be at least 3 characters long!", "error");
    return;
  }

  if (!employees.includes(employee.role)) {
    showToast("Please select a valid role!", "error");
    return;
  }

  data.push(employee);
  addUnsignedEmployee(employee, data.length);

  overlay.classList.add("hidden");
  form.reset();
  showToast("Employee added successfully!", "success");
});

closeBtn.addEventListener("click", () => {
  overlay.classList.add("hidden");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.classList.add("hidden");
});

closeChoosePopup.addEventListener("click", () => {
  choosePopup.classList.add("hidden");
});

// Toast
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `
    px-4 py-2 rounded shadow-lg text-white
    ${type === "success" ? "bg-green-500" : "bg-red-500"}
    animate-slide-in
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
