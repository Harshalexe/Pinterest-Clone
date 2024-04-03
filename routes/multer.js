const multer =require("multer")
const {v4: uuidv4}= require("uuid")
const path = require("path")

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./public/images/upload")
    },
    filename: function (req,file,cb){
        const uniqueFilename =uuidv4()
        cb(null,uniqueFilename+path.extname(file.originalname))
    }
})

const pics = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./public/images/profilepic")
    },
    filename: function (req,file,cb){
        const uniqueFilename =uuidv4()
        cb(null,uniqueFilename+path.extname(file.originalname))
    }
})


const upload = multer({storage:storage})
const upload1= multer({storage :pics})
module.exports = { upload, upload1 };