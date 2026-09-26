# Supermarket MERN E-Commerce — Setup Guide

## 1. Backend

```
cd backend
npm install
```

Edit `backend/.env`:
- `MONGO_URI` — already filled from your project (Atlas connection string)
- `JWT_SECRET` — set any long random string
- `EMAIL_USER` — a Gmail address you control
- `EMAIL_PASS` — a Gmail **App Password** (NOT your normal Gmail password).
  Create one at https://myaccount.google.com/apppasswords
  (needs 2-Step Verification turned on for your Google account)
- `ADMIN_EMAIL` — already set to nanthakumar2006geetha02@gmail.com. Every
  order (COD or online) sends a notification email to this address.

Run the server:
```
npm run dev
```
Server runs at http://localhost:5000

## 2. Frontend

```
cd frontend
npm install
```

Edit `frontend/.env`:
- `VITE_API_URL` — leave as http://localhost:5000/api for local dev
- `VITE_UPI_ID` — your personal/business UPI ID (e.g. `yourname@okhdfcbank`,
  `yourname@ybl`, `yourname@paytm`) that customers will pay to
- `VITE_UPI_NAME` — the display name shown in the customer's UPI app

Run the app:
```
npm run dev
```
App runs at http://localhost:5173

## 3. Add products

Register a normal account, then in MongoDB set that user's `role` field to
`"admin"` (via MongoDB Atlas / Compass). Admin accounts can add products via
a POST request to `/api/products` (title, link, rate, category, stock).
You can use Postman/Thunder Client, or simply insert product documents
directly in the `products` collection to get started quickly.

## 4. What's included

- **Auth**: JWT-based register/login, protected routes
- **Products**: search + category filter, add-to-cart with quantity picker
- **Cart**: persisted in localStorage via React Context
- **Checkout**: 2-step flow (address → payment method), just like Flipkart —
  choose Cash on Delivery or UPI
- **UPI Payment**: no payment gateway/business account needed. A UPI deep
  link (`upi://pay?pa=...`) opens the customer's GPay/PhonePe/Paytm app with
  your UPI ID and the amount pre-filled. After paying, the customer taps
  "I've completed the payment" to place the order (self-declared/trust-based,
  same approach many small shops use without a payment gateway)
- **Order email**: On every order (COD or UPI), the backend emails
  nanthakumar2006geetha02@gmail.com with the order details
- **My Orders**: logged-in users can view their order history
- **Advanced React patterns used**: Context API (Auth + Cart), route-level
  code-splitting with `React.lazy`/`Suspense`, protected routes, custom
  hooks (`useAuth`, `useCart`), controlled forms, `useMemo`/`useCallback`
  for performance

## Notes

- No dummy/hardcoded data anywhere — all product/cart/order data comes from
  the database or real form input.
- UPI payment is self-declared (no gateway verifies it), so on a mobile
  device the "Open GPay / PhonePe" button really opens the UPI app; on a
  laptop browser, UPI apps aren't installed, so open the checkout page on
  your phone to actually test paying.
