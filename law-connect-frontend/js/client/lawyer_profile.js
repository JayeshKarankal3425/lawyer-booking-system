
  const params = new URLSearchParams(window.location.search);
  const lawyerId = params.get("lawyerId");
  
  function getCookie(name){
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }
  
  if (!lawyerId) {
    document.getElementById("profile-content").innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <h4>Lawyer ID not found</h4>
        <p>Please return to the directory and select a lawyer</p>
        <a href="view-lawyers.html" class="btn btn-primary mt-2">Back to Directory</a>
      </div>
    `;
  } else {
    const token = getCookie("userToken");
    if(token === null){
      window.location.href = "/index.html"
    }
    fetch(`http://localhost:8080/api/users/lawyerProfile/${lawyerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token 
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch lawyer profile");
        return res.json();
      })
      .then(lawyer => {
        const fullName = `${lawyer.user?.firstName || ''} ${lawyer.user?.lastName || ''}`;
        const email = lawyer.user?.email || 'Not provided';
        const contact = lawyer.user?.contactNo || 'N/A';
        const specialization = lawyer.specialization || 'General Practice';
        const experience = lawyer.experience || '0';
        const bio = lawyer.bio || 'No bio available.';
        const rating = lawyer.rating || 'Not rated';
        const ratingCount = lawyer.ratingCount || 0;
        document.getElementById("profile-content").innerHTML = `
          <div class="profile-card">
            <div class="profile-header">
              <img src="https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=2563eb&fontColor=ffffff&fontSize=40" 
                   alt="${fullName}" class="profile-avatar">
              <div class="profile-header-content">
                <h1 class="profile-name">${fullName}</h1>
                <p class="profile-specialty">${specialization}</p>
                <div class="profile-rating">
                  <i class="fas fa-star"></i> 
                  <span>${rating + " Star"}</span>
                </div>

                 <div class="profile-rating">
                  <i class="fas fa-star"></i>
                  <span>Rated By ${ratingCount} Peoples</span>
                </div>
              </div>
            </div>
            
            <div class="profile-body">
              <div class="profile-info">
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">Email</div>
                    <div class="info-value">${email}</div>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-phone"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">Contact Number</div>
                    <div class="info-value">${contact}</div>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <i class="fas fa-briefcase"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">Experience</div>
                    <div class="info-value">${experience} years</div>
                  </div>
                </div>
              </div>
              
              <div class="profile-bio">
                <h3 class="bio-title">
                  <i class="fas fa-user"></i> About Me
                </h3>
                <p class="bio-content">${bio}</p>
              </div>
              
              <div class="profile-actions">
                <a href="view-lawyers.html" class="btn-back">
                  <i class="fas fa-arrow-left me-2"></i>Back to Directory
                </a>
                <a href="book-appointment.html?lawyerId=${lawyerId}" class="btn-book">
                  <i class="fas fa-calendar-check me-2"></i>Book Appointment
                </a>
              </div>
            </div>
          </div>
        `;
      })
      .catch(error => {
        console.error(error);
        document.getElementById("profile-content").innerHTML = `
          <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h4>Failed to load profile</h4>
            <p>Please try again later</p>
            <button class="btn btn-primary mt-2" onclick="window.location.reload()">Try Again</button>
          </div>
        `;
      });
  }