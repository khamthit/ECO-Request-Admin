const express = require('express');
const { sequelize } = require('./config/db.js');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const formtypeRoute = require('./routes/formtypeRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const userclientRoute = require('./routes/userclientRoutes');
const loadimporterRoute = require('./routes/loadimporterRoutes');
const portdischargerRoute = require('./routes/portdischargerRoutes');
const laohscodeRoute = require('./routes/laohscodeRoutes');
const origincriterionRoute = require('./routes/origincriterionRoutes');

const pathimage = "http://10.0.100.31:4481";

const app = express();

// Enable CORS for all routes and origins
app.use(cors());

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public route for user login. No token required.
app.use('/api/userAdmin', userclientRoute);
// Protected route. The authMiddleware will run first to verify the token.
app.use('/api/formtypeAdmin', authMiddleware, formtypeRoute);
app.use('/api/loadimporterAdmin', authMiddleware, loadimporterRoute);
app.use('/api/portdischargerAdmin', authMiddleware, portdischargerRoute);
app.use('/api/laohscodeAdmin', authMiddleware, laohscodeRoute);
app.use('/api/origincriterionAdmin', authMiddleware, origincriterionRoute);


//this is upload file image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store uploaded files in the 'uploads' directory
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Save file with the original name and add timestamp to avoid conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // File type validation: only accept image files
    const fileTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true); // Accept file
    } else {
      cb(new Error("Only image files are allowed!"), false); // Reject file
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
});

app.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.status(200).send({
      message: "Image uploaded successfully!",
      file: req.file, // The uploaded file information (path, filename, etc.)
      pathimage: pathimage +"/"+ req.file.filename, // Path to the uploaded file
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).send("Error uploading image");
  }
});

app.get("/uploads/:imageName", (req, res) => {
  const { imageName } = req.params;
    res.status(200).send({
      message: "Opening Image successfully!",
      pathimage: pathimage +"/"+ imageName, // Path to the uploaded file
    });
});
module.exports = app;