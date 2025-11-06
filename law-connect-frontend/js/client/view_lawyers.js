
  const pageSize = 6; // Number of cards per page
  let currentPage = 1;
  let lawyers = [];
  let filteredLawyers = [];

  function renderPagination(totalPages) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const prevDisabled = currentPage === 1 ? "disabled" : "";
    const nextDisabled = currentPage === totalPages ? "disabled" : "";

    pagination.innerHTML += `
      <li class="page-item ${prevDisabled}">
        <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
      </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
        </li>
      `;
    }

    pagination.innerHTML += `
      <li class="page-item ${nextDisabled}">
        <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
      </li>
    `;
  }

  function changePage(page) {
    const totalPages = Math.ceil(filteredLawyers.length / pageSize);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderLawyers();
    renderPagination(totalPages);
  }

  function renderLawyers() {
    const container = document.getElementById("lawyer-list");
    container.innerHTML = "";

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const currentLawyers = filteredLawyers.slice(start, end);

    if (currentLawyers.length === 0) {
      container.innerHTML = `<p class="text-center text-muted">No lawyers found.</p>`;
      return;
    }

    currentLawyers.forEach(lawyer => {
      const fullName = `${lawyer.user?.firstName || "N/A"} ${lawyer.user?.lastName || ""}`;
      const email = lawyer.user?.email || "Not available";
      const contact = lawyer.user?.contactNo || "N/A";
      const specialization = lawyer.specialization || "General";
      const bio = lawyer.bio || "No bio available";
      const experience = lawyer.experience || 0;
      const rating = lawyer.rating || "Not rated";

      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
        <div class="lawyer-card">
          <div class="lawyer-header">
            <div class="lawyer-rating">
              <i class="fas fa-star"></i>
              ${rating}
            </div>
            <div class="d-flex align-items-center gap-3">
              <img src="https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}" 
                   alt="${fullName}" class="lawyer-avatar">
              <div class="text-start">
                <h3 class="lawyer-name">${fullName}</h3>
                <p class="lawyer-specialty mb-0">${specialization}</p>
              </div>
            </div>
          </div>
          <div class="lawyer-body">
            <div class="lawyer-info">
              <i class="fas fa-envelope"></i>
              <span>${email}</span>
            </div>
            <div class="lawyer-info">
              <i class="fas fa-phone"></i>
              <span>${contact}</span>
            </div>
            <div class="lawyer-info">
              <i class="fas fa-briefcase"></i>
              <span>${experience} years experience</span>
            </div>
            <div class="lawyer-bio">${bio}</div>
            <div class="lawyer-actions">
              <button class="btn-book" onclick="location.href='book-appointment.html?lawyerId=${lawyer.id}'">
                <i class="fas fa-calendar-check me-1"></i> Book
              </button>
              <button class="btn-profile" onclick="location.href='lawyer_profile.html?lawyerId=${lawyer.id}'">
                <i class="fas fa-address-card me-1"></i> Profile
              </button>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // 🔎 Search function
function searchLawyers() {
  const query = document.querySelector(".filter-section input").value.toLowerCase();
  const specializationFilter = document.getElementById("specializationFilter")?.value.toLowerCase() ||"";
  const experienceFilter = document.getElementById("experienceFilter")?.value || "";
  const ratingFilter = document.getElementById("ratingFilter")?.value || "";

  filteredLawyers = lawyers.filter(lawyer => {
    const fullName = `${lawyer.user?.firstName || ""} ${lawyer.user?.lastName || ""}`.toLowerCase();
    const email = (lawyer.user?.email || "").toLowerCase();
    const specialization = (lawyer.specialization || "").toLowerCase();
    const experience = parseInt(lawyer.experience || 0); 
    const rating = parseFloat(lawyer.rating || 0);       

    // ✅ Free text search
    const matchesQuery =
      fullName.includes(query) ||
      email.includes(query) ||
      specialization.includes(query) ||
      experience.toString().includes(query) ||
      rating.toString().includes(query);

    // ✅ Exact specialization filter
    const matchesSpecialization = specializationFilter
      ? specialization === specializationFilter
      : true;

    // ✅ Experience filter
    let matchesExperience = true;
    if (experienceFilter === "0-2") matchesExperience = experience >= 0 && experience <= 2;
    if (experienceFilter === "3-5") matchesExperience = experience >= 3 && experience <= 5;
    if (experienceFilter === "5+") matchesExperience = experience >= 5;

    // ✅ Rating filter
    let matchesRating = true;
    if (ratingFilter === "4+") matchesRating = rating >= 4;
    if (ratingFilter === "3+") matchesRating = rating >= 3;
    if (ratingFilter === "2+") matchesRating = rating >= 2;

    return matchesQuery && matchesSpecialization && matchesExperience && matchesRating;
  });

  currentPage = 1;
  renderLawyers();
  renderPagination(Math.ceil(filteredLawyers.length / pageSize));
}
  // Initial Fetch
  function getCookie(name){
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  const token = getCookie("userToken");
    if(token === null){
      window.location.href = "/index.html"
    }
  fetch("http://localhost:8080/api/users/getAllLawyers",{
    method : "GET",
    headers :{
      "Content-Type": "application/json",
      "Authorization" : "Bearer "+ token 
    }
  })
    .then(res => res.json())
    .then(data => {
      lawyers = data;
      filteredLawyers = [...lawyers]; // ✅ keep a copy for search
      renderLawyers();
      renderPagination(Math.ceil(filteredLawyers.length / pageSize));
    })
    .catch(err => {
      console.error("Error loading lawyers:", err);
    });

  // 🔎 Trigger search on typing
  document.querySelector(".filter-section input").addEventListener("input", searchLawyers);
  document.querySelector(".filter-section select").addEventListener("change", searchLawyers);