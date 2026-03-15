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


let currentFilter = "all";

document.getElementById("allBtn")?.addEventListener("click", () => {
  currentFilter = "all";
  loadIssues();
});

document.getElementById("openBtn")?.addEventListener("click", () => {
  currentFilter = "open";
  loadIssues();
});

document.getElementById("closedBtn")?.addEventListener("click", () => {
  currentFilter = "closed";
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
      icon:"fa-utility fa-semibold fa-life-ring"
    };
    case "enhancement": return{
      color:"bg-green-100 text-green-700",
      icon:""
    } ;
    case "documentation": return{
      color:"bg-blue-100 text-blue-700",
      icon:""

    };
    case "good first issue": return{
      color:"bg-purple-100 text-purple-700",
      icon:""

    };
    default: return{
        color: "bg-gray-100 text-gray-700",
        icon: "fa-solid fa-flag"
  }
}};
const getPriorityStyle = (priority) =>{
  switch(priority.toLowerCase()){
    case "high": return "bg-red-100 text-red-700"; 
    case "medium": return "bg-yellow-100 text-yellow-700";
    default: return "bg-gray-100 text-gray-700";
  }

}
const getImage=(status)=>{
    if(status==="open"){
      return "assets/Open-Status.png"; 
    }
    else{ 
      return "assets/Closed- Status .png" } };

const searchInput = document.getElementById("searchInput");
  searchInput?.addEventListener("keyup", () => {
  loadIssues();
});

async function loadIssues() {
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
      card.className = "bg-white rounded-lg shadow p-4 border mb-3 w-full";

      card.innerHTML = `
          <div class="card bg-base-100 shadow-md p-5 border">

       <div class="flex justify-between items-center mb-2">
          <img src="${getImage(issue.status)}" alt="${issue.status}" class="w-6 h-6"/>
          ${(() => {
                  const p = getPriorityStyle(issue.priority);
                  return `
                  <span class="px-2 py-1 flex items-center gap-1 text-xs font-semibold rounded-full ${p.color}">
                    <i class="${p.icon}"></i>
                    ${issue.priority.toUpperCase()}
                  </span>`;
                })()}
        </div>

        <h2 class="font-semibold text-lg">${issue.title}</h2>

        <p class="text-sm text-gray-500 mt-2">
          ${issue.description}
        </p>

       ${issue.labels?.map(label=>{
            const style = getBadgeColor(label);
            return `
            <span class="px-2 py-1 flex items-center gap-1 rounded-full text-xs font-medium whitespace-nowrap ${style.color}">
              <i class="${style.icon}"></i>
              ${label}
            </span>`;
          }).join("")}

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
    });
  } catch (error) {
    console.error("Error loading issues:", error);
    issueCards.innerHTML = `<p class="text-red-500">Failed to load issues</p>`;
  }
}

loadIssues();