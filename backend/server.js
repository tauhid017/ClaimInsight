import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import PDFDocument from "pdfkit";
import mongoose from "mongoose";
// import input from "./models/input.js";
const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// ✅ Mongoose connection
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/claimDB");
  console.log("MongoDB connected");
}

// ------------------- MULTER CONFIG -------------------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = Date.now() + ext;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

// ------------------- UPLOAD API -------------------
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));
    formData.append("damage_type", req.body.damage_type || "Unknown");

    console.log("Forwarding file to Flask:", req.file.filename);

    const response = await axios.post("http://localhost:5000/upload", formData, {
      headers: formData.getHeaders(),
    });

    fs.unlinkSync(req.file.path); // Remove file after forwarding
    res.json(response.data);
  } catch (err) {
    console.error("Axios error:", err.message);

    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }

    res.status(500).json({ error: "Failed to connect to Flask service." });
  }
  const newInput = new input({
    damage_type: req.body.damage_type,
    img: req.file.path,
  });
  await newInput.save();
});

// ------------------- PDF GENERATION -------------------
app.post("/api/download-pdf", (req, res) => {
  const { description = "", damage_type = "", image_data } = req.body;

  const filename = `loss_description_${String(damage_type || "report")
    .replace(/\s+/g, "_")}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(18).text("Professional Loss Description", { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(description || "No description provided.");

  if (image_data) {
    const matches = String(image_data).match(/^data:(image\/\w+);base64,(.+)$/);
    let imgBuffer;

    if (matches) imgBuffer = Buffer.from(matches[2], "base64");
    else {
      try {
        imgBuffer = Buffer.from(String(image_data), "base64");
      } catch {}
    }

    if (imgBuffer) {
      try {
        doc.addPage();
        doc.image(imgBuffer, { fit: [500, 400], align: "center", valign: "center" });
      } catch {}
    }
  }

  doc.end();
});

// ------------------- DOWNLOAD SAVED PDF -------------------
app.get("/api/download-pdf", (req, res) => {
  const file = req.query.filename;
  if (!file) return res.status(400).send("filename query is required");

  const safeName = path.basename(String(file));
  const filePath = path.join(process.cwd(), "uploads", safeName);

  if (!fs.existsSync(filePath)) return res.status(404).send("file not found");

  res.download(filePath);
});

// ------------------- START SERVER -------------------
app.listen(3001, () => console.log("✅ Node server running on port 3001"));
