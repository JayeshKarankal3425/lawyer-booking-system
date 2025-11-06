 // Helper function to store cookies
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/; SameSite=Lax";
    }


    // Password visibility toggle
    document.getElementById("passwordToggle").addEventListener("click", function() {
        const passwordInput = document.getElementById("password");
        const icon = this.querySelector("i");
        
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            passwordInput.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    });

    // Form submission
    document.getElementById("loginForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const userData = {
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value.trim()
        };

        const messageDiv = document.getElementById("message");
        const loginBtn = document.getElementById("loginBtn");
        
        messageDiv.innerHTML = ""; // Clear previous messages
        
        // Show loading state
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging in...';

        try {
            const loginRes = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: x.stringify(userData)
            });

            if (!loginRes.ok) {
                // If login fails, throw an error
                const errorText = await loginRes.text();
                throw new Error(errorText || "Login failed. Please check your credentials.");
            }

            const responseData = await loginRes.json();
            const token = responseData.token;
            const role = responseData.role;

            if (role === "VILLAGER") {
                setCookie("villagerToken", token, 7);
            } else {
                setCookie("adminToken", token, 7);
            }

            messageDiv.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>Login successful! Redirecting...
                </div>`;
            
            setTimeout(() => {
                if (role === 'LAWYER') {
                    window.location.href = "/login.html";
                } else {
                    window.location.href = "/index.html";
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
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Login';
        }
    });