const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'opsvix/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
    transformation: [{ width: 1200, quality: 'auto' }],
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'opsvix/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
  },
});

const uploadProjectImages = multer({ storage: projectStorage });
const uploadAvatar = multer({ storage: avatarStorage });

module.exports = {
  cloudinary,
  uploadProjectImages,
  uploadAvatar,
};
