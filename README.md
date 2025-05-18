# QR Code Generator (Node.js + Express)

This is a simple web application built with **Node.js**, **Express**, and **qrcode** that generates QR codes from URL links. Users can:

- Enter a URL
- Generate a QR code
- View it
- Download it
- The image auto-deletes after 5 minutes to keep the server clean.

---

## 🚀 Features

- Generate QR codes from any URL
- Download QR code as PNG
- Temporary file cleanup (auto-delete after 5 minutes)
- Built with modern JavaScript using ES Modules

---

## 🛠 Tech Stack

- Node.js
- Express
- QRCode (npm package)
- ES Modules

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/qr-code-generator.git
cd qr-code-generator
npm install

```

By default, the server runs at http://localhost:3000

## 📁 Notes

- `node_modules/` is ignored via `.gitignore` — users must run `npm install` after cloning.

- The `public/` folder (used to temporarily store QR code images) is also gitignored and **must be present** for the app to work.  
  If it's missing, it will be automatically created by the app at runtime.

---

## 💡 File Cleanup

QR codes are stored in the `public/` directory and are automatically deleted **5 minutes** after generation to prevent clutter and save space.
