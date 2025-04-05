const Users = require("../models/userModel");
 

const harramientaCtrl = {

   


    rien: async (req, res) => {

        const { harramienta } = req.body;

        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { harramienta }, { new: true });;
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de usuario asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },

    // Asignar un rol de superusuario al usuario
    telefono: async (req, res) => {

        const { harramienta } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { harramienta }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de superusuario asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado s' });
        }
    },

    // Asignar un rol de moderador al usuario
    camara: async (req, res) => {

        const { harramienta } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { harramienta }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de moderador asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },

    // Asignar un rol de administrador al usuario
    telefonocamara: async (req, res) => {

        const { harramienta } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { harramienta }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de administrador asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },
    images: async (req, res) => {

        const { harramienta } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { harramienta }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol srory asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },

    efecto1: async (req, res) => {

        const { harramienta } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { harramienta }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol srory asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },
    efecto2: async (req, res) => {

        const { harramienta } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { harramienta }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol srory asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },

 
}


module.exports = harramientaCtrl