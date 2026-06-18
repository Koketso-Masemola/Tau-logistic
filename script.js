document.addEventListener('DOMContentLoaded', function () {

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks  = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.textContent = isOpen ? 'Close' : 'Menu';
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.textContent = 'Menu';
            });
        });

        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.textContent = 'Menu';
            }
        });
    }


    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        if (link.getAttribute('href') === currentPage) {
            link.closest('li').classList.add('active');
        }
    });

    const searchInput   = document.getElementById('logistic-search');
    const searchResults = document.getElementById('search-results');

    const inventory = [
        { name: 'Plastic Drums',      desc: 'Durable 210L storage drums',              link: 'products.html' },
        { name: 'Chemical Toilets',   desc: 'Portable flushing toilet units',           link: 'products.html' },
        { name: 'Flushing Chemicals', desc: 'Sanitation chemicals for portable loos',   link: 'products.html' },
        { name: 'Transport Hire',     desc: 'Reliable logistics & delivery services',   link: 'products.html' },
        { name: 'Containers 20/25L',  desc: 'Industrial grade liquid containers',       link: 'products.html' },
        { name: 'Galvanized Beds',    desc: 'King & Queen size metal bed frames',       link: 'products.html' },
        { name: 'Bulk Orders',        desc: 'Request a custom bulk quotation',          link: 'enquiry.html'  },
        { name: 'Delivery',           desc: 'We deliver across Limpopo & beyond',       link: 'contact.html'  },
    ];

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            searchResults.innerHTML = '';

            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            const matches = inventory.filter(function (item) {
                return item.name.toLowerCase().includes(query) ||
                       item.desc.toLowerCase().includes(query);
            });

            if (matches.length === 0) {
                searchResults.innerHTML = '<div class="search-result-item" style="color:#94a3b8;">No results found.</div>';
            } else {
                matches.forEach(function (item) {
                    const div = document.createElement('div');
                    div.className = 'search-result-item';
                    div.innerHTML = '<strong>' + item.name + '</strong> &mdash; ' + item.desc;
                    div.addEventListener('click', function () {
                        window.location.href = item.link;
                    });
                    searchResults.appendChild(div);
                });
            }

            searchResults.style.display = 'block';
        });

        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });

        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                searchResults.style.display = 'none';
                this.blur();
            }
        });
    }

    
    function showToast(message, isError) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className   = 'toast' + (isError ? ' error' : '');
        void toast.offsetWidth;
        toast.classList.add('show');
        setTimeout(function () {
            toast.classList.remove('show');
        }, 4500);
    }

    
    function validateField(field, condition) {
        if (!condition) {
            field.classList.add('invalid');
            return false;
        }
        field.classList.remove('invalid');
        return true;
    }

    function isValidEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    
    const enquiryForm = document.getElementById('enquiryForm');

    if (enquiryForm) {
        // Remove invalid style on user input
        enquiryForm.querySelectorAll('input, select, textarea').forEach(function (field) {
            field.addEventListener('input', function () { this.classList.remove('invalid'); });
        });

        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const firstName = document.getElementById('firstName');
            const lastName  = document.getElementById('lastName');
            const phone     = document.getElementById('phone');
            const email     = document.getElementById('email');
            const product   = document.getElementById('product');
            const message   = document.getElementById('message');

            let valid = true;
            let firstInvalid = null;

            function check(field, condition) {
                if (!validateField(field, condition)) {
                    valid = false;
                    if (!firstInvalid) firstInvalid = field;
                }
            }

            check(firstName, firstName.value.trim().length >= 2);
            check(lastName,  lastName.value.trim().length  >= 2);
            check(phone,     phone.value.trim().length     >= 9);
            check(product,   product.value !== '');
            check(message,   message.value.trim().length   >= 10);

            if (email.value.trim() !== '') {
                check(email, isValidEmail(email.value));
            }

            if (!valid) {
                if (firstInvalid) firstInvalid.focus();
                showToast('Please fill in all required fields correctly.', true);
                return;
            }

            const fullName  = firstName.value.trim() + ' ' + lastName.value.trim();
            const waNumber  = '27839267769';
            const waText    = encodeURIComponent(
                'Hello Tau Logistics!\n\n' +
                'Name: '    + fullName           + '\n' +
                'Phone: '   + phone.value.trim() + '\n' +
                (email.value.trim() ? 'Email: ' + email.value.trim() + '\n' : '') +
                'Product: ' + product.value      + '\n\n' +
                'Message:\n' + message.value.trim()
            );

            const submitBtn = enquiryForm.querySelector('.btn-submit');
            if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }

            setTimeout(function () {
                showToast('Enquiry ready! Redirecting to WhatsApp...', false);
                enquiryForm.reset();
                if (submitBtn) { submitBtn.innerHTML = '&#128229; Submit Enquiry'; submitBtn.disabled = false; }
                setTimeout(function () {
                    window.open('https://wa.me/' + waNumber + '?text=' + waText, '_blank');
                }, 900);
            }, 600);
        });
    }

    
    const contactForm = document.getElementById('contactForm');

    var RECIPIENT_EMAIL = 'taulogistics@gmail.com';
  
    if (contactForm) {
        
        contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
            field.addEventListener('input', function () { this.classList.remove('invalid'); });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var firstName = document.getElementById('cf_firstName');
            var lastName  = document.getElementById('cf_lastName');
            var email     = document.getElementById('cf_email');
            var phone     = document.getElementById('cf_phone');
            var msgType   = document.getElementById('cf_msgType');
            var subject   = document.getElementById('cf_subject');
            var message   = document.getElementById('cf_message');

            var valid       = true;
            var firstInvalid = null;

            function chk(field, condition) {
                if (!validateField(field, condition)) {
                    valid = false;
                    if (!firstInvalid) firstInvalid = field;
                }
            }

            chk(firstName, firstName.value.trim().length >= 2);
            chk(lastName,  lastName.value.trim().length  >= 2);
            chk(email,     isValidEmail(email.value));
            chk(msgType,   msgType.value !== '');
            chk(subject,   subject.value.trim().length >= 3);
            chk(message,   message.value.trim().length >= 10);

            if (phone.value.trim() !== '' && phone.value.trim().length < 9) {
                chk(phone, false);
            }

            if (!valid) {
                if (firstInvalid) firstInvalid.focus();
                showToast('Please complete all required fields correctly.', true);
                return;
            }

            /* -- Build the email -- */
            var fullName    = firstName.value.trim() + ' ' + lastName.value.trim();
            var senderEmail = email.value.trim();
            var phoneVal    = phone.value.trim() || 'Not provided';
            var msgTypeVal  = msgType.value;
            var subjectVal  = subject.value.trim();
            var messageVal  = message.value.trim();

            var emailSubject = '[' + msgTypeVal + '] ' + subjectVal + ' — from ' + fullName;

            var emailBody =
                'Hello Tau Logistics,' +
                '\n\n' +
                'You have received a new message via your website contact form.' +
                '\n' +
                '------------------------------------------------------------' +
                '\n\n' +
                'SENDER DETAILS' +
                '\n' +
                'Name:          ' + fullName    + '\n' +
                'Email:         ' + senderEmail + '\n' +
                'Phone:         ' + phoneVal    + '\n' +
                '\n' +
                'MESSAGE DETAILS' +
                '\n' +
                'Message Type:  ' + msgTypeVal  + '\n' +
                'Subject:       ' + subjectVal  + '\n' +
                '\n' +
                'MESSAGE' +
                '\n' +
                '------------------------------------------------------------' +
                '\n' +
                messageVal +
                '\n' +
                '------------------------------------------------------------' +
                '\n\n' +
                'This message was sent via the Tau Logistics website contact form.' +
                '\nPlease reply directly to: ' + senderEmail;

            var mailtoLink =
                'mailto:' + RECIPIENT_EMAIL +
                '?subject=' + encodeURIComponent(emailSubject) +
                '&body='    + encodeURIComponent(emailBody);

            /* Disable button briefly for UX feedback */
            var submitBtn = contactForm.querySelector('.btn-submit-contact');
            if (submitBtn) {
                submitBtn.textContent = 'Opening email...';
                submitBtn.disabled    = true;
            }

            setTimeout(function () {
                showToast('Email client opening — review and click Send!', false);
                
                window.location.href = mailtoLink;

    
                setTimeout(function () {
                    if (submitBtn) {
                        submitBtn.innerHTML = '&#9993; Send Email';
                        submitBtn.disabled  = false;
                    }
                    contactForm.reset();
                }, 2000);
            }, 500);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    document.querySelectorAll('.service-card, .contact-card, .info-card').forEach(function (card) {
        card.addEventListener('mouseenter', function () { this.style.willChange = 'transform'; });
        card.addEventListener('mouseleave', function ()  { this.style.willChange = 'auto'; });
    });

});