// Helper: Get cookie value
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  // Logout function
  function logout() {
    document.cookie = "lawyerToken=; Max-Age=0; path=/;";
    window.location.href = "login.html";
  }

  // Set minimum date to today
  document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
  });

  // Form submission
  document.getElementById('slotForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const token = getCookie("lawyerToken");
    if (!token) {
      window.location.href = "/login.html";
      return;
    }
    
    const submitBtn = document.getElementById('submitBtn');
    const messageBox = document.getElementById('message');
    
    // Validate time inputs
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (startTime >= endTime) {
      messageBox.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>End time must be after start time.
        </div>`;
      return;
    }
    
    const slot = {
      date: document.getElementById('date').value,
      startTime: startTime + ':00', // Add seconds for backend compatibility
      endTime: endTime + ':00',     // Add seconds for backend compatibility
      charges: document.getElementById('charges').value,
      status: document.getElementById('status').value
    };
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating...';
    messageBox.innerHTML = '';
    if(token === null){
      window.location.href = "/index.html"
    }
    fetch(`http://localhost:8080/api/slots/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(slot)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to create slot');
      }
    })
    .then(data => {
      messageBox.innerHTML = `
        <div class="alert alert-success">
          <i class="fas fa-check-circle me-2"></i>Slot created successfully!
        </div>`;
      
      // Reset form
      document.getElementById('slotForm').reset();
      
      // Set date to today as default
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('date').value = today;
    })
    .catch(error => {
      console.error('Error:', error);
      messageBox.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>${error.message || 'Failed to create slot. Please try again.'}
        </div>`;
    })
    .finally(() => {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-plus-circle me-2"></i>Create Slot';
    });
  });