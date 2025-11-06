// Helper function to store cookies
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/; Secure; SameSite=Strict";
  }

  // Password visibility toggle
  function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    
    toggle.addEventListener("click", function() {
      const icon = this.querySelector("i");
      
      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  }

  // Setup password toggles
  setupPasswordToggle("passwordToggle", "password");
  setupPasswordToggle("confirmPasswordToggle", "confirmPassword");

  // Form submission
  document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
    
    if (password !== confirm) {
      document.getElementById("message").innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>Passwords do not match
        </div>`;
      return;
    }

    const userData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      contactNo: document.getElementById("contactNo").value,
      age: document.getElementById("age").value,
      password: password,
      role: document.getElementById("role").value
    };

    const messageDiv = document.getElementById("message");
    const registerBtn = document.getElementById("registerBtn");
    
    messageDiv.innerHTML = ""; // Clear previous messages
    
    // Show loading state
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating Account...';

    try {
      const registerRes = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const responseData = await registerRes.json();
      const token = responseData.token;
      const role = responseData.role;

      if (role === "LAWYER") {
        setCookie("lawyerToken", token, 7);
      } else {
        setCookie("userToken", token, 7);
      }

      messageDiv.innerHTML = `
        <div class="alert alert-success">
          <i class="fas fa-check-circle me-2"></i>Registration successful! Redirecting...
        </div>`;

      setTimeout(() => {
        if (role === 'LAWYER') {
          window.location.href = "lawyer-home.html";
        } else {
          window.location.href = "Home.html";
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      messageDiv.innerHTML = `
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>${err.message}
        </div>`;
    } finally {
      // Reset button state
      registerBtn.disabled = false;
      registerBtn.innerHTML = '<i class="fas fa-user-plus me-2"></i>Create Account';
    }
  });