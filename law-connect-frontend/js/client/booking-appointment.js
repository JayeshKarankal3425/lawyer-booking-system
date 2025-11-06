 const urlParams = new URLSearchParams(window.location.search);
    const lawyerId = urlParams.get('lawyerId');
    const slotSection = document.getElementById("slot-section");
    let selectedSlotId = null;
    let lawyerName = "the lawyer";

    // Get today's and tomorrow's date in yyyy-MM-dd format
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => date.toISOString().split("T")[0];
    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(tomorrow);

    // Format date for display
    function formatDisplayDate(dateStr) {
      const date = new Date(dateStr + "T00:00:00");
      return date.toLocaleDateString('en-US', {
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    }

    // Get cookie function
    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }

    // Fetch lawyer details to get name
    function fetchLawyerDetails() {
      const token = getCookie("userToken");
      if(token === null){
        window.location.href = "/index.html"
      }
      return fetch(`http://localhost:8080/api/users/lawyer/${lawyerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      })
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch lawyer details");
        return response.json();
      })
      .then(lawyer => {
        lawyerName = `${lawyer.user.firstName} ${lawyer.user.lastName}`;
        document.title = `Book with ${lawyerName} | LawConnect`;
        document.querySelector('.page-title').textContent = `Book with ${lawyerName}`;
      })
      .catch(error => {
        console.error("Error fetching lawyer details:", error);
      });
    }

    // Fetch available slots
    function fetchAvailableSlots() {
      const token = getCookie("userToken");
      if(token === null){
        window.location.href = "/index.html"
      }
      fetch(`http://localhost:8080/api/users/lawyer/${lawyerId}/slots`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      })
        .then(response => {
          if (!response.ok) throw new Error("Failed to fetch slots");
          return response.json();
        })
        .then(slots => {
          if (!slots || slots.length === 0) {
            slotSection.innerHTML = `
              <div class="no-slots">
                <i class="fas fa-calendar-times"></i>
                <h4>No slots available</h4>
                <p>Please check back later or try another lawyer</p>
              </div>
            `;
            return;
          }

          // Filter for only today and tomorrow
          const filteredSlots = slots.filter(slot => slot.date === todayStr || slot.date === tomorrowStr);

          // Sort by date then start time
          filteredSlots.sort((a, b) => {
            if (a.date === b.date) {
              return a.startTime.localeCompare(b.startTime);
            }
            return new Date(a.date) - new Date(b.date);
          });

          if (filteredSlots.length === 0) {
            slotSection.innerHTML = `
              <div class="no-slots">
                <i class="fas fa-calendar-day"></i>
                <h4>No slots for today or tomorrow</h4>
                <p>Check back later for availability</p>
              </div>
            `;
            return;
          }

          let html = `<h3 class="mb-4" style="color: var(--secondary);">Available Time Slots</h3>`;
          html += `<div class="slot-grid">`;
          
          filteredSlots.forEach(slot => {
            const displayDate = formatDisplayDate(slot.date);
            const startTime = slot.startTime?.slice(0, 5) || "N/A";
            const endTime = slot.endTime?.slice(0, 5) || "N/A";
            const statusClass = slot.status === 'AVAILABLE' ? 'status-available' : 'status-booked';

            html += `
              <div class="slot-card" data-slot-id="${slot.id}">
                <div class="slot-date">
                  <i class="fas fa-calendar-alt"></i>
                  ${displayDate}
                </div>
                <div class="slot-time">
                  <i class="fas fa-clock"></i>
                  ${startTime} - ${endTime}
                </div>
                <div class="slot-details">
                  <div class="slot-charges">
                    <i class="fas fa-tag"></i>
                    ₹${slot.charges}
                  </div>
                  <div class="slot-status ${statusClass}">
                    ${slot.status}
                  </div>
                </div>
              </div>
            `;
          });
          
          html += `</div>`;
          slotSection.innerHTML = html;

          // Add click events to each slot card
          document.querySelectorAll(".slot-card").forEach(card => {
            // Only make available slots selectable
            const statusElement = card.querySelector('.slot-status');
            if (statusElement && statusElement.textContent.trim() === 'AVAILABLE') {
              card.style.cursor = 'pointer';
              
              card.addEventListener("click", function () {
                document.querySelectorAll(".slot-card").forEach(c => c.classList.remove("selected"));
                this.classList.add("selected");
                selectedSlotId = this.getAttribute("data-slot-id");
                document.getElementById("book-btn").disabled = false;
              });
            } else {
              card.style.cursor = 'not-allowed';
              card.style.opacity = '0.7';
            }
          });
        })
        .catch(err => {
          console.error("Failed to load slots:", err);
          slotSection.innerHTML = `
            <div class="no-slots">
              <i class="fas fa-exclamation-triangle"></i>
              <h4>Failed to load appointment slots</h4>
              <p>Please try again later</p>
            </div>
          `;
        });
    }

    // Book appointment function
    function bookAppointment() {
      if (!selectedSlotId) return;
      
      const token = getCookie("userToken");
      if(token === null){
        window.location.href = "/index.html"
      }
      const bookBtn = document.getElementById("book-btn");
      const originalText = bookBtn.innerHTML;
      
      // Show loading state
      bookBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Booking...';
      bookBtn.disabled = true;
      
      fetch("http://localhost:8080/api/users/book", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          slotId: selectedSlotId,
        })
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to book");

        // Try parsing JSON, fallback to text
        return res.text().then(text => {
          try {
            return JSON.parse(text);
          } catch {
            return { message: text };
          }
        });
      })
      .then(data => {
        // Show success state
        bookBtn.innerHTML = '<i class="fas fa-check me-2"></i>Booked Successfully!';
        bookBtn.style.background = 'var(--success)';
        
        // Show success message
        alert("✅ " + data.message);
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = "appointments.html";
        }, 1500);
      })
      .catch(err => {
        console.error(err);
        alert("❌ Error booking appointment. Please try again.");
        
        // Reset button
        bookBtn.innerHTML = originalText;
        bookBtn.disabled = false;
      });
    }

    // Initialize page
    document.addEventListener('DOMContentLoaded', function() {
      // First fetch lawyer details, then slots
      fetchLawyerDetails().then(() => {
        fetchAvailableSlots();
      });
      
      // Add event listener to book button
      document.getElementById("book-btn").addEventListener("click", bookAppointment);
    });