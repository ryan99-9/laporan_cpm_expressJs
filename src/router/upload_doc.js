const express = require("express");
const router = express.Router();

const { upload_pdf, delete_pdf, get_pdf,pdfController} = require("../controller/upload_docC");
router.post("/get_pdf",get_pdf)
router.post('/pdf', pdfController.getPdf);

const { uploadPDF} = require("../middleware/auth_doc");

router.post("/delete_pdf", delete_pdf)
router.post("/upload_pdf", uploadPDF("file_pdf"), upload_pdf);
// router.get("/read_pdf", read_pdf)

module.exports = router;
