const response = require("../../response");
const db = require("../../connections");
const fs = require("fs");
const path = require("path");

const upload_pdf = async (req, res) => {
    try {
        const { timestamp } = req.body;
        const file_pdf = req.file.filename;
        // console.log("ini body", req.body);
        // console.log("ini file", req.file.filename);
        const sql = `INSERT INTO pdf_file (file_pdf,  timestamp) VALUES ('${file_pdf}','${timestamp}')`;

        db.query(sql, (error, result) => {
            console.log(result);
            if (error) {
                return  res.status(400).json({
                  message: "PDF file unsuccessfully inserted",
                  error:error
              });
            } else if (result.affectedRows > 0) {
                res.status(200).json({
                    message: "PDF file successfully inserted",
                    resultaffectedRows:result.affectedRows
                });
            }
        });
    } catch (error) {
      res.status(400).json({
        message: "File harus berupa PDF",
        error:error
    });
        
    }
};
const get_pdf = async (req, res) => {
    try {
        const sql = "SELECT * FROM pdf_file";
        db.query(sql, (error, result) => {
            if (error) {
                return response(
                    500,
                    error.sqlMessage,
                    "file pdf server error",
                    res
                );
            } else {
                res.status(200).json({
                    message: result,
                });
            }
        });
    } catch (error) {
        return response(500, error.sqlMessage, "file pdf server error", res);
    }
};
const pdfController = {
    getPdf: (req, res) => {
        // Mendapatkan nama file dari parameter URL atau request body, sesuai kebutuhan
        const { fileName } = req.body;

        // Mengonstruksi path lengkap menuju file PDF
        const filePath = path.resolve(
            __dirname,
            "..",
            "..",
            "uploads",
            "pdf",
            fileName
        );

        // console.log('Absolute Path:', filePath);

        // Mengecek apakah file ada atau tidak
        fs.stat(filePath, (err, stats) => {
            if (fs.existsSync(filePath)) {
                // Mengirimkan file sebagai respons
                res.sendFile(filePath);
            } else {
                // Jika file tidak ditemukan atau bukan file, mengirim respons error 404
                res.status(404).json({
                    error: "File not found",
                    filepath: filePath,
                    err: err,
                    stat: stats,
                });
            }
        });
    },
};

const delete_pdf = (req, res) => {
    try {
        const id  = req.body.id;
        console.log("id",id);
        const sql = "DELETE FROM pdf_file WHERE id = ?";
        db.query(sql, [id], (error, result) => {
            if (error) {
                return response(
                    500,
                    error.message,
                    "Error deleting pdf file",
                    res
                );
            } else if (result.affectedRows > 0) {
              deletePdfFromFileSystem(req.body.fileName)
              return  res.status(200).json({
                file_name:req.body.fileName,
                file_id:req.body.id,
                message: "file berhasil dihapus",
            });
            } else {
              return  res.status(400).json({
                file_name:req.body.fileName,
                file_id:req.body.id,
                message: "file not found",
            });
            }
        });
        
    } catch (error) {
        return response(500, error.message, "Document server error", res);
    }
};

const deletePdfFromFileSystem = (req, res) => {
  const  fileName  = req;
  console.log(fileName);
console.log('fungsi delete system terpanggil');
const filePath = path.resolve(
  __dirname,
  "..",
  "..",
  "uploads",
  "pdf",
  fileName
);
console.log("file path",filePath);
try {
  fs.unlinkSync(filePath);
  console.log(`File ${fileName} berhasil dihapus dari sistem file.`);
} catch (err) {
  console.error(`Gagal menghapus file ${fileName} dari sistem file: ${err.message}`);
}
};

module.exports = {
    upload_pdf,
    delete_pdf,
    get_pdf,
    // read_pdf
    pdfController,
};
