const Notifies = require('../models/notifyModel');
const Users = require('../models/userModel');
 const PushSubscription = require('../models/pushSuscriptionModel');
const webPush = require('web-push');
const notifyCtrl = {

 
    savePushSubscription: async (req, res) => {
        try {
            const { subscription } = req.body;
            if (!subscription || !subscription.endpoint || !subscription.keys) {
                return res.status(400).json({ 
                    msg: 'Datos de suscripción incompletos',
                    received: req.body // Para debug
                });
            }

            const userId = req.user._id;

            // Verificar si ya existe una suscripción para este endpoint
            const existingSubscription = await PushSubscription.findOne({ 
                endpoint: subscription.endpoint 
            });

            if (existingSubscription) {
                return res.status(400).json({ msg: 'Ya estás suscrito a las notificaciones' });
            }

            // Crear nueva suscripción
            const newSubscription = new PushSubscription({
                user: userId,
                ...subscription
            });

            await newSubscription.save();

            // Opcional: Enviar notificación de bienvenida
            try {
                const payload = JSON.stringify({
                    title: '¡Bienvenido!',
                    body: 'Ahora recibirás notificaciones importantes.',
                    icon: '/logo192.png',
                    url: '/notifications'
                });

                await webPush.sendNotification(subscription, payload);
            } catch (pushError) {
                console.error('Error enviando notificación de bienvenida:', pushError);
            }

            return res.json({ msg: 'Suscripción a notificaciones guardada exitosamente' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    // Nueva función para obtener clave pública VAPID
    // Controlador para obtener la clave pública VAPID
    getVapidPublicKey: async (req, res) => {
        try {
            // Verifica que las claves existan
            if (!process.env.VAPID_PUBLIC_KEY) {
              throw new Error('VAPID_PUBLIC_KEY no configurada en .env');
            }
            
            // Devuelve SOLO la clave pública
            res.json({ 
              publicKey: process.env.VAPID_PUBLIC_KEY 
            });
            
          } catch (err) {
            console.error('Error en /vapid-public-key:', err);
            res.status(500).json({ error: err.message });
          }
      },

    

    // Nueva función para enviar notificación push a un usuario
    sendPushNotification: async (userId, notificationData) => {
        try {
            const userSubscriptions = await PushSubscription.find({ user: userId });
            
            const sendPromises = userSubscriptions.map(async (subscription) => {
                const payload = JSON.stringify({
                    title: notificationData.title,
                    body: notificationData.body,
                    icon: notificationData.icon || '/logo192.png',
                    url: notificationData.url || '/',
                    badge: '/badge.png'
                });

                try {
                    await webPush.sendNotification({
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.keys.p256dh,
                            auth: subscription.keys.auth
                        }
                    }, payload);
                } catch (error) {
                    // Si falla, eliminar suscripción inválida
                    if (error.statusCode === 410) {
                        await PushSubscription.findByIdAndDelete(subscription._id);
                    }
                    throw error;
                }
            });

            await Promise.all(sendPromises);
            return true;
        } catch (err) {
            console.error('Error enviando notificación push:', err);
            return false;
        }
    },







    createNotify: async (req, res) => {
        try {
            const { id, recipients, url, text, content, image } = req.body

            if(recipients.includes(req.user._id.toString())) return;

            const notify = new Notifies({
                id, recipients, url, text, content, image, user: req.user._id
            })

            await notify.save()
            return res.json({notify})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
  
    
 

    removeNotify: async (req, res) => {
        try {
            const notify = await Notifies.findOneAndDelete({
                id: req.params.id, url: req.query.url
            })
            
            return res.json({notify})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getNotifies: async (req, res) => {
        try {
            const notifies = await Notifies.find({recipients: req.user._id})
            .sort('-createdAt').populate('user', 'avatar username')
            
            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    isReadNotify: async (req, res) => {
        try {
            const notifies = await Notifies.findOneAndUpdate({_id: req.params.id}, {
                isRead: true
            })

            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteAllNotifies: async (req, res) => {
        try {
            const notifies = await Notifies.deleteMany({recipients: req.user._id})
            
            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}


module.exports = notifyCtrl