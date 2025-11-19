let rooms = [];
let employees = [];
let roomWithEachEmployees = {};
let data = [];
let selectedRoom = null;

fetch("data.json")
  .then((res) => res.json())
  .then((fetchedData) => {
    rooms = fetchedData.rooms;
    employees = fetchedData.employees;
    roomWithEachEmployees = fetchedData.roomWithEachEmployees;
    data = fetchedData.data;
    firstPrint();
  })
  .catch((err) => console.error(err));

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

const closeDetailsPopup = document.getElementById("closeDetailsPopup");
const detailsPopup = document.getElementById("detailsPopup");
const experiences = document.getElementById("experiences");
const addEperienceButton = document.getElementById("addEperienceButton");

// Add experiences in pop up
addEperienceButton.addEventListener("click", () => {
  const div = document.createElement("div");
  div.className =
    "experience-item p-4 border rounded-lg mb-3 shadow-sm bg-white relative";
  div.innerHTML = `
              <div class="flex  gap-1">

              <label class="block mb-2">
                <span class="text-gray-700 font-medium">Job Title</span>
                <input
                  type="text"
                  name="jobTitle"
                  value="IT Technician"
                  class="w-full mt-1 border p-1 rounded"
                />
              </label>

              <label class="block mb-2">
                <span class="text-gray-700 font-medium">Company</span>
                <input
                  type="text"
                  name="company"
                  value="Company A"
                  class="w-full mt-1 border p-1 rounded"
                />
              </label>

              </div>

              <div class="flex  gap-1">
                <label class="block flex-1">
                  <span class="text-gray-700 font-medium">Date Start</span>
                  <input
                    type="date"
                    name="dateStart"
                    value="2022-01-01"
                    class="w-full mt-1 border p-1 rounded"
                  />
                </label>

                <label class="block flex-1">
                  <span class="text-gray-700 font-medium">Date End</span>
                  <input
                    type="date"
                    name="dateEnd"
                    value="2022-12-31"
                    class="w-full mt-1 border p-1 rounded"
                  />
                </label>
            </div>
            <button
    class="removeExperience absolute top-2 right-2 text-red-500 hover:text-red-700"
  >
    ✕
  </button>
  `;
  experiences.append(div);
  div.querySelector(".removeExperience").addEventListener("click", (e) => {
    e.target.parentElement.remove();
  });
});

closeDetailsPopup.addEventListener("click", () => {
  detailsPopup.classList.add("hidden");
});

function firstPrint() {
  const role = document.querySelector("#role");
  const option = document.createElement("option");

  option.value = "";
  option.disabled = true;
  option.selected = true;
  option.textContent = "Select role";
  role.append(option);

  employees.forEach((e) => {
    const option = document.createElement("option");
    option.value = e;
    option.textContent = e;
    role.append(option);
  });

  data.forEach((emp, index) => {
    if (emp.room === null) {
      addUnsignedEmployee(emp, index);
    } else {
      assignEmployeeToRoom(emp, index, emp.room);
    }
  });
}

function addUnsignedEmployee(employee, index) {
  employee.room = null;
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

  document
    .querySelector(`.unsignedEmployee[data-index="${index}"]`)
    .addEventListener("click", () => {
      showDetails(index);
    });
}

function openChoosePopup(room) {
  chooseList.innerHTML = "";

  const eligible = data.filter((emp) => {
    if (emp.room === null) {
      return canEnterRoom(emp.role, room);
    }
    return false;
  });

  if (eligible.length === 0) {
    chooseList.innerHTML = `<p class="text-gray-500 text-sm">No eligible employees.</p>`;
  } else {

    data.forEach((emp, index) => {
      if (canEnterRoom(emp.role, room) && emp.room === null) {
        const card = document.createElement("div");
        card.dataset.index = index;

        card.className =
          "cardChoose flex cursor-pointer items-center p-2 bg-white rounded-xl border shadow hover:shadow-lg transition-shadow duration-300 gap-2";

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

        chooseList.appendChild(card);

        console.log(index)
        document
          .querySelector(`.cardChoose[data-index="${index}"]`)
          .addEventListener("click", () => {
            // console.log(emp, index, room);
            assignEmployeeToRoom(emp, index, room);
            choosePopup.classList.add("hidden");
          });
      }
    });
  }

  choosePopup.classList.remove("hidden");
}

function canEnterRoom(role, room) {
  return roomWithEachEmployees[room]?.includes(role);
}

function assignEmployeeToRoom(employee, employeeIndex, room) {
  const roomDiv = document.querySelector(`[data-room="${room}"]`);
  const div = document.createElement("div");
  div.dataset.index = employeeIndex;

  div.className =
    "employee p-1 flex items-center bg-white rounded-lg shadow gap-1";
  div.dataset.id = employeeIndex;

  employee.room = room;

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
  roomDiv.append(div);

  document
    .querySelector(`.removeEmployee[data-index="${employeeIndex}"]`)
    .addEventListener("click", (e) => {
      e.stopPropagation();

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
  console.log(employeeIndex);
  document
    .querySelector(`.unsignedEmployee[data-index="${employeeIndex}"]`)
    ?.remove();

  document
    .querySelector(`.employee[data-index="${employeeIndex}"]`)
    .addEventListener("click", (e) => {
      showDetails(employeeIndex);
    });
}

function showDetails(index) {
  // Find employee from data array
  const emp = data[index]; // simpler than .find()

  // Show popup
  detailsPopup.classList.remove("hidden");

  // Build experiences HTML dynamically
  let experiencesHTML = "";
  if (emp.workExperience && emp.workExperience.length > 0) {
    emp.workExperience.forEach((exp) => {
      experiencesHTML += `
        <div class="experience-item-details p-4 border rounded-lg mb-3 shadow-sm bg-white">
          <h3 class="text-lg font-semibold">${exp.jobTitle}</h3>
          <p class="text-gray-700">
            Company: <span class="font-medium">${exp.company}</span>
          </p>
          <div class="flex gap-2 mt-2 text-sm text-gray-600">
            <span>From: <span class="font-medium">${exp.dateStart}</span></span>
            <span>-</span>
            <span>To: <span class="font-medium">${exp.dateEnd}</span></span>
          </div>
        </div>
      `;
    });
  } else {
    experiencesHTML = `<p class="text-gray-500 text-sm">No work experience available.</p>`;
  }

  // Populate popup content
  document.querySelector(".info").innerHTML = `
    <div class="info">

      <!-- Header -->
      <div class="flex items-center gap-3 mb-4">
        <div
          id="employeePhoto"
          class="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl"
        >
          ${
            emp.photo
              ? `<img src="${emp.photo}" class="w-full h-full object-cover rounded-full"/>`
              : "?"
          }
        </div>
        <div>
          <h2 id="employeeName" class="text-xl font-bold">${emp.name}</h2>
          <p id="employeeRole" class="text-gray-600 text-sm">${emp.role}</p>
        </div>
      </div>

      <!-- Details section -->
      <div
        id="employeeDetails"
        class="flex flex-col gap-3 border-t pt-3 overflow-y-auto pr-2"
      >
        <div class="flex justify-between">
          <span class="font-semibold">Phone:</span>
          <span id="employeePhone" class="text-gray-700">${
            emp.phone || "---"
          }</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Email:</span>
          <span id="employeeEmail" class="text-gray-700">${
            emp.email || "---"
          }</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Department:</span>
          <span id="employeeDepartment" class="text-gray-700">${
            emp.room || "---"
          }</span>
        </div>

        <div class="flex justify-between">
          <span class="font-semibold">Joined:</span>
          <span id="employeeJoined" class="text-gray-700">${
            emp.joined || "---"
          }</span>
        </div>

        <div class="flex flex-col">
          <span class="font-semibold">Notes:</span>
          <p id="employeeNotes" class="text-gray-700 text-sm mt-1">
            ${emp.notes || "No notes available."}
          </p>
        </div>

        <div id="experiences">
          ${experiencesHTML}
        </div>
      </div>
    </div>
  `;
}

// function canEnterRoom(role, room) {
//   const restricted = {
//     receptionist: ["reception"],
//     ittechnician: ["server"],
//     security: ["security"],
//     manager: [
//       "conference",
//       "reception",
//       "server",
//       "security",
//       "staff",
//       "archives",
//     ],
//     nettoyage: ["conference", "reception", "server", "security", "staff"],
//     other: ["conference", "reception", "staff"],
//   };

//   return restricted[role]?.includes(room);
// }

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

  let epx = [];
  document.querySelectorAll(".experience-item").forEach((e) => {
    epx.push({
      jobTitle: e.querySelector("input[name='jobTitle']").value,
      company: e.querySelector("input[name='company']").value,
      dateStart: e.querySelector("input[name='dateStart']").value,
      dateEnd: e.querySelector("input[name='dateEnd']").value,
    });
  });

  const employee = {
    name: form.name.value,
    role: form.role.value,
    photo: form.photo.value,
    email: form.email.value,
    phone: form.phone.value,
    workExperience: epx,
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
  addUnsignedEmployee(employee, data.length - 1);

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
