/**
 * Travel Agency Website - Complete JavaScript File
 * Contains all functionality for:
 * - Navigation
 * - Forms (Login, Registration, Booking, Contact)
 * - Search
 * - Video controls
 * - Swiper sliders
 * - Database interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // DOM Element References
    // ======================
    const elements = {
        // Navigation
        menuBar: document.querySelector('#menu-bar'),
        navbar: document.querySelector('.navbar'),
        searchBtn: document.querySelector('#search-btn'),
        searchBarContainer: document.querySelector('.search-bar-container'),
        searchInput: document.querySelector('#search-bar'),
        searchMessage: document.querySelector('#search-message'),
        
        // Forms
        loginBtn: document.querySelector('#login-btn'),
        loginForm: document.querySelector('.login-form-container'),
        formClose: document.querySelector('#form-close'),
        roleSelection: document.querySelector('#role-selection'),
        userRegister: document.querySelector('#user-register'),
        adminBtn: document.querySelector('#admin-btn'),
        userBtn: document.querySelector('#user-btn'),
        registerForm: document.querySelector('#register-form'),
        registerMessage: document.querySelector('#register-message'),
        registerClose: document.getElementById('register-close'),
        roleClose: document.getElementById('role-close'),
        bookingForm: document.getElementById('booking-form'),
        contactForm: document.getElementById('contact-form'),
        
        // Video
        videoBtns: document.querySelectorAll('.vid-btn'),
        videoSlider: document.querySelector('#video-slider'),
        
        // Booking confirmation
        confirmationArea: document.getElementById('confirmation-area'),
        confirmationMessage: document.getElementById('confirmation-message'),
        downloadTicket: document.getElementById('download-ticket'),
        
        // Contact message
        contactMessage: document.getElementById('contact-message')
    };

    // =============
    // Initializers
    // =============
    function initSwipers() {
        // Review Slider
        if (document.querySelector(".review-slider")) {
            new Swiper(".review-slider", {
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                },
                breakpoints: {
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                },
            });
        }

        // Brand Slider
        if (document.querySelector(".brand-slider")) {
            new Swiper(".brand-slider", {
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                },
                breakpoints: {
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                },
            });
        }
    }

    // =============
    // Event Handlers
    // =============
    function setupEventListeners() {
        // Navigation
        if (elements.menuBar) elements.menuBar.addEventListener('click', toggleMenu);
        if (elements.searchBtn) elements.searchBtn.addEventListener('click', toggleSearch);
        window.addEventListener('scroll', handleScroll);

        // Forms
        if (elements.loginBtn) elements.loginBtn.addEventListener('click', showRoleSelection);
        if (elements.formClose) elements.formClose.addEventListener('click', closeLoginForm);
        if (elements.userBtn) elements.userBtn.addEventListener('click', showUserRegister);
        if (elements.registerClose) elements.registerClose.addEventListener('click', closeRegisterForm);
        if (elements.roleClose) elements.roleClose.addEventListener('click', closeRoleSelection);
        
        // Form Submissions
        if (elements.registerForm) elements.registerForm.addEventListener('submit', handleRegister);
        if (elements.bookingForm) elements.bookingForm.addEventListener('submit', handleBooking);
        if (elements.contactForm) elements.contactForm.addEventListener('submit', handleContact);
        if (elements.searchInput) elements.searchInput.addEventListener('keyup', handleSearch);
        
        // Video Controls
        if (elements.videoBtns) {
            elements.videoBtns.forEach(btn => {
                btn.addEventListener('click', switchVideo);
            });
        }
        
        // Ticket Download
        if (elements.downloadTicket) {
            elements.downloadTicket.addEventListener('click', generateTicket);
        }
        
        // Package booking buttons
        document.querySelectorAll('.book-now').forEach(btn => {
            btn.addEventListener('click', function() {
                const destination = this.getAttribute('data-destination');
                if (destination && elements.bookingForm) {
                    document.getElementById('destination').value = destination;
                    document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ==================
    // Navigation Functions
    // ==================
    function toggleMenu() {
        elements.menuBar.classList.toggle('fa-times');
        elements.navbar.classList.toggle('active');
    }

    function toggleSearch() {
        elements.searchBtn.classList.toggle('fa-times');
        elements.searchBarContainer.classList.toggle('active');
        if (elements.searchBarContainer.classList.contains('active')) {
            elements.searchInput.focus();
        }
    }

    function handleScroll() {
        if (elements.searchBtn) elements.searchBtn.classList.remove('fa-times');
        if (elements.searchBarContainer) elements.searchBarContainer.classList.remove('active');
        if (elements.menuBar) elements.menuBar.classList.remove('fa-times');
        if (elements.navbar) elements.navbar.classList.remove('active');
        if (elements.loginForm) elements.loginForm.classList.remove('active');
        if (elements.roleSelection) elements.roleSelection.classList.remove('active');
        if (elements.userRegister) elements.userRegister.classList.remove('active');
    }

    // ==================
    // Form Functions
    // ==================
    function showRoleSelection() {
        if (elements.roleSelection) {
            elements.roleSelection.classList.add('active');
        } else if (elements.loginForm) {
            elements.loginForm.classList.add('active');
        }
    }

    function closeLoginForm() {
        if (elements.loginForm) elements.loginForm.classList.remove('active');
        if (elements.roleSelection) elements.roleSelection.classList.remove('active');
        if (elements.userRegister) elements.userRegister.classList.remove('active');
    }

    function showUserRegister() {
        if (elements.roleSelection && elements.userRegister) {
            elements.roleSelection.classList.remove('active');
            elements.userRegister.classList.add('active');
        }
    }

    function closeRegisterForm() {
        if (elements.userRegister) elements.userRegister.classList.remove('active');
    }

    function closeRoleSelection() {
        if (elements.roleSelection) elements.roleSelection.classList.remove('active');
    }

    // ==================
    // Form Submission Handlers
    // ==================
    async function handleRegister(e) {
        e.preventDefault();

        const formData = new FormData(elements.registerForm);
        const messageElement = elements.registerMessage;
        
        try {
            const response = await fetch('register.php', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                messageElement.style.color = "green";
                messageElement.textContent = data.message;
                elements.registerForm.reset();
                setTimeout(() => {
                    if (elements.userRegister) elements.userRegister.classList.remove('active');
                    if (elements.loginForm) elements.loginForm.classList.add('active');
                }, 1500);
            } else {
                messageElement.style.color = "red";
                messageElement.textContent = data.message;
            }
        } catch (error) {
            console.error('Registration error:', error);
            messageElement.style.color = "red";
            messageElement.textContent = "⚠️ Server connection error!";
        }
    }

    async function handleBooking(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById("name").value.trim(),
            guests: document.getElementById("guests").value.trim(),
            destination: document.getElementById("destination").value.trim(),
            payment: document.getElementById("payment").value.trim(),
            leaving: document.getElementById("leaving").value.trim()
        };

        // Validation
        if (!formData.name || !formData.guests || !formData.destination || !formData.payment || !formData.leaving) {
            alert("Please fill out all required fields.");
            return;
        }

        try {
            const response = await fetch('booking.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Show confirmation
                if (elements.confirmationArea) elements.confirmationArea.style.display = "block";
                
                // Store booking info for ticket generation
                window.latestBooking = {
                    name: data.name,
                    guests: data.guests,
                    destination: data.destination,
                    leaving: data.leaving,
                    booking_id: data.booking_id
                };
                
                // Reset form
                elements.bookingForm.reset();
            } else {
                alert(data.message || 'Booking failed');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Booking failed. Please try again.');
        }
    }

   async function handleContact(e) {
    e.preventDefault();
    const messageElement = document.getElementById('contact-message');
    messageElement.textContent = '';
    
    const formData = {
        name: document.querySelector('[name="name"]').value.trim(),
        email: document.querySelector('[name="email"]').value.trim(),
        phone: document.querySelector('[name="phone"]').value.trim(),
        subject: document.querySelector('[name="subject"]').value.trim(),
        message: document.querySelector('[name="message"]').value.trim()
    };

    try {
        console.log('Submitting:', formData); // Debug
        
        const response = await fetch('contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // First check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Server returned: ${text.substring(0, 100)}...`);
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Server error');
        }

        if (data.success) {
            messageElement.style.color = 'green';
            messageElement.textContent = data.message;
            e.target.reset();
        } else {
            throw new Error(data.message || 'Submission failed');
        }
    } catch (error) {
        console.error('Submission error:', error);
        messageElement.style.color = 'red';
        messageElement.textContent = error.message.includes('<') 
            ? 'Server configuration error' 
            : error.message;
    }
}

    // ==================
    // Search Functionality
    // ==================
    function handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            if (elements.searchMessage) elements.searchMessage.textContent = '';
            return;
        }
        
        const sections = document.querySelectorAll('section');
        let found = false;

        sections.forEach(sec => {
            const id = sec.getAttribute('id');
            if (id && id.toLowerCase().includes(query)) {
                found = true;
                if (elements.searchMessage) elements.searchMessage.textContent = '';
                sec.scrollIntoView({ behavior: 'smooth' });
            }
        });

        if (!found && elements.searchMessage) {
            elements.searchMessage.textContent = 'No results found';
        }
    }

    // ==================
    // Video Controls
    // ==================
    function switchVideo() {
        document.querySelector('.controls .active').classList.remove('active');
        this.classList.add('active');
        const src = this.getAttribute('data-src');
        elements.videoSlider.src = src;
    }

    // ==================
    // Ticket Generation
    // ==================
    async function generateTicket() {
        if (!window.latestBooking) {
            alert("No booking data found!");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        try {
            // Create QR code
            const qrCanvas = document.createElement("canvas");
            await QRCode.toCanvas(qrCanvas, `https://your-travel-website.com/booking/${window.latestBooking.booking_id}`, { 
                width: 100 
            });
            const qrImg = qrCanvas.toDataURL("image/png");

            // Sky Blue background
            doc.setFillColor(173, 216, 230);
            doc.rect(0, 0, 210, 297, 'F');

            // Title
            doc.setTextColor(0, 0, 128);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.text("Travel Booking Ticket", 55, 30);

            // Booking Info
            doc.setFontSize(14);
            doc.text(`Booking ID: ${window.latestBooking.booking_id}`, 20, 50);
            doc.text(`Name: ${window.latestBooking.name}`, 20, 60);
            doc.text(`Guests: ${window.latestBooking.guests}`, 20, 70);
            doc.text(`Destination: ${window.latestBooking.destination}`, 20, 80);
            doc.text(`Leaving Date: ${window.latestBooking.leaving}`, 20, 90);

            // QR Code
            doc.addImage(qrImg, "PNG", 145, 60, 40, 40);

            // Footer
            doc.setFontSize(16);
            doc.setTextColor(0, 102, 0);
            doc.text("Thank You For Trusting Us", 55, 150);

            // Save PDF
            doc.save(`booking_${window.latestBooking.booking_id}.pdf`);
        } catch (error) {
            console.error('Ticket generation error:', error);
            alert('Failed to generate ticket. Please try again.');
        }
    }

    // ==================
    // Initialize Everything
    // ==================
    function init() {
        setupEventListeners();
        initSwipers();
    }

    init();
});