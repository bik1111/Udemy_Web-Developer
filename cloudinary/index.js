const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
    //환경변수 이름 지정
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_KEY,
    //계정과 cloudinary 인스턴스 연결.
    api_secret : process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats : ['jpeg', 'png', 'jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}