
const lawyerId = 101; // Replace with logged-in lawyer ID
const apiUrl = `http://localhost:8080/api/appointments/lawyer/${lawyerId}`;

async function loadLawyerAppointments() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();

    const container = document.getElementById("lawyer-appointments-container");
    container.innerHTML = "";

    const confirmed = data.filter(app => app.status === "CONFIRMED");

    if (confirmed.length === 0) {
      container.innerHTML = `<p class="text-muted">No upcoming confirmed appointments.</p>`;
      return;
    }

    confirmed.forEach(app => {
      const card = document.createElement("div");
      card.className = "col-md-6";

      const startTime = new Date(app.appointmentTime).toLocaleString();
      const endTime = new Date(app.slot.endTime).toLocaleString();

      card.innerHTML = `
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title">Appointment #${app.id}</h5>
            <p class="card-text"><strong>Start:</strong> ${startTime}</p>
            <p class="card-text"><strong>End:</strong> ${endTime}</p>
            <a href="${app.meetLink}" target="_blank" class="btn btn-primary">Join Meeting</a>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading lawyer appointments:", err);
  }
}

loadLawyerAppointments();