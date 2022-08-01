const Role = require("../models/role");
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"];
    try {
        if (!token) return res.status(403).json({error: "No se proporcionó token"});
        
        const decoded = jwt.verify(token, process.env.SECRET);
        
        req.userId = decoded.id;

        const user = await User.findById(req.userId);

        if(!user) return res.status(404).json({error: "Usuario no encontrado"});

        next();
    } catch (err) {
        console.log(object);
        return res.status(500).json({err});
    }
};

exports.isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userId);
    const roles = await Role.find({_id: {$in: user.roles}})

    for (const rol of roles) {
        if(rol.name === "admin") {
            next();
            return;
        }
    }

    return res.status(403).json({error: "No tienes permisos de administrador"});
};