
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function logout() {
    document.cookie = "lawyerToken=; Max-Age=0; path=/;";
    window.location.href = "login.html";
  }

  function formatTime(time) {
    return time.substring(0, 5); // 'HH:mm:ss' → 'HH:mm'
  }

  function isToday(dateStr) {
    const today = new Date();
    const date = new Date(dateStr);
    return date.toDateString() === today.toDateString();
  }

  function getStatusClass(status) {
    switch (status) {
      case 'AVAILABLE': return 'status-available';
      case 'BOOKED': return 'status-booked';
      case 'ACCEPTED': return 'status-accepted';
      case 'REJECTED': return 'status-rejected';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-cancelled';
    }
  }

  function updateSlotStatus(slotId, status) {
    const token = getCookie("lawyerToken");
    if (!token) {
        window.location.href = "/login.html";
        return;
    }
    fetch(`http://localhost:8080/api/slots/${slotId}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ status })
    })
    .then(res => {
      if (res.ok) {
        fetchSlots(); // reload slots
      } else {
        alert("Failed to update slot status.");
      }
    })
    .catch(err => {
      console.error("Error updating slot:", err);
      alert("Error updating slot status.");
    });
  }

  function fetchSlots() {
    const token = getCookie("lawyerToken");
    if (!token) {
        window.location.href = "/login.html";
        return;
    }
    fetch(`http://localhost:8080/api/slots/lawyerSlots`, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch slots");
        return res.json();
      })
      .then(data => {
        const todaySlots = data
          .filter(slot => isToday(slot.date))
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        renderSlots(todaySlots);
      })
      .catch(err => {
        console.error("Error fetching slots:", err);
        document.getElementById('slotsContainer').innerHTML = `
          <div class="no-slots">
            <i class="fas fa-exclamation-triangle"></i>
            <h4>Error loading slots</h4>
            <p>Please try again later</p>
            <button class="btn btn-primary mt-2" onclick="fetchSlots()">Retry</button>
          </div>`;
      });
  }

  function renderSlots(slots) {
    const container = document.getElementById('slotsContainer');
    
    if (slots.length === 0) {
      container.innerHTML = `
        <div class="no-slots">
          <i class="fas fa-calendar-times"></i>
          <h4>No slots scheduled for today</h4>
          <p>You haven't created any slots for today yet.</p>
          <a href="add-slot.html" class="btn btn-primary mt-2">Add Slot</a>
        </div>`;
      return;
    }

    let tableHTML = `
      <div class="table-responsive">
        <table class="slots-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
    `;

    slots.forEach(slot => {
      const statusClass = getStatusClass(slot.status);
      
      tableHTML += `
        <tr>
          <td>
            <strong>${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}</strong>
          </td>
          <td>
            <span class="status-badge ${statusClass}">${slot.status}</span>
          </td>
          <td>
            <div class="action-buttons">
      `;
      
      // Show appropriate actions based on status
      if (slot.status === 'BOOKED') {
        tableHTML += `
          <button class="btn-action btn-accept" onclick="updateSlotStatus(${slot.id}, 'ACCEPTED')">
            <i class="fas fa-check me-1"></i>Accept
          </button>
          <button class="btn-action btn-reject" onclick="updateSlotStatus(${slot.id}, 'REJECTED')">
            <i class="fas fa-times me-1"></i>Reject
          </button>
        `;
      } else if (slot.status === 'AVAILABLE') {
        tableHTML += `
          <span class="text-muted">No actions available</span>
        `;
      } else {
        tableHTML += `
          <span class="text-muted">Action completed</span>
        `;
      }
      
      tableHTML += `
            </div>
          </td>
        </tr>
      `;
    });

    tableHTML += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = tableHTML;
  }

  // Load slots on page load
  document.addEventListener('DOMContentLoaded', fetchSlots);