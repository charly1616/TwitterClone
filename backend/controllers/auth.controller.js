
import {generateTokenAndSetCookie} from '../libs/utils/generateToken.js';
import User from "../models/user_model.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect){
            return res.status(400).json({error: "Nombre o contraseña invalido"})
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        })

    } catch (error) {
        console.log("Error en el controlador de login", error.message);
        res.status(500).json({error:"Error interno del servidor"})
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user)
    } catch (error) {
        console.log("Error en el controlador de GetMe ", error.message);
        res.status(500).json({error: "Error de servidor interno "})
    }
}

export const logout = async (req, res) =>{
    try {
        //res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({message: "Se cerro sesion exitosamente"})
    } catch (error) {
        console.log("Error en el controlador del error", error.message);
        res.status(500).json({error: "Error del servidor interno"})
    }
}

export const signup = async (req, res) =>{
    try {
        const {fullName, username, email, password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)){
            console.log(req.body)
            return res.status(400).json({error:`Formato de email invalido ${req.body}`})
        }

        const existingUser = await User.findOne({username});
        if (existingUser){
            return res.status(400).json({error:"Usuario ya registrado"});
        }

        const existingEmail = await User.findOne({email});
        if (existingEmail){
            return res.status(400).json({error:"Ya existe un email similar"});
        }

        if (password.length < 6){
            return res.status(400).json({error:"Contraseña es muy corta"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        })

        if (newUser){
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			});
        } else {
            res.status(400).json({error:"Error al crear el usuario"});
        }
    } catch (error) {
        console.log("Error en el controlador de registro ", error.message);
        res.status(500).json({error: "Error interno del servidor"});
    }
}



