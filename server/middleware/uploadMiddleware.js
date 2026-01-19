const multer = require("multer");
const ApiError = require("../utils/ApiError.js");

// 1️⃣ Use memory storage (NO disk writes)
const storage = multer.memoryStorage();

// 2️⃣ File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(415, "Unsupported file type"));
  }
};

// 3️⃣ File size limit (important for cost & safety)
exports.upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

exports.multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new ApiError(413, "File size exceeds 10MB limit"));
    }

    return next(new ApiError(400, err.message));
  }

  next(err);
};
