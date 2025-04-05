const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "post",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true, // Usuario que fue reportado
    },
    reportedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true, // Usuario que realizó la denuncia
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('report', reportSchema);
