import express from "express";
import multer from "multer";

const router = express.Router();

// Sets up where uploaded PDFs will be stored
const upload = multer({
    dest: "uploads/"
});

// Receives the PDF sent from the frontend
router.post("/upload", upload.single("pdf"), (req, res) => {

    // Checks if a PDF was uploaded
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No PDF uploaded."
        });
    }

    // Sends a success message back to the frontend
    res.json({
        success: true,
        message: "PDF uploaded successfully!",
        file: req.file.originalname
    });

});

export default router;