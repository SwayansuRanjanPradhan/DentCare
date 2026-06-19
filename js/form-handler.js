/**
 * Form Handler for Image Diagnostics
 * Uses FormSubmit.co to send form data to info@imagediagnostics.in
 * Works with static HTML — no backend required.
 */

(function () {
    'use strict';

    const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/info@imagediagnostics.in';

    // Toast notification element (injected once)
    function createToast() {
        if (document.getElementById('form-toast')) return;
        const toast = document.createElement('div');
        toast.id = 'form-toast';
        toast.innerHTML = `
            <div class="form-toast-content">
                <i class="form-toast-icon"></i>
                <span class="form-toast-message"></span>
            </div>
        `;
        document.body.appendChild(toast);

        // Inject styles
        const style = document.createElement('style');
        style.textContent = `
            #form-toast {
                position: fixed;
                top: 30px;
                right: 30px;
                z-index: 99999;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                pointer-events: none;
            }
            #form-toast.show {
                opacity: 1;
                transform: translateX(0);
                pointer-events: auto;
            }
            .form-toast-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                font-family: 'Open Sans', sans-serif;
                font-size: 15px;
                font-weight: 600;
                min-width: 300px;
                max-width: 450px;
            }
            #form-toast.success .form-toast-content {
                background: linear-gradient(135deg, #00b09b, #96c93d);
                color: #fff;
            }
            #form-toast.error .form-toast-content {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: #fff;
            }
            .form-toast-icon {
                font-size: 22px;
                flex-shrink: 0;
            }
            /* Button loading state */
            .btn-loading {
                position: relative;
                pointer-events: none;
                opacity: 0.85;
            }
            .btn-loading::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                top: 50%;
                left: 50%;
                margin-left: -10px;
                margin-top: -10px;
                border: 3px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: btn-spin 0.7s linear infinite;
            }
            @keyframes btn-spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    function showToast(type, message) {
        createToast();
        const toast = document.getElementById('form-toast');
        const icon = toast.querySelector('.form-toast-icon');
        const msg = toast.querySelector('.form-toast-message');

        toast.className = type + ' show';
        icon.className = 'form-toast-icon fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle');
        msg.textContent = message;

        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(function () {
            toast.classList.remove('show');
        }, 5000);
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Attach handler to all forms with data-formsubmit attribute
    document.addEventListener('DOMContentLoaded', function () {
        var forms = document.querySelectorAll('form[data-formsubmit]');

        forms.forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                var formData = new FormData(form);
                var data = {};
                var hasEmpty = false;

                // Validate required fields
                formData.forEach(function (value, key) {
                    if (key.startsWith('_')) return; // skip hidden fields
                    data[key] = value;
                    if (!value.trim()) hasEmpty = true;
                });

                // Check for empty fields
                if (hasEmpty) {
                    showToast('error', 'Please fill in all required fields.');
                    return;
                }

                // Validate email field if present
                if (data['Email'] && !validateEmail(data['Email'])) {
                    showToast('error', 'Please enter a valid email address.');
                    return;
                }

                // Get submit button and show loading state
                var submitBtn = form.querySelector('button[type="submit"]');
                var originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.classList.add('btn-loading');

                // Add hidden fields for FormSubmit configuration
                formData.append('_subject', data['Subject'] || form.getAttribute('data-subject') || 'New Enquiry from Image Diagnostics Website');
                formData.append('_template', 'table');

                // Send via AJAX
                fetch(FORMSUBMIT_URL, {
                    method: 'POST',
                    body: formData,
                })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (result) {
                        if (result.success) {
                            showToast('success', 'Message sent successfully! We will get back to you shortly.');
                            form.reset();
                        } else {
                            showToast('error', 'Failed to send message. Please try again or call us directly.');
                        }
                    })
                    .catch(function () {
                        showToast('error', 'Network error. Please check your connection and try again.');
                    })
                    .finally(function () {
                        submitBtn.textContent = originalText;
                        submitBtn.classList.remove('btn-loading');
                    });
            });
        });
    });
})();
