
  const API_BASE_URL = "http://localhost:8080"; 

  const profileForm = document.getElementById("profileForm");
  const saveBtn = document.getElementById("saveBtn");
  
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  async function loadProfile() {
    try {
      const token = getCookie("userToken");
      if(token === null){
        window.location.href = "/index.html"
      }
      const res = await fetch(`${API_BASE_URL}/api/users/get`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token
        }
      });
      
      if (!res.ok) throw new Error("Failed to fetch user");
      const user = await res.json();

      document.getElementById("userName").textContent = `${user.firstName} ${user.lastName}`;
      document.getElementById("userEmail").textContent = user.email;

      // Update avatar with user's initials
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + user.lastName)}&background=ffffff&color=2563eb&size=128&font-size=0.4&bold=true`;
      document.getElementById("userAvatar").src = avatarUrl;

      document.getElementById("firstName").value = user.firstName || "";
      document.getElementById("lastName").value = user.lastName || "";
      document.getElementById("contactNo").value = user.contactNo || "";
      document.getElementById("age").value = user.age || "";
    } catch (err) {
      alert("Error loading profile: " + err.message);
    }
  }

  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';

    const updatedUser = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      contactNo: document.getElementById("contactNo").value.trim(),
      email: document.getElementById("userEmail").textContent,
      age: parseInt(document.getElementById("age").value, 10) || 0
    };

    try {
      const token = getCookie("userToken");
      if(token === null){
      window.location.href = "/index.html"
      }
      const res = await fetch(`${API_BASE_URL}/api/users/updateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(updatedUser)
      });
      
      if (!res.ok) throw new Error("Failed to update profile");

      // Show success feedback
      saveBtn.innerHTML = '<i class="fas fa-check me-2"></i>Saved Successfully!';
      setTimeout(() => {
        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Changes';
        saveBtn.disabled = false;
      }, 2000);
      
      // Update the displayed name
      document.getElementById("userName").textContent = `${updatedUser.firstName} ${updatedUser.lastName}`;
      
      // Update avatar with new name
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(updatedUser.firstName + ' ' + updatedUser.lastName)}&background=ffffff&color=2563eb&size=128&font-size=0.4&bold=true`;
      document.getElementById("userAvatar").src = avatarUrl;
      
    } catch (err) {
      alert("Error: " + err.message);
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Changes';
    }
  });

  // Load profile when page loads
  document.addEventListener('DOMContentLoaded', loadProfile);