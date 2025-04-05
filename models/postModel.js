const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({


  category: {
    type: String,

  },
  subCategory: {
    type: String,

  },

  Vente: {
    type: String,

  },
  Location: {
    type: String,

  },
  Location_Vacances: {
    type: String,

  },
  Echange: {
    type: String,

  },
  Cherche_Location: {
    type: String,
  },

  Cherche_Achat: {
    type: String,
  },

  title: {
    type: String,
  },

  description: {
    type: String,
  },

  price: {
    type: String,
  },

  unidaddeprecio: {
    type: String,
  },

  oferta: {
    type: String,
  },

  change: {
    type: String,

  },
  wilaya: {
    type: String,

  },
  commune: {
    type: String,

  },

  quartier: {
    type: String,

  },
  email: {
    type: String,

  },
  telefono: {
    type: String,

  },
  contadordevisitas: {
    type: Boolean,

  },
  informacioncontacto: {
    type: Boolean,

  },
  activarcomentarios: {
    type: Boolean,

  },
  duraciondelanuncio: {
    type: String,

  },

  attributes: {
    type: Object, // Cambiar Map por Object
    default: {}   // Establecer un valor predeterminado
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente',
  },

  images: {
    type: Array,
    required: true
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
  user: { type: mongoose.Types.ObjectId, ref: 'user' }
}, {
  timestamps: true
})

module.exports = mongoose.model('post', postSchema)