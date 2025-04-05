const Users = require("../models/userModel");
 

const roleCtrl = {

   


    assignUserRole: async (req, res) => {

        const { role } = req.body;

        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });;
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de usuario asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },

    // Asignar un rol de superusuario al usuario
    assignSuperUserRole: async (req, res) => {

        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de superusuario asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado s' });
        }
    },

    // Asignar un rol de moderador al usuario
    assignModeratorRole: async (req, res) => {

        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de moderador asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },

    // Asignar un rol de administrador al usuario
    assignAdminRole: async (req, res) => {

        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de administrador asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },
    assignStoryRole: async (req, res) => {

        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol srory asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },
 
}


module.exports = roleCtrl