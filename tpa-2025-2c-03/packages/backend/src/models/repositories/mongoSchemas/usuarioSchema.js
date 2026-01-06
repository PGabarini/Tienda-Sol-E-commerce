import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    tipo: {
        type: String,
        enum: ['COMPRADOR', 'VENDEDOR', 'ADMIN'],
        default: 'VENDEDOR'
    },
    fechaDeAlta: {
        type: Date,
        default: Date.now
    },
    fotoUrl: {          
        type: String,
        default: "/uploads/userDefault.jpg"
    }
});

export default mongoose.model('Usuario', usuarioSchema);
