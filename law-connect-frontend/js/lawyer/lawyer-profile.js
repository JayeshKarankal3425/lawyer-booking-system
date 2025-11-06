
    let pass = "";
    let rate = 0.0;
    let lawyerId = null;

    // Helper: Get cookie value
    function getCookie(name) {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      document.cookie = "lawyerToken=; Max-Age=0; path=/;";
      window.location.href = "/login.html";
    });

    window.onload = async function () {
      const token = getCookie("lawyerToken");

      const messageBox = document.getElementById('message');
      messageBox.innerHTML = '';

      try {
        if (!token) {
          window.location.href = "/index.html";
          return;
        }
        const res = await fetch("http://localhost:8080/api/lawyer/getlawyer", {
          headers: { "Authorization": "Bearer " + token }
        });

        const data = await res.json();
        console.log(data);
        
        // Hide loading state, show form
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('profileForm').style.display = 'block';
        
        // If profile does not exist
        if (data.message && data.message.includes("not created")) {
          messageBox.innerHTML = `
            <div class="alert alert-info">
              <i class="fas fa-info-circle me-2"></i>No lawyer profile found. Please create one.
            </div>`;
          lawyerId = null;
          return;
        }

        // Else, lawyer profile exists
        lawyerId = data.id;
        pass = data.user?.password || "";
        rate = data.rating || 0;

        document.getElementById('firstName').value = data.user?.firstName || "";
        document.getElementById('lastName').value = data.user?.lastName || "";
        document.getElementById('email').value = data.user?.email || "";
        document.getElementById('age').value = data.user?.age || "";
        document.getElementById('contactNo').value = data.user?.contactNo || "";
        document.getElementById('specialization').value = data.specialization || "";
        document.getElementById('experience').value = data.experience || "";
        document.getElementById('bio').value = data.bio || "";

        messageBox.innerHTML = `
          <div class="alert alert-success">
            <i class="fas fa-check-circle me-2"></i>Profile loaded successfully.
          </div>`;
          
      } catch (err) {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('profileForm').style.display = 'block';
        messageBox.innerHTML = `
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>Failed to load profile.
          </div>`;
      }
    };

    // Build lawyer data from form
    function buildLawyerData() {
      return {
        user: {
          firstName: document.getElementById('firstName').value,
          lastName: document.getElementById('lastName').value,
          email: document.getElementById('email').value,
          age: document.getElementById('age').value,
          contactNo: document.getElementById('contactNo').value,
          password: pass
        },
        specialization: document.getElementById('specialization').value,
        experience: document.getElementById('experience').value,
        bio: document.getElementById('bio').value,
        rating: rate
      };
    }

    // Create
    document.getElementById("createBtn").addEventListener("click", async () => {
      const token = getCookie("lawyerToken");
      if (!token) {
        window.location.href = "/login.html";
        return;
      }
      const lawyerData = buildLawyerData();
      const messageBox = document.getElementById('message');
      messageBox.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-spinner fa-spin me-2"></i>Creating profile...
        </div>`;

      try {
        if (!token) {
          window.location.href = "/login.html";
          return;
        }
        const res = await fetch("http://localhost:8080/api/lawyer/create", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify(lawyerData)
        });

        if (!res.ok) throw new Error("Create failed");

        messageBox.innerHTML = `
          <div class="alert alert-success">
            <i class="fas fa-check-circle me-2"></i>Profile created successfully!
          </div>`;
          
        // Reload the page to get the new lawyer ID
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
      } catch (err) {
        messageBox.innerHTML = `
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>Error: ${err.message}
          </div>`;
      }
    });

    // Update
    document.getElementById("updateBtn").addEventListener("click", async () => {
      const token = getCookie("lawyerToken");
      if (!token) {
        window.location.href = "/login.html";
        return;
      }
      
      if (!lawyerId) {
        document.getElementById('message').innerHTML = `
          <div class="alert alert-warning">
            <i class="fas fa-exclamation-triangle me-2"></i>No profile to update. Please create one first.
          </div>`;
        return;
      }

      const lawyerData = buildLawyerData();
      const messageBox = document.getElementById('message');
      messageBox.innerHTML = `
        <div class="alert alert-info">
          <i class="fas fa-spinner fa-spin me-2"></i>Updating profile...
        </div>`;

      try {
        if (!token) {
          window.location.href = "/login.html";
          return;
        }
        const res = await fetch(`http://localhost:8080/api/lawyer/${lawyerId}/update`, {
          method: "PUT",
          headers: { 
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify(lawyerData)
        });

        if (!res.ok) throw new Error("Update failed");

        messageBox.innerHTML = `
          <div class="alert alert-success">
            <i class="fas fa-check-circle me-2"></i>Profile updated successfully!
          </div>`;
      } catch (err) {
        messageBox.innerHTML = `
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>Error: ${err.message}
          </div>`;
      }
    });