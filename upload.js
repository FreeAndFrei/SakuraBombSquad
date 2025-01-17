const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// 设置文件上传的存储方式和文件名
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');  // 设置上传目录
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + uuidv4();
        const extension = path.extname(file.originalname);  // 获取文件扩展名
        cb(null, uniqueSuffix + extension);  // 最终文件名
    }
});

// 设置文件大小限制：50MB
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 最大文件大小为 50MB
    }
});  // 假设上传的字段是 'attachment'

module.exports = upload;
