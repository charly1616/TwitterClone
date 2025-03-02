import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";


export const createPost = async (req, res) => {
    try {
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({message:"Usuario no encontrado"})
        if (!text && !img) return res.status(400).json({error: "El post debe tener imagen o texto"})
        if (img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img,
        });

        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        
        console.log("Error en el controlador para crear posts ", error)
        res.status(500).json({error: "Error interno del servidor"});
    }
}


export const deletePost = async (req, res) => {
    try {
        const post  =await Post.findById(req.params.id);
        if (!post){
            return res.status(404).json({error: "Post no encontrado"})
        }

        if (post.user.toString() != req.user._id.toString()){
            return res.status(401).json({error: "No estas autorizado para eliminar este post"})
        }

        if (post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Post eliminado exitosamente"})

    } catch (error) {
        console.log("Error en el eliminador de posts ", error);
        res.status(500).json({error: "Error interno del servidor"})
    }
}


export const commentOnPost = async (req, res) => {
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!texy){
            return res.status(400).json({error: "Texto es requerido"})
        }

        const post = await Post.findById(postId);

        if (!post){
            return res.status(404).json({error: "Error interno de servidor"})
        }

        const comment = {user: userId, text}
        post.comments.push(comment)
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.log("Error en comentario de post ", error)
        res.status(500).json({error: "error de servidor interno"})
    }
}


export const likeUnlikePost = async (req, res) => {
    try {
        const userId = req.user._id;
        const {id: postId} = req.params;

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({error: "Post no encontrado"})
        
        const userLikedPost = post.likes.includes(userId)
        if (userLikedPost){
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}})

            const updatedLikes = post.likes.filter((id)=>id.toString() !== userId.toString())
            res.status(200).json(updatedLikes);
        } else {
            post.likes.push(userId);
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like",
            })
            await notification.save();

            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes)
        }

    } catch (error) {
        console.log("error al dar like  ", error);
        res.status(500).json({error: "Error interno del servidor"})
    }
}


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

        if (posts.length === 0) return res.status(200).json([])

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error en obtener todos los posts ", error);
        res.status(500).json({error: "Error interno del servidor"})
    }
}


export const getLikedPosts = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({error: "Usuario no encontrado"});

        const likedPosts = await Post.find({_id: {$in: user.likedPosts}})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });
        
        res.status(200).json(likedPosts)
    } catch (error) {
        console.log("Error en el controlador de obtener likes en post ", error)
        res.status(500).json({error: "Error interno del servidor"})
    }
}


export const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({error: "Usuario no encontrado"});

        const following = user.following;

        const feedPosts = await Post.find({user: {$in: following}})
            .sort({createdAt:  -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });
        
        res.status(200).json(feedPosts)
    } catch (error) {
        console.log("Error en el obtener post del seguido ", error);
		res.status(500).json({ error: "Internal server error" });
    }
}


export const getUserPosts = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        if (!user) return res.status(404).json({error: "Usuario no encontrado"});

        const posts = await Post.find({ user: user._id})
            .sort({createdAt: -1})
            .populate({
                path: "user",
                select: "-password"
            })
            .populate({
                path: "comments.user",
                select: "-password"
            });
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error en obtener posts de usuario: ", error);
		res.status(500).json({ error: "Internal server error" });
    }
}



