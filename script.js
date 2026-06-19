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

   
    function showToast(message, isError) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className   = 'toast' + (isError ? ' error' : '');
        void toast.offsetWidth;
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 4500);
    }

    function isValidEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    function validateField(field, condition) {
        if (!condition) { field.classList.add('invalid'); return false; }
        field.classList.remove('invalid');
        return true;
    }

   
    const PRODUCTS = [
        {
            id: 'drums',
            name: 'Plastic Drums',
            category: 'storage',
            img: 'asset/Drums.jpeg',
            desc: 'Durable 210L open and tight-head plastic drums for industrial storage.'
        },
        {
            id: 'chemicals',
            name: 'Chemical Toilets',
            category: 'sanitation',
            img: 'asset/chemicals.avif',
            desc: 'Portable flushing units and high-quality sanitation chemicals.'
        },
        {
            id: 'transport',
            name: 'Transport Hire',
            category: 'logistics',
            img: 'asset/delivery truck.jpg',
            desc: 'Reliable logistics and delivery services for heavy industrial goods.'
        },
        {
            id: 'containers',
            name: 'Containers 20/25L',
            category: 'storage',
            img: 'asset/containers.jpg',
            desc: 'Industrial grade containers for various liquid storage needs.'
        },
        {
            id: 'beds',
            name: 'Galvanized Beds',
            category: 'furniture',
            img: 'asset/galvanized bed.jpg',
            desc: 'Strong, rust-resistant galvanized bed frames in King and Queen sizes.'
        }
    ];


    const searchInput   = document.getElementById('logistic-search');
    const searchResults = document.getElementById('search-results');

    if (searchInput && searchResults) {
        const homeIndex = PRODUCTS.map(function (p) {
            return { name: p.name, desc: p.desc, link: 'products.html' };
        }).concat([
            { name: 'Bulk Orders', desc: 'Request a custom bulk quotation', link: 'enquiry.html' },
            { name: 'Delivery',    desc: 'We deliver across Limpopo & beyond', link: 'contact.html' }
        ]);

        searchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            searchResults.innerHTML = '';

            if (query.length < 2) { searchResults.style.display = 'none'; return; }

            const matches = homeIndex.filter(function (item) {
                return item.name.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
            });

            if (matches.length === 0) {
                searchResults.innerHTML = '<div class="search-result-item" style="color:#94a3b8;">No results found.</div>';
            } else {
                matches.forEach(function (item) {
                    const div = document.createElement('div');
                    div.className = 'search-result-item';
                    div.innerHTML = '<strong>' + item.name + '</strong> &mdash; ' + item.desc;
                    div.addEventListener('click', function () { window.location.href = item.link; });
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
            if (e.key === 'Escape') { searchResults.style.display = 'none'; this.blur(); }
        });
    }

    /* --------------------------------------------------------
       6. PRODUCTS PAGE — dynamic render + search + filter
          + lightbox gallery (products.html)
    -------------------------------------------------------- */
    const productsGrid = document.getElementById('productsGrid');

    if (productsGrid) {
        const productSearch = document.getElementById('productSearch');
        const filterChips    = document.querySelectorAll('#filterChips .chip');
        const resultsCount   = document.getElementById('resultsCount');
        const noResults      = document.getElementById('noResults');

        let activeFilter = 'all';
        let activeQuery  = '';
        let visibleList  = PRODUCTS.slice(); // current filtered set, for lightbox nav

        function renderProducts() {
            const query = activeQuery.trim().toLowerCase();

            visibleList = PRODUCTS.filter(function (p) {
                const matchesFilter = activeFilter === 'all' || p.category === activeFilter;
                const matchesQuery  = query === '' ||
                    p.name.toLowerCase().includes(query) ||
                    p.desc.toLowerCase().includes(query) ||
                    p.category.toLowerCase().includes(query);
                return matchesFilter && matchesQuery;
            });

            productsGrid.innerHTML = '';

            if (visibleList.length === 0) {
                noResults.style.display = 'block';
                resultsCount.textContent = '';
            } else {
                noResults.style.display = 'none';
                resultsCount.textContent = visibleList.length + (visibleList.length === 1 ? ' product found' : ' products found');

                visibleList.forEach(function (product, index) {
                    const card = document.createElement('div');
                    card.className = 'service-card reveal';
                    card.style.transitionDelay = (index * 60) + 'ms';
                    card.innerHTML =
                        '<div class="card-image" data-product-id="' + product.id + '">' +
                            '<img src="' + product.img + '" alt="' + product.name + '">' +
                        '</div>' +
                        '<div class="card-body">' +
                            '<h4>' + product.name + '</h4>' +
                            '<p>' + product.desc + '</p>' +
                        '</div>';
                    productsGrid.appendChild(card);

                    // trigger reveal animation on next frame
                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () { card.classList.add('in-view'); });
                    });
                });

                // Wire up lightbox triggers on the freshly rendered images
                productsGrid.querySelectorAll('.card-image').forEach(function (el) {
                    el.addEventListener('click', function () {
                        const id = el.getAttribute('data-product-id');
                        const idx = visibleList.findIndex(function (p) { return p.id === id; });
                        if (idx !== -1) openLightbox(idx);
                    });
                });
            }
        }

        if (productSearch) {
            productSearch.addEventListener('input', function () {
                activeQuery = this.value;
                renderProducts();
            });
        }

        filterChips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                filterChips.forEach(function (c) { c.classList.remove('active'); });
                this.classList.add('active');
                activeFilter = this.getAttribute('data-filter');
                renderProducts();
            });
        });

        renderProducts();

        /* ---- LIGHTBOX ---- */
        const lightboxOverlay = document.getElementById('lightboxOverlay');
        const lightboxImage   = document.getElementById('lightboxImage');
        const lightboxTitle   = document.getElementById('lightboxTitle');
        const lightboxDesc    = document.getElementById('lightboxDesc');
        const lightboxClose   = document.getElementById('lightboxClose');
        const lightboxPrev    = document.getElementById('lightboxPrev');
        const lightboxNext    = document.getElementById('lightboxNext');

        let currentLightboxIndex = 0;

        function openLightbox(index) {
            currentLightboxIndex = index;
            updateLightbox();
            lightboxOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function updateLightbox() {
            const product = visibleList[currentLightboxIndex];
            if (!product) return;
            lightboxImage.src = product.img;
            lightboxImage.alt = product.name;
            lightboxTitle.textContent = product.name;
            lightboxDesc.textContent  = product.desc;
        }

        function closeLightbox() {
            lightboxOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        function showPrev() {
            currentLightboxIndex = (currentLightboxIndex - 1 + visibleList.length) % visibleList.length;
            updateLightbox();
        }

        function showNext() {
            currentLightboxIndex = (currentLightboxIndex + 1) % visibleList.length;
            updateLightbox();
        }

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev)  lightboxPrev.addEventListener('click', showPrev);
        if (lightboxNext)  lightboxNext.addEventListener('click', showNext);

        if (lightboxOverlay) {
            lightboxOverlay.addEventListener('click', function (e) {
                if (e.target === lightboxOverlay) closeLightbox();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (!lightboxOverlay || !lightboxOverlay.classList.contains('open')) return;
            if (e.key === 'Escape')      closeLightbox();
            if (e.key === 'ArrowLeft')   showPrev();
            if (e.key === 'ArrowRight')  showNext();
        });
    }

    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels  = document.querySelectorAll('.tab-panel');

    if (tabButtons.length && tabPanels.length) {
        tabButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const target = this.getAttribute('data-tab');

                tabButtons.forEach(function (b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');

                tabPanels.forEach(function (panel) {
                    panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
                });
            });
        });
    }


    const accordionHeaders = document.querySelectorAll('.accordion-header');

    if (accordionHeaders.length) {
        accordionHeaders.forEach(function (header) {
            const panel = header.nextElementSibling;

            header.addEventListener('click', function () {
                const isOpen = header.getAttribute('aria-expanded') === 'true';

                // Close all other panels (single-open accordion)
                accordionHeaders.forEach(function (h) {
                    if (h !== header) {
                        h.setAttribute('aria-expanded', 'false');
                        h.nextElementSibling.style.maxHeight = null;
                        h.nextElementSibling.style.paddingBottom = '0px';
                    }
                });

                if (isOpen) {
                    header.setAttribute('aria-expanded', 'false');
                    panel.style.maxHeight = null;
                } else {
                    header.setAttribute('aria-expanded', 'true');
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                }
            });
        });
    }

    
    const enquiryForm = document.getElementById('enquiryForm');
    const enquiryModal = document.getElementById('enquiryModal');

    function openModal(waLink) {
        if (!enquiryModal) return;
        const link = document.getElementById('modalWhatsappLink');
        if (link) link.href = waLink;
        enquiryModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!enquiryModal) return;
        enquiryModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (enquiryModal) {
        const modalClose     = document.getElementById('modalClose');
        const modalCloseBtn2 = document.getElementById('modalCloseSecondary');
        const waLinkBtn      = document.getElementById('modalWhatsappLink');

        if (modalClose)     modalClose.addEventListener('click', closeModal);
        if (modalCloseBtn2) modalCloseBtn2.addEventListener('click', closeModal);
        if (waLinkBtn)      waLinkBtn.addEventListener('click', closeModal);

        enquiryModal.addEventListener('click', function (e) {
            if (e.target === enquiryModal) closeModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && enquiryModal.classList.contains('open')) closeModal();
        });
    }

    if (enquiryForm) {
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

            if (email.value.trim() !== '') check(email, isValidEmail(email.value));

            if (!valid) {
                if (firstInvalid) firstInvalid.focus();
                showToast('Please fill in all required fields correctly.', true);
                return;
            }

            const fullName = firstName.value.trim() + ' ' + lastName.value.trim();
            const waNumber = '27839267769';
            const waText   = encodeURIComponent(
                'Hello Tau Logistics!\n\n' +
                'Name: '    + fullName           + '\n' +
                'Phone: '   + phone.value.trim() + '\n' +
                (email.value.trim() ? 'Email: ' + email.value.trim() + '\n' : '') +
                'Product: ' + product.value      + '\n\n' +
                'Message:\n' + message.value.trim()
            );
            const waLink = 'https://wa.me/' + waNumber + '?text=' + waText;

            const submitBtn = enquiryForm.querySelector('.btn-submit');
            if (submitBtn) { submitBtn.textContent = 'Sending...'; submitBtn.disabled = true; }

            setTimeout(function () {
                enquiryForm.reset();
                if (submitBtn) { submitBtn.innerHTML = '&#128229; Submit Enquiry'; submitBtn.disabled = false; }
                if (enquiryModal) {
                    openModal(waLink);
                } else {
                    showToast('Enquiry ready! Redirecting to WhatsApp...', false);
                    window.open(waLink, '_blank');
                }
            }, 600);
        });
    }


    const contactForm = document.getElementById('contactForm');
    const RECIPIENT_EMAIL = 'taulogistics@gmail.com';

    if (contactForm) {
        contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
            field.addEventListener('input', function () { this.classList.remove('invalid'); });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const firstName = document.getElementById('cf_firstName');
            const lastName  = document.getElementById('cf_lastName');
            const email     = document.getElementById('cf_email');
            const phone     = document.getElementById('cf_phone');
            const msgType   = document.getElementById('cf_msgType');
            const subject   = document.getElementById('cf_subject');
            const message   = document.getElementById('cf_message');

            let valid = true;
            let firstInvalid = null;

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

            if (phone.value.trim() !== '' && phone.value.trim().length < 9) chk(phone, false);

            if (!valid) {
                if (firstInvalid) firstInvalid.focus();
                showToast('Please complete all required fields correctly.', true);
                return;
            }

            const fullName    = firstName.value.trim() + ' ' + lastName.value.trim();
            const senderEmail = email.value.trim();
            const phoneVal    = phone.value.trim() || 'Not provided';
            const msgTypeVal  = msgType.value;
            const subjectVal  = subject.value.trim();
            const messageVal  = message.value.trim();

            const emailSubject = '[' + msgTypeVal + '] ' + subjectVal + ' \u2014 from ' + fullName;

            const emailBody =
                'Hello Tau Logistics,' + '\n\n' +
                'You have received a new message via your website contact form.' + '\n' +
                '------------------------------------------------------------' + '\n\n' +
                'SENDER DETAILS' + '\n' +
                'Name:          ' + fullName    + '\n' +
                'Email:         ' + senderEmail + '\n' +
                'Phone:         ' + phoneVal    + '\n\n' +
                'MESSAGE DETAILS' + '\n' +
                'Message Type:  ' + msgTypeVal  + '\n' +
                'Subject:       ' + subjectVal  + '\n\n' +
                'MESSAGE' + '\n' +
                '------------------------------------------------------------' + '\n' +
                messageVal + '\n' +
                '------------------------------------------------------------' + '\n\n' +
                'This message was sent via the Tau Logistics website contact form.' +
                '\nPlease reply directly to: ' + senderEmail;

            const mailtoLink =
                'mailto:' + RECIPIENT_EMAIL +
                '?subject=' + encodeURIComponent(emailSubject) +
                '&body='    + encodeURIComponent(emailBody);

            const submitBtn = contactForm.querySelector('.btn-submit-contact');
            if (submitBtn) { submitBtn.textContent = 'Opening email...'; submitBtn.disabled = true; }

            setTimeout(function () {
                showToast('Email client opening \u2014 review and click Send!', false);
                window.location.href = mailtoLink;

                setTimeout(function () {
                    if (submitBtn) { submitBtn.innerHTML = '&#9993; Send Email'; submitBtn.disabled = false; }
                    contactForm.reset();
                }, 2000);
            }, 500);
        });
    }

    
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    
    const revealSelectors = [
        '.service-card', '.contact-card', '.info-card',
        '.stat-card', '.form-card', '.accordion-item',
        '.tab-panel .info-card'
    ];

    document.querySelectorAll(revealSelectors.join(',')).forEach(function (el) {
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.reveal').forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: just show everything
        document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in-view'); });
    }


    document.querySelectorAll('.service-card, .contact-card, .info-card').forEach(function (card) {
        card.addEventListener('mouseenter', function () { this.style.willChange = 'transform'; });
        card.addEventListener('mouseleave', function ()  { this.style.willChange = 'auto'; });
    });

});
