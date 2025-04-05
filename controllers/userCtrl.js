const Users = require("../models/userModel");
//const axios =require('axios')
const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const userCtrl = {
    // Controlador para obtener la cuenta total de usuarios
    getUsersCount: async (req, res) => {
        try {
            const counttotal = await Users.countDocuments(); // Solo cuenta los documentos (usuarios)
            res.json({ counttotal }); // Envía la cuenta como respuesta
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },




    getActiveUsersLast24h: async (req, res) => {
        try {
            // Obtenemos usuarios que se han logueado en las últimas 24 horas
            const features = new APIfeatures(
                Users.find({ lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
                req.query
            ).paginating();

            // Ordenamos por la fecha de último inicio de sesión
            const users = await features.query
                .sort('-lastLogin')  // Ordena por el último login en lugar de 'createdAt'
                .populate("user likes", "avatar username followers");

            // Enviamos la cantidad de usuarios y la lista
            res.json({
                count: users.length, // Cantidad de usuarios obtenidos
                users // Lista de usuarios activos
            });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },



    getActiveUsersLast3h: async (req, res) => {
        try {
            // Obtenemos usuarios que se han logueado en las últimas 24 horas
            const features = new APIfeatures(
                Users.find({ lastLogin: { $gte: new Date(Date.now() - 3 * 60 * 60 * 1000) } }),
                req.query
            ).paginating();

            // Ordenamos por la fecha de último inicio de sesión
            const users = await features.query
                .sort('-lastLogin')  // Ordena por el último login en lugar de 'createdAt'
                .populate("user likes", "avatar username followers");

            // Enviamos la cantidad de usuarios y la lista
            res.json({
                count: users.length, // Cantidad de usuarios obtenidos
                users // Lista de usuarios activos
            });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    
  getUsers : async (req, res) => {
    try {
        const { filter } = req.query; // Recibimos el filtro desde el frontend

        // Base query sin filtros
        let query = Users.find();

        // Aplicar paginación
        const features = new APIfeatures(query, req.query).paginating();

        // Obtener la lista de usuarios
        let users = await features.query
        .populate({
            path: "user", // Rellena el campo "user"
            select: "avatar username followers following esBloqueado" // Selecciona los campos que necesitas
          })
          .populate("likes", "avatar username followers following esBloqueado ") // Rellena los "likes"
          .populate({
            path: "comments",
            populate: {
              path: "user likes",
              select: "-password"
            }
          });
        // Procesar detalles de cada usuario
        const usersWithDetails = await Promise.all(users.map(async (user) => {
            const posts = await Posts.find({ user: user._id }).sort('-createdAt');
            const totalLikesReceived = posts.reduce((total, post) => total + post.likes.length, 0);
            const totalLikesDados = posts.reduce((total, post) => total + post.likes.length, 0);
            const totalCommentsReceived = posts.reduce((total, post) => total + post.comments.length, 0);
            const totalFollowers = user.followers.length;
            const totalFollowing = user.following.length;
            const likesGiven = await Posts.countDocuments({ likes: user._id });
            const commentsMade = await Comments.countDocuments({ user: user._id });

            return {
                ...user.toObject(),
                posts,
                totalLikesReceived,
                totalLikesDados,
                totalCommentsReceived,
                totalFollowers,
                totalFollowing,
                likesGiven,
                commentsMade
            };
        }));

        // Aplicar filtros de ordenación
        switch (filter) {

            case "totalFollowers":
                usersWithDetails.sort((a, b) => b.users.length - a.users.length);
                case "totalFollowing":
                    usersWithDetails.sort((a, b) => b.users.length - a.users.length);
    
            case "mostPosts":
                usersWithDetails.sort((a, b) => b.posts.length - a.posts.length);
                break;
            case "mostLikesDados":
                usersWithDetails.sort((a, b) => b.totalLikesDados - a.totalLikesDados);
                break;
                case "mostLikes":
                    usersWithDetails.sort((a, b) => b.totalLikesReceived - a.totalLikesReceived);
                    break;

            case "mostReports":
                usersWithDetails.sort((a, b) => b.reportCount - a.reportCount);
                break;
            case "recentLogins":
                usersWithDetails.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));
                break;
            default:
                usersWithDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Default: usuarios recientes
        }

        // Enviar la respuesta
        res.json({
            msg: 'Success!',
            result: usersWithDetails.length,
            users: usersWithDetails
        });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
},


    searchUser: async (req, res) => {
        try {
            const query = req.query.username;

            // Utiliza una expresión regular insensible a mayúsculas y minúsculas
            const regex = new RegExp(query, 'i');

            const users = await Users.find({ username: { $regex: regex } })
                .limit(10)
                .select("username avatar");

            res.json({ users });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
/*
    getUser: async (req, res) => {
        // Manejo de headers con valores por defecto
        const upgradeInsecureRequests = req.headers['upgrade-insecure-requests'] || 'No data';
        const host = req.headers['host'] || 'No host';
        const cookies = req.headers['cookie'] || 'No cookies';
        const cacheControl = req.headers['cache-control'] || 'No cache control';
        const xForwardedFor = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const acceptLanguage = req.headers['accept-language'] || 'No language';
        const referer = req.headers['referer'] || 'No referer';
        const authHeader = req.headers['authorization'] || 'No authorization';
        const contentType = req.headers['content-type'] || 'No content type';
        const accept = req.headers['accept'] || 'No accept';
        const userAgent = req.headers['user-agent'] || 'No user agent';
    
        
        try {
            const user = await Users.findById(req.params.id).select('-password')
                .populate("followers following", "-password");
            if (!user) return res.status(400).json({ msg: "User does not exist." });
    
            res.json({ user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    */
    

   
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id)
            .select('-password')
            .populate("followers following", "esBloqueado")
            .populate({
                path: "blockData",
                match: { esBloqueado: true },  // Solo buscar datos de bloqueo si es bloqueado
                select: "esBloqueado motivo fechaBloqueo username avatar email"
            });
        
    
            if (!user) return res.status(400).json({ msg: "User does not exist." });
    
            res.json({ user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    
    

    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username}})
            .limit(10).select(" username avatar")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
   
    updateUser: async (req, res) => {
        try {
            const { avatar, username, mobile, address, story, website, gender } = req.body
            if(!username) return res.status(400).json({msg: "Please add your full name."})

            await Users.findOneAndUpdate({_id: req.user._id}, {
                avatar, username, mobile, address, story, website, gender
            })

            res.json({msg: "Update Success!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    follow: async (req, res) => {
        try {
            const user = await Users.find({_id: req.params.id, followers: req.user._id})
            if(user.length > 0) return res.status(500).json({msg: "You followed this user."})

            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
                $push: {followers: req.user._id}
            }, {new: true}).populate("followers following", "-password")

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: {following: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unfollow: async (req, res) => {
        try {

            const newUser = await Users.findOneAndUpdate({_id: req.params.id}, { 
                $pull: {followers: req.user._id}
            }, {new: true}).populate("followers following", "-password")

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $pull: {following: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
     
    UserRoleNoIdentificado: async (req, res) => {

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



    NoestaBloqueadocomment: async (req, res) => {

        const { bloquecomment } = req.body;

        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { bloquecomment }, { new: true });;
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de usuario asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },

    Bloqueadocomment: async (req, res) => {

        const { bloquecomment } = req.body;

        try {
            const user = await Users.findByIdAndUpdate(
                req.params.id,
                { bloquecomment },
                { new: true }
            );
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'Rol de usuario asignado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al actualizar de usuario asignado ' });
        }
    },
    Nobloqueadopost: async (req, res) => {
        const { bloquepost } = req.body;

        try {
            const user = await Users.findByIdAndUpdate(
                req.params.id,
                { bloquepost },
                { new: true }
            );
            if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

            res.json({ msg: 'usuario desbloqueado exitosamente' });
        } catch (error) {
            (error);
            res.status(500).json({ msg: 'Error al desbloquear usuario ' });
        }
    },
    
     
    suggestionsUser: async (req, res) => {
        try {
            const newArr = [...req.user.following, req.user._id]

            const num = req.query.num || 10

            const users = await Users.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password")

            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


}



module.exports = userCtrl