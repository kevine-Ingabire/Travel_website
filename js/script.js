// Update the registration form handler
if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let name = document.querySelector('#reg-name').value.trim();
        let email = document.querySelector('#reg-email').value.trim();
        let password = document.querySelector('#reg-password').value.trim();
        let country = document.querySelector('#reg-country').value;

        if (name === "" || email === "" || password === "" || country === "") {
            registerMessage.style.color = "red";
            registerMessage.textContent = "All fields are required!";
            return;
        }

        fetch('register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&country=${encodeURIComponent(country)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                registerMessage.style.color = "green";
                registerMessage.textContent = "✅ Registration successful!";
                registerForm.reset();
                setTimeout(() => {
                    userRegister.classList.remove('active');
                    loginForm.classList.add('active');
                }, 1500);
            } else {
                registerMessage.style.color = "red";
                registerMessage.textContent = data.error || "Registration failed";
            }
        })
        .catch(() => {
            registerMessage.style.color = "red";
            registerMessage.textContent = "⚠️ Server connection error!";
        });
    });
}

// Update the login form handler
const loginForm = document.querySelector('.login-form-container form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        fetch('login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Close login form
                loginForm.classList.remove('active');
                
                // Update UI based on user role
                if (data.role === 'admin') {
                    // Redirect to admin dashboard or show admin features
                    window.location.href = 'admin.php';
                } else {
                    // Show user greeting
                    alert(`Welcome back, ${data.name}!`);
                }
            } else {
                alert(data.error || 'Login failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        });
    });
}

// Update the booking form handler
const bookingForm = document.getElementById("booking-form");
if (bookingForm) {
    bookingForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const formData = new FormData(bookingForm);
        
        fetch('booking.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show confirmation
                document.getElementById("confirmation-message").style.display = "block";
                document.getElementById("download-ticket").style.display = "inline-block";
                
                // Store booking info for ticket generation
                window.latestBooking = {
                    name: data.name,
                    destination: data.destination,
                    leaving: data.leaving,
                    booking_id: data.booking_id
                };
                
                // Reset form
                bookingForm.reset();
            } else {
                alert(data.error || 'Booking failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Booking failed. Please try again.');
        });
    });
}

// Update the contact form handler
const contactForm = document.querySelector('.contact form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        fetch('contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                alert(data.error || 'Message submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Message submission failed. Please try again.');
        });
    });
}