const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, maxlength: 25, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
    },
    role: {
        type: String,
        enum: ['story', 'user', 'superuser', 'moderador', 'admin'],
        default: 'user'
    },
    harramienta: {
        type: String,
        enum: ['telefono', 'camara', 'telefonocamara','images', 'efecto1', 'rien', 'efecto2', null],
        default: 'rien',
        required: false
    },
    
    location: { 
        lat: { type: Number, required: false }, 
        lng: { type: Number, required: false }
      },

    pushSubscription: {
        endpoint: String,
        keys: {
            p256dh: String,
            auth: String
        }
    },
    mobile: { type: String, default: '' },
    address: { type: String, default: '' },
    story: { type: String, default: '', maxlength: 200 },
    website: { type: String, default: '' },
    followers: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    saved: [{ type: mongoose.Types.ObjectId, ref: 'user' }],

    language: { type: String, enum: ['en', 'fr', 'ar', 'es'], default: 'ar' },
    
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: null },
    post: [{ type: mongoose.Types.ObjectId, ref: 'post' }],
    report: [{ type: mongoose.Types.ObjectId, ref: 'report' }],
    
    likesGiven: { type: Number, default: 0 },
    likesReceived: { type: Number, default: 0 },
    commentsMade: { type: Number, default: 0 },
    commentsReceived: { type: Number, default: 0 },
    
    esBloqueado: { type: Boolean, default: false },

}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)
