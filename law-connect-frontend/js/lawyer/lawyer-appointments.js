 const today = new Date().toISOString().split("T")[0];
  
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function logout() {
    document.cookie = "lawyerToken=; Max-Age=0; path=/;";
    window.location.href = "login.html";
  }

  function getStatusClass(status) {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'CONFIRMED': return 'status-confirmed';
      case 'COMPLETED': return 'status-completed';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-pending';
    }
  }

  async function fetchTodayRequests() {
    try {
      const token = getCookie("lawyerToken");
      if(token === null){
        window.location.href = "/index.html"
      }
      const response = await fetch(`http://localhost:8080/api/appointments/lawyer/allAppointments`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch appointments");

      const appointments = await response.json();

      // Filter only today's requests & sort by time
      const todayRequests = appointments
        .filter(app => app.appointmentDate === today)
        .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));

      const container = document.getElementById("appointmentsContainer");
      container.innerHTML = "";

      if (todayRequests.length === 0) {
        container.innerHTML = `
          <div class="no-appointments">
            <i class="fas fa-calendar-check"></i>
            <h4>No booking requests for today</h4>
            <p>You don't have any appointment requests scheduled for today.</p>
          </div>`;
        return;
      }

      todayRequests.forEach(app => {
        const statusClass = getStatusClass(app.status);
        const card = document.createElement("div");
        card.className = "col-12 mb-3";
        
        card.innerHTML = `
          <div class="appointment-card">
            <div class="appointment-header">
              <div>
                <h3 class="client-name">${app.client?.firstName || 'Unknown'} ${app.client?.lastName || ''}</h3>
                <p class="mb-0 text-muted">Client Appointment Request</p>
              </div>
              <span class="appointment-status ${statusClass}">${app.status}</span>
            </div>
            
            <div class="appointment-body">
              <div class="appointment-detail">
                <i class="fas fa-envelope"></i>
                <span><strong>Email:</strong> ${app.client?.email || 'N/A'}</span>
              </div>
              
              <div class="appointment-detail">
                <i class="fas fa-phone"></i>
                <span><strong>Contact:</strong> ${app.client?.contactNo || 'N/A'}</span>
              </div>
              
              <div class="appointment-detail">
                <i class="fas fa-calendar-day"></i>
                <span><strong>Date:</strong> ${app.appointmentDate}</span>
              </div>
              
              <div class="appointment-detail">
                <i class="fas fa-clock"></i>
                <span><strong>Time:</strong> ${app.appointmentTime} - ${app.slot?.endTime || 'N/A'}</span>
              </div>
              
              <div class="appointment-actions">
                ${app.status === 'PENDING' ? `
                  <button class="btn-action btn-accept" onclick="updateStatus(${app.id}, 'CONFIRMED')">
                    <i class="fas fa-check me-2"></i>Accept
                  </button>
                  <button class="btn-action btn-reject" onclick="updateStatus(${app.id}, 'CANCELLED')">
                    <i class="fas fa-times me-2"></i>Reject
                  </button>
                ` : ''}
                
                ${app.status === 'CONFIRMED' ? `
                  ${app.meetLink ? `
                    <a href="${app.meetLink}" target="_blank" class="btn-action btn-join">
                      <i class="fas fa-video me-2"></i>Join Meeting
                    </a>
                  ` : ''}
                  <button class="btn-action btn-complete" onclick="updateStatus(${app.id}, 'COMPLETED')">
                    <i class="fas fa-check-circle me-2"></i>Mark Completed
                  </button>
                ` : ''}
                
                ${app.status === 'COMPLETED' ? `
                  <span class="text-success"><i class="fas fa-check-circle me-2"></i>Appointment completed</span>
                ` : ''}
                
                ${app.status === 'CANCELLED' ? `
                  <span class="text-danger"><i class="fas fa-times-circle me-2"></i>Appointment cancelled</span>
                ` : ''}
              </div>
            </div>
          </div>
        `;

        container.appendChild(card);
      });

    } catch (error) {
      console.error(error);
      document.getElementById("appointmentsContainer").innerHTML = `
        <div class="no-appointments">
          <i class="fas fa-exclamation-triangle"></i>
          <h4>Error loading appointments</h4>
          <p>Please try again later</p>
          <button class="btn btn-primary mt-2" onclick="fetchTodayRequests()">Retry</button>
        </div>`;
    }
  }

  async function updateStatus(appointmentId, newStatus) {
    try {
      const token = getCookie("lawyerToken");
      if(token === null){
        window.location.href = "/index.html"
      }
      const response = await fetch(`http://localhost:8080/api/appointments/update-status/${appointmentId}`, {
        method: 'PUT',
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Show success message
      alert(`Appointment status updated to ${newStatus}`);
      fetchTodayRequests(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Error updating appointment status.");
    }
  }

  // Initial fetch on page load
  document.addEventListener('DOMContentLoaded', fetchTodayRequests);