import path from 'path';
import multer from 'multer';
import fs from 'fs';

const PRODUCT_UPLOADS_FOLDER_NAME = 'fotosProductos';
const PRODUCT_UPLOADS_DIR = path.join(process.cwd(), PRODUCT_UPLOADS_FOLDER_NAME); 

if (!fs.existsSync(PRODUCT_UPLOADS_DIR)) {
    fs.mkdirSync(PRODUCT_UPLOADS_DIR, { recursive: true });
}

const PRODUCT_STORAGE = multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, PRODUCT_UPLOADS_DIR); 
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        cb(null, `${timestamp}-${baseName}${extension}`);
    }
});

const uploadProduct = multer({ storage: PRODUCT_STORAGE }); 


export const uploadFotosProducto = uploadProduct.array('fotos', 10);