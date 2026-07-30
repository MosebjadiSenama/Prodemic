import express from "express";
import multer from "multer";

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post(
    "/upload",
    upload.single("pdf"),
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No PDF uploaded."
            });
        }

        res.json({
            success: true,
            message: "PDF uploaded successfully!",
            file: req.file.originalname
        });

    }
);

export default router;