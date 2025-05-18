import express from "express";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;
const CLEANUP_TIMEOUT = 5 * 60 * 1000; // 5 minutes

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Serve home page with form
app.get("/", (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>QR Code Generator</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 100%;
          }
          h2 {
            color: #333;
            margin-bottom: 1.5rem;
          }
          input {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 1rem;
          }
          button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>QR Code Generator</h2>
          <form action="/generate" method="post">
            <input type="text" name="url" placeholder="Enter URL" required />
            <button type="submit">Generate QR Code</button>
          </form>
        </div>
      </body>
      </html>
    `);
});

// Generate QR Code and show with download option
app.post("/generate", async (req, res) => {
  const url = req.body.url;

  if (!url) {
    return res.send("URL is required");
  }

  const fileName = `qrcode-${Date.now()}.png`;
  const filePath = path.join(__dirname, "public", fileName);

  try {
    await QRCode.toFile(filePath, url);

    // Schedule file deletion after timeout
    setTimeout(() => {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Failed to delete ${fileName}:`, err);
        else console.log(`Deleted old QR code: ${fileName}`);
      });
    }, CLEANUP_TIMEOUT);

    // Show QR and download link
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>QR Code Generated</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #f5f5f5;
            }
            .container {
              text-align: center;
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              max-width: 500px;
              width: 100%;
            }
            h2 {
              color: #333;
              margin-bottom: 1.5rem;
              word-break: break-all;
            }
            .qr-image {
              max-width: 300px;
              width: 100%;
              height: auto;
              margin: 1rem 0;
              border: 1px solid #eee;
              padding: 10px;
            }
            .actions {
              margin-top: 1.5rem;
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }
            .btn {
              display: inline-block;
              padding: 0.75rem 1.5rem;
              text-decoration: none;
              border-radius: 4px;
              font-size: 1rem;
              transition: all 0.3s;
            }
            .btn-download {
              background-color: #4CAF50;
              color: white;
            }
            .btn-download:hover {
              background-color: #45a049;
            }
            .btn-another {
              background-color: #f5f5f5;
              color: #333;
              border: 1px solid #ddd;
            }
            .btn-another:hover {
              background-color: #e9e9e9;
            }
            .note {
              margin-top: 1.5rem;
              color: #666;
              font-size: 0.9rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>QR Code for:<br>${url}</h2>
            <img src="/${fileName}" class="qr-image" />
            
            <div class="actions">
              <a href="/${fileName}" download class="btn btn-download">Download QR Code</a>
              <a href="/" class="btn btn-another">Generate Another QR Code</a>
            </div>
            
            <p class="note">(Note: QR code will be automatically deleted in 5 minutes)</p>
          </div>
        </body>
        </html>
      `);
  } catch (err) {
    console.error(err);
    res.send(`
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: #d32f2f;">Error generating QR code</h2>
          <a href="/" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 1.5rem; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Try Again</a>
        </div>
      `);
  }
});

// Ensure the /public directory exists
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
