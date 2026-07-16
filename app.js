/**
 * TheDealDish Single Page Application (SPA) Engine
 * State Management, Emulated Database (localStorage), and Portal Logic
 */

class TheDealDishApp {
    constructor() {
        // Initialize Core State
        this.currentView = 'home';
        this.currentUser = null;
        this.activeCategory = 'all';
        this.timerInterval = null;

        // Initialize Emulated Database in localStorage
        this.initDatabase();

        // Bind DOM Elements
        this.initDOMElements();

        // Check active session
        this.checkSession();
        
        // Start Global Application Timers
        this.startGlobalTimers();

        // Render initial catalog
        this.renderDeals();
    }

    // -------------------------------------------------------------
    // DATABASE INITIALIZATION & SEEDING (Relational/Document Emulation)
    // -------------------------------------------------------------
    initDatabase() {
        // 1. Users Collection
        if (!localStorage.getItem('dd_users')) {
            const defaultUsers = [
                { id: 'u-1', name: 'Gupthan Vishnu Prasad', email: 'customer@thedealdish.com', passwordHash: 'customer123', role: 'customer', phone: '9876543210', district: 'Thrissur', isVerified: true },
                { id: 'u-2', name: 'Manager Taj Residency', email: 'taj@thedealdish.com', passwordHash: 'taj123', role: 'hotel', phone: '9895012345', district: 'Thrissur', isVerified: true },
                { id: 'u-3', name: 'Manager Hyatt Plaza', email: 'hyatt@thedealdish.com', passwordHash: 'hyatt123', role: 'hotel', phone: '9847055443', district: 'Ernakulam', isVerified: true },
                { id: 'u-4', name: 'Platform Chief Admin', email: 'admin@thedealdish.com', passwordHash: 'admin123', role: 'admin', phone: '9000100020', district: 'Thrissur', isVerified: true }
            ];
            localStorage.setItem('dd_users', JSON.stringify(defaultUsers));
        }

        // 2. Hotels Collection
        if (!localStorage.getItem('dd_hotels')) {
            const defaultHotels = [
                { id: 'h-1', ownerId: 'u-2', hotelName: 'The Taj Residency', address: 'Patturaikkal Jn, Thrissur', fssaiNumber: '12345678901234', closingTime: '23:30', isApproved: true, district: 'Thrissur' },
                { id: 'h-2', ownerId: 'u-3', hotelName: 'Grand Hyatt Plaza', address: 'Marine Drive, Kochi, Ernakulam', fssaiNumber: '98765432109876', closingTime: '23:00', isApproved: true, district: 'Ernakulam' }
            ];
            localStorage.setItem('dd_hotels', JSON.stringify(defaultHotels));
        }

        // 3. Food Items Collection (Active listings)
        if (!localStorage.getItem('dd_food_items')) {
            // Set dummy pickup windows around current time so they look active
            const now = new Date();
            const formatTime = (hoursAhead) => {
                const d = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);
                return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
            };

            const defaultFoodItems = [
                { id: 'f-1', hotelId: 'h-1', itemName: 'Malabar Chicken Biryani Combo', category: 'non-veg', originalPrice: 350, discountedPrice: 120, quantityAvailable: 8, pickupStart: formatTime(-1), pickupEnd: formatTime(1.5), status: 'active' },
                { id: 'f-2', hotelId: 'h-1', itemName: 'Fresh Fruit Salad Platter', category: 'veg', originalPrice: 150, discountedPrice: 50, quantityAvailable: 5, pickupStart: formatTime(-0.5), pickupEnd: formatTime(0.8), status: 'active' },
                { id: 'f-3', hotelId: 'h-2', itemName: 'Chocolate Fudge Pastry Box (4pcs)', category: 'bakery', originalPrice: 480, discountedPrice: 150, quantityAvailable: 6, pickupStart: formatTime(-2), pickupEnd: formatTime(2), status: 'active' },
                { id: 'f-4', hotelId: 'h-2', itemName: 'Assorted Dinner Rolls (12pcs)', category: 'bakery', originalPrice: 180, discountedPrice: 60, quantityAvailable: 4, pickupStart: formatTime(-1.5), pickupEnd: formatTime(1.2), status: 'active' },
                { id: 'f-5', hotelId: 'h-1', itemName: 'Paneer Butter Masala & Naan', category: 'veg', originalPrice: 280, discountedPrice: 90, quantityAvailable: 7, pickupStart: formatTime(-0.8), pickupEnd: formatTime(1.8), status: 'active' },
                { id: 'f-6', hotelId: 'h-2', itemName: 'Cold Brew Latte (500ml)', category: 'beverage', originalPrice: 160, discountedPrice: 50, quantityAvailable: 10, pickupStart: formatTime(-1.2), pickupEnd: formatTime(2.5), status: 'active' }
            ];
            localStorage.setItem('dd_food_items', JSON.stringify(defaultFoodItems));
        }

        // 4. Reservations Collection
        if (!localStorage.getItem('dd_reservations')) {
            const defaultReservations = [
                { id: 'r-101', customerId: 'u-1', foodItemId: 'f-1', quantity: 2, totalPrice: 240, reservationTime: new Date(Date.now() - 3600000).toISOString(), pickupStatus: 'completed' },
                { id: 'r-102', customerId: 'u-1', foodItemId: 'f-3', quantity: 1, totalPrice: 150, reservationTime: new Date(Date.now() - 1800000).toISOString(), pickupStatus: 'pending' }
            ];
            localStorage.setItem('dd_reservations', JSON.stringify(defaultReservations));
        }
        
        // Populate Hero Image with SVG fallback on error
        setTimeout(() => {
            const heroImg = document.getElementById('hero-illustration');
            if (heroImg) {
                heroImg.addEventListener('error', () => {
                    heroImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2312422c"/><stop offset="100%" stop-color="%232c704c"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g)"/><circle cx="150" cy="180" r="100" fill="%2322623d" opacity="0.6"/><circle cx="450" cy="220" r="140" fill="%232c784e" opacity="0.4"/><path d="M 100 250 Q 250 150 400 280 T 550 220" fill="none" stroke="%233ab36c" stroke-width="4" opacity="0.3"/><text x="50" y="80" fill="%23fff" font-family="'Outfit', sans-serif" font-weight="800" font-size="32">TheDealDish Ecosystem</text><text x="50" y="120" fill="%233ab36c" font-family="'Inter', sans-serif" font-weight="600" font-size="18">A Sustainable surplus marketplace</text><circle cx="300" cy="200" r="60" fill="%23fff" opacity="0.1"/><circle cx="300" cy="200" r="50" fill="%233ab36c" opacity="0.2"/><path d="M 275 190 L 295 210 L 325 180" fill="none" stroke="%23fff" stroke-width="6" stroke-linecap="round"/></svg>`;
                });
                // Force check if it failed before binding (only if it has completed loading)
                if (heroImg.complete && heroImg.naturalWidth === 0) {
                    heroImg.dispatchEvent(new Event('error'));
                }
            }
        }, 100);
    }

    // -------------------------------------------------------------
    // DOM CACHING & SETUP
    // -------------------------------------------------------------
    initDOMElements() {
        this.views = {
            home: document.getElementById('view-home'),
            explore: document.getElementById('view-explore'),
            hotel: document.getElementById('view-hotel'),
            admin: document.getElementById('view-admin')
        };

        this.navLinks = document.querySelectorAll('.nav-link');
        this.btnLoginTrigger = document.getElementById('btn-login-trigger');
        this.userProfileBadge = document.getElementById('user-profile-badge');
        this.userRoleLabel = document.getElementById('user-role-label');
        this.userNameLabel = document.getElementById('user-name-label');

        // Modals
        this.authModal = document.getElementById('auth-modal');
        this.reservationModal = document.getElementById('reservation-modal');
        this.legalModal = document.getElementById('legal-modal');

        // Navigation
        this.navLinkAdmin = document.getElementById('nav-link-admin');

        // Forms
        this.formLogin = document.getElementById('form-login');
        this.formSignup = document.getElementById('form-signup');
        this.authTabLogin = document.getElementById('auth-tab-login');
        this.authTabSignup = document.getElementById('auth-tab-signup');
    }

    // -------------------------------------------------------------
    // SESSION MANAGEMENT
    // -------------------------------------------------------------
    checkSession() {
        const session = sessionStorage.getItem('dd_session');
        if (session) {
            this.currentUser = JSON.parse(session);
            this.updateHeaderUI();
            this.refreshDashboardState();
        } else {
            this.currentUser = null;
            this.updateHeaderUI();
        }
    }

    updateHeaderUI() {
        if (this.currentUser) {
            this.btnLoginTrigger.classList.add('hidden');
            this.userProfileBadge.classList.remove('hidden');
            this.userRoleLabel.textContent = this.currentUser.role;
            this.userRoleLabel.className = `user-role-tag ${this.currentUser.role}`;
            this.userNameLabel.textContent = this.currentUser.name.split(' ')[0];
            
            // Show Admin Panel link only to logged-in admins
            if (this.currentUser.role === 'admin') {
                if (this.navLinkAdmin) this.navLinkAdmin.classList.remove('hidden');
            } else {
                if (this.navLinkAdmin) this.navLinkAdmin.classList.add('hidden');
            }
        } else {
            this.btnLoginTrigger.classList.remove('hidden');
            this.userProfileBadge.classList.add('hidden');
            if (this.navLinkAdmin) this.navLinkAdmin.classList.add('hidden');
        }
    }

    // -------------------------------------------------------------
    // SPA NAVIGATION & ROUTING
    // -------------------------------------------------------------
    navigateTo(viewId) {
        // Toggle view container visibilities
        Object.keys(this.views).forEach(key => {
            if (key === viewId) {
                this.views[key].classList.add('active');
            } else {
                this.views[key].classList.remove('active');
            }
        });

        // Update Nav Menu active link
        this.navLinks.forEach(link => {
            if (link.getAttribute('data-view') === viewId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        this.currentView = viewId;
        this.refreshDashboardState();
        window.scrollTo(0, 0);
    }

    handleNavClick(event, viewId) {
        event.preventDefault();
        this.navigateTo(viewId);
    }

    // -------------------------------------------------------------
    // AUTHENTICATION MODAL HANDLERS
    // -------------------------------------------------------------
    openAuthModal(defaultTab = 'login') {
        this.authModal.classList.add('active');
        this.switchAuthTab(defaultTab);
    }

    closeAuthModal() {
        this.authModal.classList.remove('active');
        this.formLogin.reset();
        this.formSignup.reset();
    }

    openLegalModal(type) {
        if (!this.legalModal) return;
        
        const iconEl = document.getElementById('legal-modal-icon');
        const titleEl = document.getElementById('legal-modal-title');
        const subtitleEl = document.getElementById('legal-modal-subtitle');
        const bodyEl = document.getElementById('legal-modal-body');
        
        let iconClass = 'fa-shield-halved';
        let title = 'Privacy Policy';
        let subtitle = 'How we protect your data at TheDealDish';
        let content = '';

        if (type === 'privacy') {
            iconClass = 'fa-user-shield';
            title = 'Privacy Policy';
            subtitle = 'Data Collection & Protection Policy';
            content = `
                <h3>1. Information We Collect</h3>
                <p>To provide a seamless experience on TheDealDish, we collect basic details. This includes:</p>
                <ul>
                    <li><strong>For Consumers:</strong> Name, email address, phone number, and district (for local deals matching).</li>
                    <li><strong>For Hotel Partners:</strong> Hotel name, business email, contact number, district, and FSSAI registration number (to verify food safety clearance).</li>
                </ul>
                
                <h3>2. How We Use Your Information</h3>
                <p>We use the collected information to:</p>
                <ul>
                    <li>Create and manage user and hotel accounts.</li>
                    <li>Facilitate instant deal reservations and generation of secure pickup QR codes.</li>
                    <li>Verify food safety certifications with administrative audits.</li>
                    <li>Improve our platform interface and sustainable marketplace operations.</li>
                </ul>

                <h3>3. Data Protection & Storage</h3>
                <p>All user information is encrypted and stored securely. We do not sell or trade your personal identification details with third-party advertising companies. Your details are shared only to the minimum extent necessary to facilitate surplus food pickup confirmation between consumers and participating hotel staff.</p>

                <h3>4. Food Safety & Compliance</h3>
                <p>By registering, hotel partners provide FSSAI registration numbers which are audited by platform administrators to ensure absolute compliance with food safety regulations.</p>

                <h3>5. Contact Us</h3>
                <p>If you have any questions about this Privacy Policy or wish to modify or request deletion of your details, please contact us at <code>privacy@thedealdish.com</code>.</p>
            `;
        } else if (type === 'terms') {
            iconClass = 'fa-file-contract';
            title = 'Terms of Service';
            subtitle = 'Ecosystem Rules & Fair Conduct';
            content = `
                <h3>1. Acceptance of Terms</h3>
                <p>By creating an account or accessing TheDealDish platform, you agree to comply with and be bound by these Terms of Service. These rules ensure a fair and safe food saving marketplace.</p>

                <h3>2. Nature of Surplus Deals & Seller Recovery</h3>
                <p>Food items listed on TheDealDish are kitchen surpluses. They are offered at deep discounts shortly before closing hours to reduce food waste and help hotel partners recover raw material costs, avoiding total financial loss on unsold fresh food. All items are offered in fresh and edible condition under strict quality assurance.</p>

                <h3>3. Reservation & Pickup Window</h3>
                <p>When you reserve a deal, you lock in the price and quantity. You must present the reservation QR code and pay at the hotel counter before the pickup window expires (which aligns with the hotel's closing hours).</p>

                <h3>4. No-Show & Cancellations</h3>
                <p>Reserved food that is not picked up before closing time will be canceled and disposed of safely to prevent hygiene hazards. Repeated no-shows without cancellation may result in temporary account restrictions.</p>

                <h3>5. Platform Fees & Settlement</h3>
                <p>Transactions are settled directly at the hotel counter. TheDealDish is currently a matching platform and does not process direct payments or hold card details.</p>
            `;
        } else if (type === 'cookies') {
            iconClass = 'fa-cookie-bite';
            title = 'Cookie Settings';
            subtitle = 'Essential Cookies & Local Storage';
            content = `
                <h3>1. How We Use Cookies</h3>
                <p>TheDealDish uses cookies and browser local storage (<code>localStorage</code>) to enable basic functionality. We do not use third-party marketing or tracking cookies.</p>

                <h3>2. Essential Cookies We Use</h3>
                <ul>
                    <li><strong>Authentication State:</strong> Stores session information so you do not need to sign in repeatedly.</li>
                    <li><strong>Marketplace Preferences:</strong> Remembers your district filter setting to present the most relevant deals near you.</li>
                    <li><strong>Local Emulated Database:</strong> Emulates backend collections for users, active deals, and reservation histories to make the app work smoothly.</li>
                </ul>

                <h3>3. Managing Your Cookies</h3>
                <p>You can clear your browser's cookies and local storage at any time via your browser settings. Please note that clearing this data will sign you out and reset the demo environment state.</p>
            `;
        } else if (type === 'fssai') {
            iconClass = 'fa-certificate';
            title = 'FSSAI Rules';
            subtitle = 'Food Safety Standards & Auditing';
            content = `
                <h3>1. FSSAI License Mandatory</h3>
                <p>Under the Food Safety and Standards Act of India, all food business operators (FBOs) must be licensed. TheDealDish requires all participating hotels to provide their valid 14-digit FSSAI License or Registration number during signup.</p>

                <h3>2. Platform Safety Audits</h3>
                <p>Admin verification is required for all hotel accounts. Hotels cannot publish surplus listings on the marketplace until platform administrators audit and approve their submitted FSSAI license credentials.</p>

                <h3>3. Quality & Hygiene Standards</h3>
                <p>Hotel partners warrant that all listed surplus items:</p>
                <ul>
                    <li>Are prepared in FSSAI-compliant, hygienic kitchens.</li>
                    <li>Are safe, fresh, and kept under proper temperature control prior to consumer pickup.</li>
                    <li>Are clearly labeled with food categories (Vegetarian, Non-Vegetarian, Bakery, or Beverage).</li>
                </ul>

                <h3>4. Food Safety Auditing Contacts</h3>
                <p>For safety complaints or reporting hygiene issues, users can reach the administrator or contact the national FSSAI helpdesk directly. Safe food is our absolute priority.</p>
            `;
        }

        iconEl.className = `fa-solid ${iconClass} text-green`;
        titleEl.textContent = title;
        subtitleEl.textContent = subtitle;
        bodyEl.innerHTML = content;
        
        this.legalModal.classList.add('active');
    }

    closeLegalModal() {
        if (this.legalModal) {
            this.legalModal.classList.remove('active');
        }
    }

    switchAuthTab(tab) {
        if (tab === 'login') {
            this.authTabLogin.classList.add('active');
            this.authTabSignup.classList.remove('active');
            this.formLogin.classList.add('active');
            this.formSignup.classList.remove('active');
        } else {
            this.authTabLogin.classList.remove('active');
            this.authTabSignup.classList.add('active');
            this.formLogin.classList.remove('active');
            this.formSignup.classList.add('active');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value;
        
        // Auto-detect special admin credentials to bypass the visible role selector
        const isAdmin = (email === 'admin@thedealdish.com' && pass === 'admin123');
        const role = isAdmin ? 'admin' : document.querySelector('input[name="login-role"]:checked').value;

        const users = JSON.parse(localStorage.getItem('dd_users') || '[]');
        const user = users.find(u => u.email === email && u.passwordHash === pass && u.role === role);

        if (!user) {
            this.showToast('Invalid email, password, or role combination!', 'error');
            return;
        }

        if (role === 'hotel' && !user.isVerified) {
            this.showToast('Your hotel account is pending administrative verification clearance!', 'warning');
            return;
        }

        // Set session
        sessionStorage.setItem('dd_session', JSON.stringify(user));
        this.currentUser = user;
        
        this.showToast(`Welcome back, ${user.name}!`, 'success');
        this.updateHeaderUI();
        this.closeAuthModal();
        
        // Redirect based on role
        if (role === 'customer') this.navigateTo('explore');
        else if (role === 'hotel') this.navigateTo('hotel');
        else if (role === 'admin') this.navigateTo('admin');
    }

    handleSignup(e) {
        e.preventDefault();
        const hotelName = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const phone = document.getElementById('register-phone').value.trim();
        const district = document.getElementById('register-district').value;
        const fssai = document.getElementById('register-fssai').value.trim();
        const password = document.getElementById('register-password').value;
        const closeTime = document.getElementById('register-close').value;

        // Validations
        if (fssai.length !== 14 || isNaN(fssai)) {
            this.showToast('FSSAI Food License must be exactly 14 numeric digits!', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('dd_users') || '[]');
        if (users.some(u => u.email === email)) {
            this.showToast('Email address already registered as partner!', 'error');
            return;
        }

        // Create new User profile
        const newUserId = 'u-' + (users.length + 1);
        const newUserObj = {
            id: newUserId,
            name: hotelName + ' Manager',
            email: email,
            passwordHash: password,
            role: 'hotel',
            phone: phone,
            district: district,
            isVerified: false // Admin must clear
        };

        // Create new Hotel profile
        const hotels = JSON.parse(localStorage.getItem('dd_hotels') || '[]');
        const newHotelId = 'h-' + (hotels.length + 1);
        const newHotelObj = {
            id: newHotelId,
            ownerId: newUserId,
            hotelName: hotelName,
            address: `${district} Center, Kerala`,
            fssaiNumber: fssai,
            closingTime: closeTime,
            isApproved: false,
            district: district
        };

        users.push(newUserObj);
        hotels.push(newHotelObj);

        localStorage.setItem('dd_users', JSON.stringify(users));
        localStorage.setItem('dd_hotels', JSON.stringify(hotels));

        this.showToast('Registration submitted! Clearance requires Admin FSSAI verification.', 'warning');
        this.closeAuthModal();
        this.navigateTo('home');
    }

    logout() {
        sessionStorage.removeItem('dd_session');
        this.currentUser = null;
        this.showToast('Logged out successfully.', 'info');
        this.updateHeaderUI();
        this.navigateTo('home');
    }

    // -------------------------------------------------------------
    // CUSTOMER PORTAL LOGIC (Browse & Filters & Reserving)
    // -------------------------------------------------------------
    setCategoryFilter(category) {
        this.activeCategory = category;
        document.querySelectorAll('.pill').forEach(pill => {
            if (pill.getAttribute('data-category') === category) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
        this.renderDeals();
    }

    filterDeals() {
        this.renderDeals();
    }

    renderDeals() {
        const grid = document.getElementById('deals-grid');
        if (!grid) return;

        const items = JSON.parse(localStorage.getItem('dd_food_items') || '[]');
        const hotels = JSON.parse(localStorage.getItem('dd_hotels') || '[]');
        const searchQuery = document.getElementById('search-deals')?.value.toLowerCase() || '';
        const districtFilter = document.getElementById('filter-district')?.value || 'all';

        grid.innerHTML = '';
        let matchCount = 0;

        items.forEach(item => {
            const hotel = hotels.find(h => h.id === item.hotelId);
            if (!hotel || item.status !== 'active') return;

            // Apply Filters
            const matchesCategory = (this.activeCategory === 'all' || item.category === this.activeCategory);
            const matchesDistrict = (districtFilter === 'all' || hotel.district === districtFilter);
            const matchesSearch = (item.itemName.toLowerCase().includes(searchQuery) || hotel.hotelName.toLowerCase().includes(searchQuery));

            if (matchesCategory && matchesDistrict && matchesSearch) {
                matchCount++;
                const card = document.createElement('div');
                card.className = 'deal-card';
                
                // Format details
                const discountPercent = Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100);
                
                card.innerHTML = `
                    <div class="deal-img-wrapper">
                        <img src="${this.getPlaceholderImage(item.category)}" alt="${item.itemName}" class="deal-img">
                        <span class="deal-category-badge">${item.category}</span>
                        <span class="deal-timer-badge" data-endtime="${item.pickupEnd}">
                            <i class="fa-solid fa-clock"></i> <span class="timer-countdown">Calculating...</span>
                        </span>
                    </div>
                    <div class="deal-info">
                        <span class="deal-hotel-name"><i class="fa-solid fa-hotel"></i> ${hotel.hotelName}</span>
                        <h3 class="deal-title">${item.itemName}</h3>
                        <p class="deal-qty-left ${item.quantityAvailable > 3 ? 'healthy' : ''}">
                            <i class="fa-solid fa-circle-exclamation"></i> Only ${item.quantityAvailable} portion${item.quantityAvailable > 1 ? 's' : ''} left!
                        </p>
                        <div class="deal-footer">
                            <div class="deal-pricing">
                                <span class="price-original">₹${item.originalPrice}</span>
                                <span class="price-discount">₹${item.discountedPrice} <small class="text-green">(${discountPercent}% OFF)</small></span>
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="app.handleReserveItem('${item.id}')">
                                <i class="fa-solid fa-basket-shopping"></i> Reserve
                            </button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            }
        });

        // Update counts
        const badge = document.getElementById('deals-count-badge');
        if (badge) badge.textContent = `${matchCount} active deal${matchCount !== 1 ? 's' : ''}`;

        if (matchCount === 0) {
            grid.innerHTML = `
                <div class="no-results-panel">
                    <i class="fa-solid fa-circle-info"></i>
                    <h3>No Active Food Surplus Listed!</h3>
                    <p>Try resetting your filter selection or searching for other hotels in your area.</p>
                </div>
            `;
        }
        
        // Refresh timer rendering immediately
        this.updateCountdowns();
    }

    getPlaceholderImage(category) {
        // High quality stylized gradients relative to food category
        const configs = {
            'veg': '142, 60%, 40%',
            'non-veg': '0, 60%, 40%',
            'bakery': '38, 70%, 45%',
            'beverage': '210, 65%, 45%'
        };
        const color = configs[category] || '142, 60%, 40%';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="hsl(${color})"/><stop offset="100%" stop-color="hsl(${color.replace('40%','25%').replace('45%','30%')})"/></linearGradient></defs><rect width="300" height="180" fill="url(#g)"/><text x="50%" y="55%" text-anchor="middle" fill="#fff" font-family="'Outfit', sans-serif" font-weight="700" font-size="20" opacity="0.9">${category.toUpperCase()} SELECTION</text><text x="50%" y="70%" text-anchor="middle" fill="#fff" font-family="'Inter', sans-serif" font-size="12" opacity="0.6">Surplus Kitchen Redistribution</text></svg>`;
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    // -------------------------------------------------------------
    // TRANSACTION LAYER (Surplus Reservation Concurrency & Rules)
    // -------------------------------------------------------------
    handleReserveItem(itemId) {
        // Check authentication
        if (!this.currentUser) {
            this.showToast('Please sign in as a customer to place reservations!', 'warning');
            this.openAuthModal('login');
            return;
        }

        if (this.currentUser.role !== 'customer') {
            this.showToast('Only customer accounts can place food reservations!', 'error');
            return;
        }

        const items = JSON.parse(localStorage.getItem('dd_food_items') || '[]');
        const itemIdx = items.findIndex(i => i.id === itemId);
        
        if (itemIdx === -1) {
            this.showToast('Requested surplus listing not found!', 'error');
            return;
        }
        
        const item = items[itemIdx];

        // Concurrency Quantity Check: validation block
        if (item.quantityAvailable <= 0 || item.status !== 'active') {
            this.showToast('Out of Stock! This surplus item was reserved by another user.', 'error');
            this.renderDeals();
            return;
        }

        // Deduct quantity (Emulate schema transaction locks)
        item.quantityAvailable -= 1;
        if (item.quantityAvailable === 0) {
            item.status = 'reserved';
        }
        items[itemIdx] = item;
        localStorage.setItem('dd_food_items', JSON.stringify(items));

        // Create Reservation Record
        const reservations = JSON.parse(localStorage.getItem('dd_reservations') || '[]');
        const resId = 'r-' + Math.floor(10000 + Math.random() * 90000);
        const newReservation = {
            id: resId,
            customerId: this.currentUser.id,
            foodItemId: itemId,
            quantity: 1,
            totalPrice: item.discountedPrice,
            reservationTime: new Date().toISOString(),
            pickupStatus: 'pending'
        };
        reservations.push(newReservation);
        localStorage.setItem('dd_reservations', JSON.stringify(reservations));

        // Update stats
        this.updateGlobalAnalytics(item.originalPrice - item.discountedPrice);

        // Fetch hotel info for receipt
        const hotels = JSON.parse(localStorage.getItem('dd_hotels') || '[]');
        const hotel = hotels.find(h => h.id === item.hotelId);

        // Show Confirmation Receipt (QR Code generation)
        document.getElementById('res-detail-item').textContent = item.itemName;
        document.getElementById('res-detail-hotel').textContent = hotel?.hotelName || 'Partner Hotel';
        document.getElementById('res-detail-qty').textContent = '1 Portion';
        document.getElementById('res-detail-price').textContent = `₹${item.discountedPrice}`;
        document.getElementById('res-detail-window').textContent = `${item.pickupStart} - ${item.pickupEnd}`;
        document.getElementById('res-detail-id').textContent = resId;

        this.reservationModal.classList.add('active');
        this.showToast('Reservation locked! Collect your meal before expiration.', 'success');
        this.renderDeals();
        this.renderActiveReservations();
    }

    closeReservationModal() {
        this.reservationModal.classList.remove('active');
    }

    // -------------------------------------------------------------
    // HOTEL PORTAL LOGIC (Listing surplus & managing pickups)
    // -------------------------------------------------------------
    switchHotelTab(tabId) {
        document.querySelectorAll('.hotel-tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.dash-menu-item').forEach(item => {
            item.classList.remove('active');
        });

        document.getElementById(`hotel-tab-${tabId}`).classList.add('active');
        
        // Find correct menu item
        const items = document.querySelectorAll('.dash-menu-item');
        if (tabId === 'listings') items[0].classList.add('active');
        else if (tabId === 'add-item') items[1].classList.add('active');
        else if (tabId === 'orders') items[2].classList.add('active');

        this.refreshHotelDashboard();
    }

    handleListFood(e) {
        e.preventDefault();
        if (!this.currentUser || this.currentUser.role !== 'hotel') return;

        const hotels = JSON.parse(localStorage.getItem('dd_hotels') || '[]');
        const hotel = hotels.find(h => h.ownerId === this.currentUser.id);

        if (!hotel) {
            this.showToast('Failed to locate matching hotel profile registration!', 'error');
            return;
        }

        const name = document.getElementById('food-name').value.trim();
        const category = document.getElementById('food-category').value;
        const origPrice = parseFloat(document.getElementById('food-orig-price').value);
        const discPrice = parseFloat(document.getElementById('food-disc-price').value);
        const qty = parseInt(document.getElementById('food-qty').value);
        const pStart = document.getElementById('food-pickup-start').value;
        const pEnd = document.getElementById('food-pickup-end').value;

        // Pricing logic checks
        if (discPrice >= origPrice) {
            this.showToast('Discounted price must be strictly lower than the original menu price!', 'error');
            return;
        }

        const items = JSON.parse(localStorage.getItem('dd_food_items') || '[]');
        const newItemId = 'f-' + (items.length + 1);
        const newItem = {
            id: newItemId,
            hotelId: hotel.id,
            itemName: name,
            category: category,
            originalPrice: origPrice,
            discountedPrice: discPrice,
            quantityAvailable: qty,
            pickupStart: pStart,
            pickupEnd: pEnd,
            status: 'active'
        };

        items.push(newItem);
        localStorage.setItem('dd_food_items', JSON.stringify(items));

        this.showToast('Surplus listed successfully! Customers are now notified.', 'success');
        document.getElementById('form-list-food').reset();
        this.switchHotelTab('listings');
        this.renderDeals();
    }

    refreshHotelDashboard() {
        if (!this.currentUser || this.currentUser.role !== 'hotel') return;

        const hotels = JSON.parse(localStorage.getItem('dd_hotels') || '[]');
        const hotel = hotels.find(h => h.ownerId === this.currentUser.id);
        if (!hotel) return;

        // Bind Sidebar Profile info
        document.getElementById('dash-hotel-name').textContent = hotel.hotelName;
        document.getElementById('dash-hotel-fssai').textContent = hotel.fssaiNumber;
        document.getElementById('dash-hotel-status').textContent = hotel.isApproved ? 'Approved' : 'Pending Verification';

        // Load active listings table
        const items = JSON.parse(localStorage.getItem('dd_food_items') || '[]');
        const hotelItems = items.filter(i => i.hotelId === hotel.id);
        const listingsTbody = document.getElementById('hotel-listings-tbody');
        
        if (listingsTbody) {
            listingsTbody.innerHTML = '';
            hotelItems.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${item.itemName}</strong></td>
                    <td class="text-capitalize">${item.category}</td>
                    <td>₹${item.originalPrice} / <strong class="text-green">₹${item.discountedPrice}</strong></td>
                    <td>${item.quantityAvailable} portions</td>
                    <td>${item.pickupStart} - ${item.pickupEnd}</td>
                    <td><span class="status-badge ${item.status}">${item.status}</span></td>
                    <td>
                        <button class="btn btn-secondary btn-table-action reject" onclick="app.deleteListing('${item.id}')">
                            <i class="fa-solid fa-trash-can"></i> Remove
                        </button>
                    </td>
                `;
                listingsTbody.appendChild(tr);
            });

            if (hotelItems.length === 0) {
                listingsTbody.innerHTML = `<tr><td colspan="7" class="text-center">No surplus listed yet. Click 'List New Surplus' to publish!</td></tr>`;
            }
        }

        // Load active pickups table
        const reservations = JSON.parse(localStorage.getItem('dd_reservations') || '[]');
        const users = JSON.parse(localStorage.getItem('dd_users') || '[]');
        const pickupsTbody = document.getElementById('hotel-orders-tbody');
        
        if (pickupsTbody) {
            pickupsTbody.innerHTML = '';
            let matchCount = 0;

            reservations.forEach(res => {
                const food = hotelItems.find(i => i.id === res.foodItemId);
                if (!food) return; // Not this hotel's item

                matchCount++;
                const cust = users.find(u => u.id === res.customerId);
                const tr = document.createElement('tr');
                
                const actionBtn = res.pickupStatus === 'pending' 
                    ? `<button class="btn btn-primary btn-table-action approve" onclick="app.completePickup('${res.id}')"><i class="fa-solid fa-check"></i> Collect</button>`
                    : `<span class="text-green"><i class="fa-solid fa-circle-check"></i> Picked Up</span>`;

                tr.innerHTML = `
                    <td>#${res.id}</td>
                    <td><strong>${cust ? cust.name : 'Customer'}</strong><br><small>${cust ? cust.phone : ''}</small></td>
                    <td>${food.itemName}</td>
                    <td>${res.quantity} portion(s)</td>
                    <td><strong>₹${res.totalPrice}</strong></td>
                    <td>${new Date(res.reservationTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td><span class="status-badge ${res.pickupStatus}">${res.pickupStatus}</span></td>
                    <td>${actionBtn}</td>
                `;
                pickupsTbody.appendChild(tr);
            });

            if (matchCount === 0) {
                pickupsTbody.innerHTML = `<tr><td colspan="8" class="text-center">No pickup reservations registered yet for your listings.</td></tr>`;
            }
        }
    }

    deleteListing(itemId) {
        let items = JSON.parse(localStorage.getItem('dd_food_items') || '[]');
        items = items.filter(i => i.id !== itemId);
        localStorage.setItem('dd_food_items', JSON.stringify(items));
        this.showToast('Surplus listing deleted!', 'info');
        this.refreshHotelDashboard();
        this.renderDeals();
    }

    completePickup(resId) {
        const reservations = JSON.parse(localStorage.getItem('dd_reservations') || '[]');
        const idx = reservations.findIndex(r => r.id === resId);
        if (idx !== -1) {
            reservations[idx].pickupStatus = 'completed';
            localStorage.setItem('dd_reservations', JSON.stringify(reservations));
            this.showToast(`Reservation #${resId} marked as successfully collected!`, 'success');
            this.refreshHotelDashboard();
            this.renderActiveReservations();
        }
    }

    // -------------------------------------------------------------
    // ADMIN PORTAL LOGIC (Approving Hotels & Auditing FSSAI)
    // -------------------------------------------------------------
    refreshAdminDashboard() {
        if (!this.currentUser || this.currentUser.role !== 'admin') return;

        const hotels = JSON.parse(localStorage.getItem('dd_hotels') || '[]');
        const users = JSON.parse(localStorage.getItem('dd_users') || '[]');

        // Metrics
        const pendingCount = hotels.filter(h => !h.isApproved).length;
        document.getElementById('admin-stat-hotels').textContent = hotels.length;
        document.getElementById('admin-stat-pending').textContent = pendingCount;

        // Pending approval queue table
        const pendingTbody = document.getElementById('admin-pending-hotels-tbody');
        if (pendingTbody) {
            pendingTbody.innerHTML = '';
            const pendingList = hotels.filter(h => !h.isApproved);
            
            pendingList.forEach(h => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${h.hotelName}</strong></td>
                    <td><code>${h.fssaiNumber}</code></td>
                    <td>${h.district}</td>
                    <td>
                        <button class="btn btn-secondary btn-table-action approve" onclick="app.approveHotel('${h.id}')">
                            <i class="fa-solid fa-circle-check"></i> Approve FSSAI
                        </button>
                        <button class="btn btn-secondary btn-table-action reject" onclick="app.rejectHotel('${h.id}')">
                            <i class="fa-solid fa-circle-xmark"></i> Reject
                        </button>
                    </td>
                `;
                pendingTbody.appendChild(tr);
            });

            if (pendingList.length === 0) {
                pendingTbody.innerHTML = `<tr><td colspan="4" class="text-center">Verification queue clear! No pending licenses.</td></tr>`;
            }
        }

        // Active hotels table
        const activeTbody = document.getElementById('admin-active-hotels-tbody');
        if (activeTbody) {
            activeTbody.innerHTML = '';
            const activeList = hotels.filter(h => h.isApproved);

            activeList.forEach(h => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${h.hotelName}</strong></td>
                    <td><code>${h.fssaiNumber}</code></td>
                    <td>${h.closingTime}</td>
                    <td><span class="status-badge approved">Cleared</span></td>
                `;
                activeTbody.appendChild(tr);
            });

            if (activeList.length === 0) {
                activeTbody.innerHTML = `<tr><td colspan="4" class="text-center">No active hotel profiles verified yet.</td></tr>`;
            }
        }
    }

    approveHotel(hotelId) {
        const hotels = JSON.parse(localStorage.getItem('dd_hotels') || '[]');
        const users = JSON.parse(localStorage.getItem('dd_users') || '[]');
        const hotelIdx = hotels.findIndex(h => h.id === hotelId);

        if (hotelIdx !== -1) {
            hotels[hotelIdx].isApproved = true;
            
            // Also verify the corresponding user role account
            const ownerId = hotels[hotelIdx].ownerId;
            const userIdx = users.findIndex(u => u.id === ownerId);
            if (userIdx !== -1) {
                users[userIdx].isVerified = true;
            }

            localStorage.setItem('dd_hotels', JSON.stringify(hotels));
            localStorage.setItem('dd_users', JSON.stringify(users));

            this.showToast(`Hotel '${hotels[hotelIdx].hotelName}' food license approved successfully!`, 'success');
            this.refreshAdminDashboard();
        }
    }

    rejectHotel(hotelId) {
        let hotels = JSON.parse(localStorage.getItem('dd_hotels') || '[]');
        let users = JSON.parse(localStorage.getItem('dd_users') || '[]');
        const hotel = hotels.find(h => h.id === hotelId);

        if (hotel) {
            const ownerId = hotel.ownerId;
            hotels = hotels.filter(h => h.id !== hotelId);
            users = users.filter(u => u.id !== ownerId);

            localStorage.setItem('dd_hotels', JSON.stringify(hotels));
            localStorage.setItem('dd_users', JSON.stringify(users));

            this.showToast('Hotel profile rejected and registrations deleted.', 'info');
            this.refreshAdminDashboard();
        }
    }

    // -------------------------------------------------------------
    // RESERVATIONS RENDER (Customer Portal Dashboard)
    // -------------------------------------------------------------
    renderActiveReservations() {
        const list = document.getElementById('active-reservations-list');
        if (!list) return;

        if (!this.currentUser || this.currentUser.role !== 'customer') {
            list.innerHTML = `<div class="no-results-panel" style="grid-column: 1/-1"><p>Sign in to view your active pickup codes and history.</p></div>`;
            return;
        }

        const reservations = JSON.parse(localStorage.getItem('dd_reservations') || '[]');
        const items = JSON.parse(localStorage.getItem('dd_food_items') || '[]');
        const hotels = JSON.parse(localStorage.getItem('dd_hotels') || '[]');
        const userRes = reservations.filter(r => r.customerId === this.currentUser.id);

        list.innerHTML = '';
        let activeCount = 0;

        userRes.forEach(res => {
            const item = items.find(i => i.id === res.foodItemId);
            if (!item) return;
            
            const hotel = hotels.find(h => h.id === item.hotelId);
            activeCount++;

            const card = document.createElement('div');
            card.className = 'reservation-card';
            card.innerHTML = `
                <div class="res-qrcode-preview" onclick="app.showReservationQR('${res.id}')" title="Click to view QR receipt">
                    <i class="fa-solid fa-qrcode"></i>
                </div>
                <div class="res-card-info">
                    <h4>${item.itemName}</h4>
                    <p><i class="fa-solid fa-hotel"></i> ${hotel ? hotel.hotelName : 'Partner Hotel'}</p>
                    <p><i class="fa-solid fa-clock"></i> Pickup: <strong>${item.pickupStart} - ${item.pickupEnd}</strong></p>
                </div>
                <span class="res-card-status ${res.pickupStatus}">${res.pickupStatus}</span>
            `;
            list.appendChild(card);
        });

        if (activeCount === 0) {
            list.innerHTML = `<div class="no-results-panel" style="grid-column: 1/-1"><i class="fa-solid fa-receipt"></i><p>You have no active food reservations currently.</p></div>`;
        }
    }

    showReservationQR(resId) {
        const reservations = JSON.parse(localStorage.getItem('dd_reservations') || '[]');
        const resObj = reservations.find(r => r.id === resId);
        if (!resObj) return;

        const items = JSON.parse(localStorage.getItem('dd_food_items') || '[]');
        const item = items.find(i => i.id === resObj.foodItemId);
        const hotels = JSON.parse(localStorage.getItem('dd_hotels') || '[]');
        const hotel = hotels.find(h => h.id === item?.hotelId);

        if (!item || !hotel) return;

        document.getElementById('res-detail-item').textContent = item.itemName;
        document.getElementById('res-detail-hotel').textContent = hotel.hotelName;
        document.getElementById('res-detail-qty').textContent = `${resObj.quantity} Portion(s)`;
        document.getElementById('res-detail-price').textContent = `₹${resObj.totalPrice}`;
        document.getElementById('res-detail-window').textContent = `${item.pickupStart} - ${item.pickupEnd}`;
        document.getElementById('res-detail-id').textContent = resId;

        this.reservationModal.classList.add('active');
    }

    // -------------------------------------------------------------
    // GLOBAL STATE SYNCS & REFRESHES
    // -------------------------------------------------------------
    refreshDashboardState() {
        this.updateGlobalAnalyticsDisplay();

        // Check authentication state visibility panels
        if (this.currentUser) {
            if (this.currentUser.role === 'hotel') {
                document.getElementById('hotel-unauthenticated')?.classList.add('hidden');
                document.getElementById('hotel-authenticated')?.classList.remove('hidden');
                this.refreshHotelDashboard();
            } else if (this.currentUser.role === 'admin') {
                document.getElementById('admin-unauthenticated')?.classList.add('hidden');
                document.getElementById('admin-authenticated')?.classList.remove('hidden');
                this.refreshAdminDashboard();
            }
        } else {
            document.getElementById('hotel-unauthenticated')?.classList.remove('hidden');
            document.getElementById('hotel-authenticated')?.classList.add('hidden');
            document.getElementById('admin-unauthenticated')?.classList.remove('hidden');
            document.getElementById('admin-authenticated')?.classList.add('hidden');
        }

        if (this.currentView === 'explore') {
            this.renderActiveReservations();
        }
    }

    updateGlobalAnalytics(savingValue) {
        // Increment meals count
        let count = parseInt(localStorage.getItem('dd_stat_meals') || '1482');
        count += 1;
        localStorage.setItem('dd_stat_meals', count.toString());

        // Increment CO2 savings (2.5kg per meal)
        let co2 = parseFloat(localStorage.getItem('dd_stat_co2') || '3705');
        co2 += 2.5;
        localStorage.setItem('dd_stat_co2', co2.toString());

        // Increment money saved
        let money = parseFloat(localStorage.getItem('dd_stat_money') || '296400');
        money += savingValue;
        localStorage.setItem('dd_stat_money', money.toString());

        this.updateGlobalAnalyticsDisplay();
    }

    updateGlobalAnalyticsDisplay() {
        const mealsVal = localStorage.getItem('dd_stat_meals') || '1482';
        const co2Val = parseFloat(localStorage.getItem('dd_stat_co2') || '3705').toFixed(1) + ' kg';
        const moneyVal = '₹' + parseInt(localStorage.getItem('dd_stat_money') || '296400').toLocaleString();

        const mealsEl = document.getElementById('stat-meals');
        const co2El = document.getElementById('stat-co2');
        const moneyEl = document.getElementById('stat-money');

        if (mealsEl) mealsEl.textContent = mealsVal;
        if (co2El) co2El.textContent = co2Val;
        if (moneyEl) moneyEl.textContent = moneyVal;

        // Admin board matches
        const adminCo2El = document.getElementById('admin-stat-co2-saved');
        if (adminCo2El) adminCo2El.textContent = co2Val;
    }

    // -------------------------------------------------------------
    // REAL-TIME AUTO EXPIRY & COUNTDOWNS SYSTEM
    // -------------------------------------------------------------
    startGlobalTimers() {
        this.timerInterval = setInterval(() => {
            this.updateCountdowns();
            this.evaluateListingExpirations();
        }, 1000);
    }

    updateCountdowns() {
        const timers = document.querySelectorAll('.deal-timer-badge');
        timers.forEach(badge => {
            const endTimeStr = badge.getAttribute('data-endtime');
            if (!endTimeStr) return;

            const label = badge.querySelector('.timer-countdown');
            if (!label) return;

            // Compute delta
            const now = new Date();
            const [hours, minutes] = endTimeStr.split(':').map(Number);
            const targetDate = new Date();
            targetDate.setHours(hours, minutes, 0, 0);

            let diff = targetDate.getTime() - now.getTime();
            
            // Handle cross-day scenario
            if (diff < 0) {
                targetDate.setDate(targetDate.getDate() + 1);
                diff = targetDate.getTime() - now.getTime();
            }

            // If time is expired
            if (diff <= 0 || diff > 4 * 60 * 60 * 1000) {
                // More than 4 hours ahead or negative means expired in our mock layout
                label.textContent = "Expired";
                badge.style.background = "var(--danger)";
                return;
            }

            const hrs = Math.floor(diff / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            let display = '';
            if (hrs > 0) display += `${hrs}h `;
            display += `${mins}m ${secs}s left`;

            label.textContent = display;
            
            // Visual warning when less than 30 mins left
            if (diff < 30 * 60 * 1000) {
                badge.style.background = "var(--danger)";
            } else {
                badge.style.background = "rgba(0,0,0,0.75)";
            }
        });
    }

    evaluateListingExpirations() {
        let items = JSON.parse(localStorage.getItem('dd_food_items') || '[]');
        const now = new Date();
        let changed = false;

        items.forEach((item, idx) => {
            if (item.status !== 'active') return;

            const [hours, minutes] = item.pickupEnd.split(':').map(Number);
            const targetDate = new Date();
            targetDate.setHours(hours, minutes, 0, 0);

            // Handle expired check
            if (now.getTime() > targetDate.getTime()) {
                items[idx].status = 'expired';
                changed = true;
                
                // Trigger auto cancel for any uncollected customer reservations associated with this listing
                this.cancelExpiredReservations(item.id);
            }
        });

        if (changed) {
            localStorage.setItem('dd_food_items', JSON.stringify(items));
            this.renderDeals();
            this.refreshDashboardState();
        }
    }

    cancelExpiredReservations(foodItemId) {
        let reservations = JSON.parse(localStorage.getItem('dd_reservations') || '[]');
        let changed = false;

        reservations.forEach((res, idx) => {
            if (res.foodItemId === foodItemId && res.pickupStatus === 'pending') {
                reservations[idx].pickupStatus = 'expired';
                changed = true;
            }
        });

        if (changed) {
            localStorage.setItem('dd_reservations', JSON.stringify(reservations));
        }
    }

    // -------------------------------------------------------------
    // TOAST NOTIFICATIONS
    // -------------------------------------------------------------
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'circle-check';
        if (type === 'error') icon = 'circle-exclamation';
        if (type === 'warning') icon = 'triangle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);

        // Remove toast
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s reverse ease-in forwards';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }
}

// Instantiate Global Application
const app = new TheDealDishApp();
