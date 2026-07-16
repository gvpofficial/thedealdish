# THEDEALDISH 🍽️💚
### Fostering a Sustainable Tomorrow — One Deal at a Time

**TheDealDish** is a premium, responsive Single Page Application (SPA) designed to bridge the gap between top hotels/restaurants and local consumers. The platform enables hotels to list fresh, high-quality surplus meals (such as buffet extras, pastries, or daily specials) at deep discounts (up to 70% off) shortly before closing hours. By connecting surplus kitchen inventory with hungry bellies, TheDealDish reduces food waste, lowers carbon emissions, and saves consumers money.

---

## 🌟 Key Features

### 👤 1. Customer Portal (Browse & Reserve)
- **Real-Time Surplus Catalog:** Browse discounted deals nearby (Biryani, Pastries, Main Courses, Cold Brews).
- **Advanced Filtering:** Filter by keyword search, food category (Vegetarian, Non-Vegetarian, Bakery, Beverages), and local district.
- **Instant Reservation Lock:** Reserve portions instantly to lock in your discount.
- **Secure Pickup QR Codes:** Generates a secure QR code for verification at the hotel counter.
- **Ecosystem Stats & Earth Impact:** Interactive counters showing saved meals, prevented CO₂ emissions, and consumer savings.

### 🏨 2. Hotel Partner Portal (List & Verify)
- **Business Registration:** Hotels can register with their name, address, contact, and closing times.
- **FSSAI Food Safety Compliance:** Mandatory 14-digit FSSAI licensing input to ensure quality control.
- **Surplus Publishing:** Easily create active listings by inputting item names, categories, original menu prices, discount rates, quantities, and pickup windows.
- **Collection Management:** Real-time dashboard to manage pending pickups and verify orders via customer QR codes.

### 🛡️ 3. Administrative Console (Audit & Verify)
- **FSSAI Auditing Queue:** Administrators review submitted hotel registration details and FSSAI credentials.
- **Merchant Activation:** Approve or reject registrations to keep the marketplace safe and regulatory-compliant.
- **Platform Analytics:** Real-time monitoring of registered partners, pending verifications, and cumulative carbon offsets.

---

## 💻 Tech Stack
- **Frontend Core:** Semantic HTML5, Vanilla ES6 JavaScript (OOP-driven Single Page Application engine).
- **Styling (CSS):** Custom Modern CSS featuring a custom Emerald Green & Soft Sage color system, responsive grid layouts, and glassmorphic panels.
- **Database (Emulated):** Local storage state machine (`localStorage`) for persistence across sessions.
- **Typography:** Custom fonts via Google Fonts (`Outfit` and `Inter`).
- **Icons:** FontAwesome v6.4.0.

---

## 🔑 Demo Accounts & Credentials

To explore the different portals, you can log in using these pre-seeded demo accounts:

| Portal Role | Email Address | Password | Functionality |
| :--- | :--- | :--- | :--- |
| **Consumer** | `customer@thedealdish.com` | `customer123` | Browse, filter, reserve deals, view active pickup QR codes. |
| **Hotel Partner** | `taj@thedealdish.com` | `taj123` | Add surplus deals, review orders, manage active listings. |
| **Platform Admin** | `admin@thedealdish.com` | `admin123` | Audit FSSAI licenses, approve/reject hotels, monitor metrics. |

---

## 🚀 Quick Start

1. **Clone/Download the repository** to your local drive.
2. Open the main directory and launch [index.html](index.html) directly in any modern web browser.
3. Alternately, serve the folder locally using your preferred local server extension (e.g., Live Server in VS Code) or run a simple Python server:
   ```bash
   python -m http.server 8000
   ```
   *Then access the app in your browser at `http://localhost:8000`.*

---

## 📜 Legal & Compliance

The platform features built-in legal policies accessible from the footer, including:
- **Privacy Policy:** Data collection scopes for consumers and audited hotels.
- **Terms of Service:** Guidelines regarding reservation cancellation windows and surplus listing parameters.
- **Cookie Settings:** Details on functional `localStorage` browser settings.
- **FSSAI Rules:** Platform regulations enforcing valid safety licenses before restaurant activation.

---

*“Every single meal saved keeps roughly 2.5 kg of CO₂ equivalent emissions out of the atmosphere. Your choices make a difference!”* 🌍
