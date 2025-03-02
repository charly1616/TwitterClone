import Notification from "../models/notification.model";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ to: userId}). populate({
            path: "from",
            select: "username profileImg"
        })

        await Notification.updateMany({to:userId}, {read: true});

        res.status(200).json(notifications);

    } catch (error) {
        console.log("Error en la funcion de obtener notificaciones ", error.message);
        res.status(500).json({error: "Error de servidor interno"})
    }
}

export const deleteNotifications = async (req, res) => {
    try {
        const userId = rew.user._id;
        await Notification.deleteMany({to: userId});

        res.status(200).json({message: "Notificaciones eliminadas exitosamente"})
    } catch (error) {
        console.log("Error en la funcion de eliminar notificaciones", error.message);
        res.status(500).json({error: "Error interno del servidor"})
    }
} 
