function login() {
  const defaultUsername = "admin";
  const defaultPassword = "admin123";

  let user = document.getElementById("username").value.trim();
  let pass = document.getElementById("password").value.trim();

  if (user === defaultUsername && pass === defaultPassword) {
    window.location.href = "home.html";
  } else {
    document.getElementById("message").innerText = "Invalid Username or Password";
  }
}
function setActiveButton(activeId) {

  const buttons = ["allBtn","openBtn","closedBtn"];

  buttons.forEach(id => {
    const btn = document.getElementById(id);

    btn.classList.remove("bg-[#4A00FF]","text-white");
    btn.classList.add("bg-gray-100","text-gray-700");
  });

  const activeBtn = document.getElementById(activeId);

  activeBtn.classList.remove("bg-gray-100","text-gray-700");
  activeBtn.classList.add("bg-[#4A00FF]","text-white");

}

let currentFilter = "all";

document.getElementById("allBtn")?.addEventListener("click", () => {
  currentFilter = "all";
  setActiveButton("allBtn");
  loadIssues();
});

document.getElementById("openBtn")?.addEventListener("click", () => {
  currentFilter = "open";
  setActiveButton("openBtn");
  loadIssues();
});

document.getElementById("closedBtn")?.addEventListener("click", () => {
  currentFilter = "closed";
  setActiveButton("closedBtn");
  loadIssues();
});

const getBadgeColor = (label) =>{
  switch (label.toLowerCase()) {
    case "bug": return {
      color:"bg-red-100 text-red-700",
      icon:"fa-solid fa-bug"
    };
    case "help wanted": return{
      color:"bg-yellow-100 text-yellow-700",
      icon:"fa-regular fa-life-ring"
    };
    case "enhancement": return{
      color:"bg-green-100 text-green-700",
      icon:"fa-regular fa-stars"
    } ;
    case "documentation": return{
      color:"bg-blue-100 text-blue-700",
      icon:"fa-duotone fa-regular fa-book-blank"

    };
    case "good first issue": return{
      color:"bg-purple-100 text-purple-700",
      icon:"fa-regular fa-circle-exclamation"

    };
    default: return{
        color: "bg-gray-100 text-gray-700",
        icon: "fa-solid fa-flag"
  }
}};
const getPriorityStyle = (priority) => {
  switch (priority.toLowerCase()) {
    case "high":
      return {
        color: "bg-red-100 text-red-700",
      };

    case "medium":
      return {
        color: "bg-yellow-100 text-yellow-700",
      };

    default:
      return {
        color: "bg-gray-100 text-gray-700",
      };
  }
};
const getImage=(status)=>{
    if(status==="open"){
      return "assets/Open-Status.png"; 
    }
    else{ 
      return "assets/Closed- Status .png" } };
 const getBorderColor = (status) => {
    if (status === "open") {
      return "border-t-4 border-green-500";
    } else {
      return "border-t-4 border-purple-500";
    }
  };
const mobileSearchBtn = document.getElementById("mobileSearch");
const searchBox = document.getElementById("searchBox");

mobileSearchBtn?.addEventListener("click", () => {
  searchBox.classList.toggle("hidden");

  if (!searchBox.classList.contains("hidden")) {
    document.getElementById("searchInput").focus();
  }
});
const searchInput = document.getElementById("searchInput");
  searchInput?.addEventListener("keyup", () => {
  loadIssues();
});
const loadingSpinner=document.getElementById("loadingSpinner");

function IssueModal(issue){

  const modal = document.getElementById("issueModal");

  document.getElementById("modalTitle").innerText = issue.title;

  document.getElementById("modalDesc").innerText = issue.description;

  document.getElementById("modalAuthor").innerText =
  "Opened by " + issue.author;

  document.getElementById("modalDate").innerText =
    issue.createdAt;

  document.getElementById("modalAssignee").innerText =
    issue.author;

  document.getElementById("modalPriority").innerText =
    issue.priority.toUpperCase();

  const labels = document.getElementById("modalLabels");

  labels.innerHTML = issue.labels?.map(label=>{
    const style = getBadgeColor(label);

    return `
      <span class="px-2 py-1 flex items-center gap-1 rounded-full text-xs ${style.color}">
        <i class="${style.icon}"></i>
        ${label}
      </span>
    `;

  }).join("");

  modal.showModal();
}

async function loadIssues() {
  loadingSpinner.classList.remove("hidden");
  loadingSpinner.classList.add("flex");
  const searchText = searchInput?.value.trim();
  let url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

  if (searchText) {
    url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;
  }

  const issueCards = document.getElementById("issueCards");
  if (!issueCards) return;

  try {
    const res = await fetch(url);
    const data = await res.json();

    let issues = data.data;

    if (currentFilter !== "all") {
      issues = issues.filter((issue) => issue.status === currentFilter);
    }

    issueCards.innerHTML = "";

    issues.forEach((issue) => {
      const card = document.createElement("div");
      card.className = `bg-white rounded-lg shadow p-4 border mb-3 w-full ${getBorderColor(issue.status)}`;
      
      card.innerHTML = `
          <div class="card bg-base-100 shadow-md p-5 border">

       <div class="flex justify-between items-center mb-2">
          <img src="${getImage(issue.status)}" alt="${issue.status}" class="w-6 h-6"/>
          ${(() => {
                  const p = getPriorityStyle(issue.priority);
                  return `
                  <span class="px-2 py-1 flex items-center gap-1 text-xs font-semibold rounded-full ${p.color}">
                    ${issue.priority.toUpperCase()}
                  </span>`;
                })()}
        </div>

        <h2 class="font-semibold text-lg">${issue.title}</h2>

        <p class="text-sm text-gray-500 mt-2">
          ${issue.description}
        </p>
       <div class="flex flex-wrap items-center gap-2 mt-3">
       ${issue.labels?.map(label=>{
            const style = getBadgeColor(label);
            return `
            <span class="px-2 py-1 flex items-center gap-1 rounded-full text-xs font-medium whitespace-nowrap ${style.color}">
              <i class="${style.icon}"></i>
              ${label}
            </span>`;
          }).join("")}
          </div>

        <div class=" mt-4 text-sm text-gray-400">
        <div class="flex gap-2">
          <span>#${issue.id}</span>
          <span>by ${issue.author}</span>
        </div>
        <div class=" mt-2"> 
          <span>${issue.createdAt}</span>
        </div>
          
       </div>
    </div>
   `;
      issueCards.appendChild(card);
      card.addEventListener("click", () => {
      IssueModal(issue);
      });
    });
  }
  
  catch (error) {
    console.error("Error loading issues:", error);
    issueCards.innerHTML = `<p class="text-red-500">Failed to load issues</p>`;
  }
   finally {
    loadingSpinner.classList.remove("flex");
    loadingSpinner.classList.add("hidden");
  }
}

loadIssues();