import mongoose from "mongoose";
import { Notificacion } from "../../entities/notificacion.js";

 const NotificacionSchema = new mongoose.Schema(
    {
        usuarioDestino:{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true,default:undefined },
        mensaje:{type:String, required: true, trim:true},
        fechaAlta:{type:Date,required:true,default:Date.now()},
        fueLeida:{type:Boolean,required:false,default:false},
        fechaLeida:{type:Date, required:false,default:undefined}
    },
    { collection: "notificaciones" }
);

NotificacionSchema.loadClass(Notificacion)

export default mongoose.model("Notificacion",NotificacionSchema);
