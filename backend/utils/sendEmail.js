import nodemailer from "nodemailer";

// Uses a Gmail App Password (EMAIL_USER / EMAIL_PASS in .env).
// Docs: https://myaccount.google.com/apppasswords
const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// Format currency
const inr = (amt) => `₹${Number(amt).toLocaleString("en-IN")}`;

// Helper: Common email layout with fresh organic theme
const emailWrapper = (title, content) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7f4; margin: 0; padding: 20px; color: #333; }
      .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
      .header { background: linear-gradient(135deg, #15803d, #16a34a, #22c55e); padding: 28px 24px; text-align: center; color: white; }
      .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
      .header p { margin: 6px 0 0; font-size: 14px; opacity: 0.9; }
      .content { padding: 28px 24px; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
      .badge-paid { background: #dcfce7; color: #166534; }
      .badge-cod { background: #fef9c3; color: #854d0e; }
      .badge-shipped { background: #e0e7ff; color: #3730a3; }
      .badge-delivered { background: #dcfce7; color: #15803d; }
      .card { background: #f8fafc; border-radius: 12px; padding: 18px; margin: 16px 0; border: 1px solid #e2e8f0; }
      .table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      .table th { text-align: left; padding: 10px; font-size: 13px; color: #64748b; background: #f1f5f9; border-bottom: 2px solid #cbd5e1; }
      .table td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
      .total-row { font-size: 16px; font-weight: 700; color: #166534; }
      .footer { background: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      .btn { display: inline-block; background: #16a34a; color: white !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 16px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🥦 FreshVeg Direct Store</h1>
        <p>${title}</p>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p style="margin:0 0 6px 0;">🌱 100% Farm Fresh & Organic Produce Delivered Fast</p>
        <p style="margin:0;">Need help? Reply to this email or contact support at ${process.env.EMAIL_USER || "our helpline"}.</p>
      </div>
    </div>
  </body>
  </html>
`;

export const sendOrderNotification = async (order, user) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL_USER / EMAIL_PASS not set in .env — skipping order emails");
    return;
  }

  const itemsRows = order.items
    .map(
      (i) => `
      <tr>
        <td>
          <div style="font-weight:600;color:#1e293b;">${i.title}</div>
          ${i.rate ? `<small style="color:#64748b;">${inr(i.rate)} per unit</small>` : ""}
        </td>
        <td style="text-align:center;font-weight:600;">${i.qty}</td>
        <td style="text-align:right;font-weight:600;">${inr(i.rate * i.qty)}</td>
      </tr>
    `
    )
    .join("");

  const isUpi = order.paymentMethod === "upi";
  const paymentBadge = isUpi
    ? `<span class="badge badge-paid">Online UPI · ${order.paymentStatus.toUpperCase()}</span>`
    : `<span class="badge badge-cod">Cash on Delivery · ${order.paymentStatus.toUpperCase()}</span>`;

  // 1. Customer Confirmation Email
  const customerContent = `
    <h2 style="color:#15803d;margin-top:0;">Thank you for your order, ${user?.name || order.address?.fullName || "Valued Customer"}! 🎉</h2>
    <p style="color:#475569;line-height:1.6;">Your order has been received and is being prepared fresh from the farm. We will notify you once it's on the way!</p>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:13px;color:#64748b;">Order Reference</span>
        ${paymentBadge}
      </div>
      <div style="font-size:18px;font-weight:700;color:#0f172a;letter-spacing:0.5px;">#${order._id}</div>
      <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Placed on ${new Date(order.createdAt || Date.now()).toLocaleString("en-IN")}</div>
    </div>

    <h3 style="font-size:15px;color:#1e293b;margin:20px 0 8px;">🛒 Ordered Items</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
        <tr class="total-row">
          <td colspan="2" style="text-align:right;padding-top:14px;">Total Amount:</td>
          <td style="text-align:right;padding-top:14px;color:#15803d;font-size:18px;">${inr(order.totalAmount)}</td>
        </tr>
      </tbody>
    </table>

    <div class="card" style="margin-top:20px;">
      <h3 style="margin:0 0 8px 0;font-size:14px;color:#334155;">📍 Delivery Address</h3>
      <p style="margin:0;color:#475569;line-height:1.5;font-size:14px;">
        <strong>${order.address?.fullName}</strong> &bull; ${order.address?.phone}<br/>
        ${order.address?.line1}<br/>
        ${order.address?.city}, ${order.address?.state} - ${order.address?.pincode}
      </p>
    </div>

    <div style="text-align:center;margin-top:24px;">
      <p style="font-size:13px;color:#64748b;margin:0 0 12px 0;">⚡ Fast 30-45 Minutes Delivery Guarantee</p>
    </div>
  `;

  // 2. Admin Alert Email
  const adminContent = `
    <h2 style="color:#0f172a;margin-top:0;">🛒 New Order Received!</h2>
    <div class="card" style="border-left:4px solid #16a34a;">
      <p style="margin:0 0 6px 0;"><strong>Order ID:</strong> #${order._id}</p>
      <p style="margin:0 0 6px 0;"><strong>Customer:</strong> ${user?.name || "Customer"} (${user?.email || "N/A"})</p>
      <p style="margin:0 0 6px 0;"><strong>Phone:</strong> ${order.address?.phone}</p>
      <p style="margin:0 0 6px 0;"><strong>Payment Mode:</strong> ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})</p>
      ${order.upiTransactionNote ? `<p style="margin:0 0 6px 0;color:#2563eb;"><strong>UPI Ref/Note:</strong> ${order.upiTransactionNote}</p>` : ""}
      <p style="margin:0;"><strong>Grand Total:</strong> <span style="color:#16a34a;font-size:16px;font-weight:700;">${inr(order.totalAmount)}</span></p>
    </div>

    <h3 style="font-size:15px;color:#1e293b;margin:16px 0 8px;">📍 Shipping Address</h3>
    <p style="margin:0 0 16px 0;color:#334155;background:#f8fafc;padding:12px;border-radius:8px;font-size:14px;">
      <strong>${order.address?.fullName}</strong> (${order.address?.phone})<br/>
      ${order.address?.line1}, ${order.address?.city}, ${order.address?.state} - ${order.address?.pincode}
    </p>

    <h3 style="font-size:15px;color:#1e293b;margin:16px 0 8px;">Ordered Items (${order.items?.length || 0})</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Item</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
        <tr class="total-row">
          <td colspan="2" style="text-align:right;">Total:</td>
          <td style="text-align:right;color:#15803d;">${inr(order.totalAmount)}</td>
        </tr>
      </tbody>
    </table>
  `;

  const transporter = getTransporter();

  // Send to Admin
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  try {
    await transporter.sendMail({
      from: `"FreshVeg Store" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🚨 [NEW ORDER] #${order._id} - ${inr(order.totalAmount)} (${order.paymentMethod.toUpperCase()})`,
      html: emailWrapper(`New Order Alert · ${inr(order.totalAmount)}`, adminContent),
    });
    console.log("Admin order alert email sent ✅");
  } catch (err) {
    console.error("Failed to send admin order email ❌", err.message);
  }

  // Send to Customer (if user has valid email)
  const customerEmail = user?.email || order.address?.email;
  if (customerEmail && customerEmail !== adminEmail) {
    try {
      await transporter.sendMail({
        from: `"FreshVeg Direct" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `🎉 Order Confirmation #${order._id} - FreshVeg Store`,
        html: emailWrapper(`Order Confirmed · Thank You!`, customerContent),
      });
      console.log(`Customer order confirmation sent to ${customerEmail} ✅`);
    } catch (err) {
      console.error("Failed to send customer order email ❌", err.message);
    }
  }
};

// Send Order Status Update Email to Customer
export const sendOrderStatusEmail = async (order, user, newStatus) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  const customerEmail = user?.email || order.address?.email;
  if (!customerEmail) return;

  const statusTitleMap = {
    placed: "Order Received",
    processing: "Order Being Prepared & Packed",
    shipped: "Order Out for Delivery 🛵",
    delivered: "Order Delivered Successfully 🎉",
    cancelled: "Order Cancelled",
  };

  const statusMsgMap = {
    placed: "Your order has been confirmed and placed in our kitchen queue.",
    processing: "Our team is carefully handpicking and packing your farm fresh produce.",
    shipped: "Your delivery partner is on the way with your fresh vegetables! Please keep your phone reachable.",
    delivered: "Your order has been delivered. We hope you enjoy the fresh quality! Rate your experience with us.",
    cancelled: "Your order has been cancelled. If you have any questions, please contact our support.",
  };

  const title = statusTitleMap[newStatus] || `Order Status: ${newStatus}`;
  const message = statusMsgMap[newStatus] || `Your order status has been updated to ${newStatus}.`;

  const content = `
    <h2 style="color:#15803d;margin-top:0;">${title}</h2>
    <p style="color:#475569;font-size:15px;line-height:1.6;">${message}</p>
    <div class="card">
      <p style="margin:0 0 6px 0;"><strong>Order ID:</strong> #${order._id}</p>
      <p style="margin:0 0 6px 0;"><strong>Current Status:</strong> <span class="badge badge-shipped">${newStatus.toUpperCase()}</span></p>
      <p style="margin:0;"><strong>Total:</strong> <span style="color:#15803d;font-weight:700;">${inr(order.totalAmount)}</span></p>
    </div>
  `;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"FreshVeg Direct" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Update on Order #${order._id}: ${title}`,
      html: emailWrapper(title, content),
    });
    console.log(`Order status update sent to ${customerEmail} ✅`);
  } catch (err) {
    console.error("Failed to send order status email ❌", err.message);
  }
};

// Send Contact Inquiry Email to Admin
export const sendContactEmail = async ({ name, email, phone, message }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email configuration not set");
  }

  const content = `
    <h2 style="color:#0f172a;margin-top:0;">📬 New Message from Contact Form</h2>
    <div class="card" style="border-left:4px solid #22c55e;">
      <p style="margin:0 0 8px 0;"><strong>Name:</strong> ${name}</p>
      <p style="margin:0 0 8px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      ${phone ? `<p style="margin:0 0 8px 0;"><strong>Phone:</strong> ${phone}</p>` : ""}
      <p style="margin:0 0 8px 0;"><strong>Received At:</strong> ${new Date().toLocaleString("en-IN")}</p>
    </div>
    <h3 style="font-size:15px;color:#1e293b;margin:16px 0 8px;">Message Content:</h3>
    <div style="background:#f8fafc;padding:16px;border-radius:8px;border:1px solid #e2e8f0;font-size:14px;line-height:1.6;color:#334155;">
      ${message.replace(/\n/g, "<br/>")}
    </div>
  `;

  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  await transporter.sendMail({
    from: `"FreshVeg Support" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    replyTo: email,
    subject: `📩 Contact Form Message from ${name}`,
    html: emailWrapper(`Customer Message from ${name}`, content),
  });
};