// Custom JavaScript for Hope Foundation NGO Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCounterAnimation();
    initFormHandlers();
    initSmoothScrolling();
    initNavbarScroll();
    initDonationForm();
    initVolunteerForm();
    initContactForm();
    initNewsletterForm();
});

// Counter Animation for Impact Metrics
function initCounterAnimation() {
    const counters = document.querySelectorAll('.metric-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Form Handlers
function initFormHandlers() {
    // Add loading states and validation to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Add loading state
    submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Processing...';
    submitBtn.disabled = true;
    
    // Simulate form processing
    setTimeout(() => {
        showNotification('Thank you! Your submission has been received.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Hide custom amount field if donation form
        const customAmountDiv = document.getElementById('customAmountDiv');
        if (customAmountDiv) {
            customAmountDiv.style.display = 'none';
        }
    }, 2000);
}

// Donation Form Specific Handlers
function initDonationForm() {
    const amountRadios = document.querySelectorAll('input[name="amount"]');
    const customAmountDiv = document.getElementById('customAmountDiv');
    const customAmountInput = document.getElementById('customAmount');

    amountRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'other') {
                customAmountDiv.style.display = 'block';
                customAmountInput.focus();
                customAmountInput.required = true;
            } else {
                customAmountDiv.style.display = 'none';
                customAmountInput.required = false;
                customAmountInput.value = '';
            }
        });
    });

    // Add donation amount validation
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            const selectedAmount = document.querySelector('input[name="amount"]:checked');
            if (!selectedAmount) {
                e.preventDefault();
                showNotification('Please select a donation amount.', 'error');
                return;
            }
            
            if (selectedAmount.value === 'other') {
                const customAmount = parseFloat(customAmountInput.value);
                if (!customAmount || customAmount < 1) {
                    e.preventDefault();
                    showNotification('Please enter a valid donation amount.', 'error');
                    return;
                }
            }
        });
    }
}

// Volunteer Form Handlers
function initVolunteerForm() {
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        // Add character count for text areas
        const textareas = volunteerForm.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            const maxLength = textarea.getAttribute('maxlength') || 500;
            const counter = document.createElement('small');
            counter.className = 'text-muted';
            counter.textContent = `0/${maxLength} characters`;
            textarea.parentNode.appendChild(counter);
            
            textarea.addEventListener('input', function() {
                const length = this.value.length;
                counter.textContent = `${length}/${maxLength} characters`;
                
                if (length > maxLength * 0.9) {
                    counter.classList.add('text-warning');
                } else {
                    counter.classList.remove('text-warning');
                }
            });
        });
    }
}

// Contact Form Handlers
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
}

// Newsletter Form Handler
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
}

// Field Validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('is-invalid');
    
    // Validate based on field type
    if (field.required && !value) {
        showFieldError(field, 'This field is required.');
        return false;
    }
    
    if (field.type === 'email' && value && !validateEmail(value)) {
        showFieldError(field, 'Please enter a valid email address.');
        return false;
    }
    
    if (field.type === 'tel' && value && !validatePhone(value)) {
        showFieldError(field, 'Please enter a valid phone number.');
        return false;
    }
    
    return true;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('is-invalid');
    const errorMsg = field.parentNode.querySelector('.invalid-feedback');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Utility Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${getNotificationIcon(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle-fill',
        error: 'exclamation-triangle-fill',
        warning: 'exclamation-triangle-fill',
        info: 'info-circle-fill'
    };
    return icons[type] || icons.info;
}

// Intersection Observer for Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations
initScrollAnimations();

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    .navbar-scrolled {
        background-color: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .fade-in.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .slide-in-left {
        opacity: 0;
        transform: translateX(-50px);
        transition: all 0.6s ease;
    }
    
    .slide-in-left.animate {
        opacity: 1;
        transform: translateX(0);
    }
    
    .slide-in-right {
        opacity: 0;
        transform: translateX(50px);
        transition: all 0.6s ease;
    }
    
    .slide-in-right.animate {
        opacity: 1;
        transform: translateX(0);
    }
    
    .custom-notification {
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if there are lazy images
if (document.querySelectorAll('img[data-src]').length > 0) {
    initLazyLoading();
}

// Accessibility Enhancements
function initAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only sr-only-focusable';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 10000;
        color: white;
        background: #000;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
    `;
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for modals and dropdowns
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or dropdowns
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) modalInstance.hide();
            });
        }
    });
}

// Initialize accessibility features
initAccessibility();

// Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page Load Performance:', {
                    loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                    domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                    totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
                });
            }
        }, 0);
    });
}

// Initialize performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    initPerformanceMonitoring();
}
