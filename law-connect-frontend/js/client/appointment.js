
let appointments = [];
const container = document.getElementById("appointmentsList");

// Get cookie
function getCookie(name){
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Status badge
function statusBadge(status){
  const map = {
    CONFIRMED: "status-confirmed",
    PENDING: "status-pending", 
    REJECTED: "status-rejected",
    COMPLETED: "status-completed"
  };
  return `<span class="status-badge ${map[status] || ""}">${status}</span>`;
}

// Format date
function formatDate(d){
  return new Date(d + "T00:00:00").toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

// Check if appointment is in the future
function isFuture(a){
  const now = new Date();
  return new Date(a.appointmentDate + "T" + (a.slot?.endTime || a.appointmentTime)) > now;
}

// Render appointments
function render(status = "UPCOMING"){
  let list = [];
  
  if (status === "UPCOMING") {
    list = appointments.filter(a => isFuture(a) && a.status !== "REJECTED")
                      .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));
  } else if (status === "COMPLETED") {
    list = appointments.filter(a => a.status === "COMPLETED");
  } else if (status === "HISTORY") {
    list = [...appointments].sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
  } else if (status === "CANCELLED") {
    list = appointments.filter(a => a.status === "REJECTED");
  }

  container.innerHTML = "";
  
  if (list.length === 0) {
    container.innerHTML = `
      <div class="no-appointments">
        <i class="fas fa-calendar-times"></i>
        <h4>No ${status.toLowerCase()} appointments found</h4>
        <p>You don't have any ${status.toLowerCase()} appointments yet.</p>
      </div>`;
    return;
  }

  list.forEach(a => {
    const canRate = (status === "COMPLETED" && !a.rated);
    const ratingHTML = canRate ? `
      <div class="rating-container">
        <p class="mb-2"><strong>Rate your experience with ${a.lawyer.user.firstName}</strong></p>
        <div class="d-flex align-items-center">
          <select id="rating-${a.id}" class="rating-select form-select">
            <option value="">Select rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
          <button class="btn-rate" onclick="submitRating(${a.lawyer.id}, ${a.id})">
            <i class="fas fa-star me-1"></i>Submit Rating
          </button>
        </div>
      </div>` : (a.rated ? `<p class="text-success mt-2"><i class="fas fa-check-circle me-1"></i>Rated</p>` : "");

    container.innerHTML += `
      <div class="appointment-card">
        <div class="appointment-header">
          <div>
            <h3 class="lawyer-name">${a.lawyer.user.firstName} ${a.lawyer.user.lastName}</h3>
            <p class="lawyer-specialty">${a.lawyer.specialization || "General Practice"}</p>
          </div>
          ${statusBadge(a.status)}
        </div>
        
        <div class="appointment-body">
          <div class="appointment-detail">
            <i class="fas fa-calendar-alt"></i>
            <span><strong>Date:</strong> ${formatDate(a.appointmentDate)}</span>
          </div>
          
          <div class="appointment-detail">
            <i class="fas fa-clock"></i>
            <span><strong>Time:</strong> ${a.appointmentTime} - ${a.slot?.endTime || "N/A"}</span>
          </div>
          
          <div class="appointment-detail">
            <i class="fas fa-money-bill-wave"></i>
            <span><strong>Charges:</strong> ₹${a.slot?.charges || "N/A"}</span>
          </div>
          
          ${a.meetLink && a.status === "CONFIRMED" ? `
            <div class="appointment-actions">
              <a href="${a.meetLink}" target="_blank" class="btn-join">
                <i class="fas fa-video me-2"></i>Join Meeting
              </a>
            </div>
          ` : ""}
          
          ${ratingHTML}
        </div>
      </div>`;
  });
}

// Submit rating
async function submitRating(lawyerId, appointmentId) {
  const select = document.getElementById(`rating-${appointmentId}`);
  const rating = select.value;
  
  if (!rating) {
    alert("Please select a rating!");
    return;
  }

  try {
    const token = getCookie("userToken");
    if(token === null){
      window.location.href = "/index.html"
    }
    const res = await fetch("http://localhost:8080/api/rate-lawyer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ lawyerId, appointmentId, rating: parseInt(rating) })
    });

    if (!res.ok) throw new Error("Failed to submit rating");

    alert("Rating submitted successfully!");
    fetchAppointments(); // refresh appointments
  } catch (err) {
    console.error(err);
    alert("Error submitting rating");
  }
}

// Fetch appointments
async function fetchAppointments() {
  try {
    const token = getCookie("userToken");
    if(token === null){
      window.location.href = "/index.html"
    }
    const res = await fetch("http://localhost:8080/api/users/userAppointments", {
      headers: { "Authorization": "Bearer " + token }
    });
    
    if (!res.ok) throw new Error("Failed to fetch appointments");
    
    appointments = await res.json();
    render("UPCOMING");
  } catch (e) {
    console.error(e);
    container.innerHTML = `
      <div class="no-appointments">
        <i class="fas fa-exclamation-triangle"></i>
        <h4>Error loading appointments</h4>
        <p>Please try again later</p>
        <button class="btn btn-primary mt-2" onclick="fetchAppointments()">Retry</button>
      </div>`;
  }
}

// Tab click event
document.querySelectorAll("#appointmentTabs .nav-link").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#appointmentTabs .nav-link").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render(btn.dataset.status);
  });
});

// Initialize
document.addEventListener('DOMContentLoaded', fetchAppointments);