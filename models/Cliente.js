import mongoose from 'mongoose';

const clienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellidos: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    fechaFinalizacion: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    curso: {
        type: String,
        required: true,
    },
    administrador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Administrador',
    },
}, {
    timestamps: true,
});

const Cliente = mongoose.model('Cliente', clienteSchema)

export default Cliente;