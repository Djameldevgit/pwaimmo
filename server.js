require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const SocketServer = require('./socketServer')
const { ExpressPeerServer } = require('peer')
const path = require('path')
const { autoUnblockUsers } = require('./controllers/autoUnBlockUser')
const webPush = require('web-push')
const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
 
const http = require('http').createServer(app)
const io = require('socket.io')(http)
io.on('connection', socket => { SocketServer(socket) })
ExpressPeerServer(http, { path: '/' })

// Routes (sin cambios)
app.use('/api', require('./routes/authRouter'))
app.use('/api', require('./routes/userRouter'))
app.use('/api', require('./routes/postRouter'))
app.use('/api', require('./routes/commentRouter'))
app.use('/api', require('./routes/notifyRouter')) // ✅ Tu sistema actual
app.use('/api', require('./routes/messageRouter'))
app.use('/api', require('./routes/blockUserRouter'))
app.use('/api', require('./routes/languageRouter'))
app.use('/api', require('./routes/reportRouter'))
app.use('/api', require('./routes/harramientaRouter'))
app.use('/api', require('./routes/pushRouter'));

// Configuración de MongoDB (sin cambios)
mongoose.connect(process.env.MONGODB_URL, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if (err) throw err
  console.log('Connected to MongoDB')
})
//const vapidEmail = `mailto:${process.env.VAPID_EMAIL}`; // Se construye dinámicamente

// En tu controlador (notifyCtrl.js)
 
exports.getVapidPublicKey = async (req, res) => {
  try {
    // 1. Verificar autenticación
    if (!req.user) {
      return res.status(401).json({ msg: 'No autorizado' });
    }

    // 2. Configurar claves VAPID (usa tus propias claves)
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      webPush.setVapidDetails(
        'mailto:tu-email@dominio.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
      );
    }

    // 3. Responder con la clave pública
    res.json({ 
      publicKey: process.env.VAPID_PUBLIC_KEY 
    });

  } catch (err) {
    console.error('Error en getVapidPublicKey:', err);
    res.status(500).json({ 
      msg: 'Error al obtener clave VAPID',
      error: err.message 
    });
  }
};


// 🕒 Ejecutar cada 5 minutos (sin cambios)
setInterval(autoUnblockUsers, 5 * 60 * 1000)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}

const port = process.env.PORT || 5000
http.listen(port, () => {
  console.log('Server is running on port', port)
  if (process.env.ENABLE_PUSH === 'true') {
    console.log('🔔 Notificaciones PUSH activadas')
  }
})