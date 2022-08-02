import e from "express";
import Cliente from "../models/Cliente.js";

const agregarCliente =  async (req, res) => {
    const cliente = new Cliente(req.body);
    cliente.administrador = req.administrador._id;
    try {
        const clienteAlmacenado = await cliente.save();
        res.json(clienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const obtenerClientes = async (req, res) => {
    //Filto para solo ver tus propias altas a aprtir del .where() -> ... (Borrar del where para atras para mostrar todos)
    const clientes = await Cliente.find().where('administrador').equals(req.administrador);

    res.json(clientes);
};

const obtenerCliente = async (req, res) => {
    const {id} = req.params;
    const cliente = await Cliente.findById(id);

    if(!cliente) {
        return res.status(404).json({msg: 'No encontrado'});
    }

    //Limitar que solo el administrador que lo agrego pueda verlo !== se cambia por === para hacer filtrado sin administrador especifico
    if(cliente.administrador._id.toString() !== req.administrador._id.toString()) {
        return res.json({msg: 'Accion no valida'});
    }
    
    res.json(cliente);
};

const actualizarCliente = async (req, res) => {
    const {id} = req.params;
    const cliente = await Cliente.findById(id);

    if(!cliente) {
        return res.status(404).json({msg: 'No encontrado'});
    }

    //Limitar que solo el administrador que lo agrego pueda verlo !== se cambia por === para hacer filtrado sin administrador especifico
    if(cliente.administrador._id.toString() !== req.administrador._id.toString()) {
        return res.json({msg: 'Accion no valida'});
    }

    // Actualizar Cliente
    cliente.nombre = req.body.nombre || cliente.nombre;
    cliente.apellidos = req.body.apellidos || cliente.apellidos;
    cliente.email = req.body.email || cliente.email;
    cliente.fechaFinalizacion = req.body.fechaFinalizacion || cliente.fechaFinalizacion;
    cliente.curso = req.body.curso || cliente.curso;

    try {
        const clienteActualizado = await cliente.save();
        res.json(clienteActualizado);
    } catch (error) {
        console.log(error);
    }
};   

const eliminarCliente = async (req, res) => {
    const {id} = req.params;
    const cliente = await Cliente.findById(id);

    if(!cliente) {
        return res.status(404).json({msg: 'No encontrado'});
    }

    //Limitar que solo el administrador que lo agrego pueda verlo !== se cambia por === para hacer filtrado sin administrador especifico
    if(cliente.administrador._id.toString() !== req.administrador._id.toString()) {
        return res.json({msg: 'Accion no valida'});
    }

    try {
        await cliente.deleteOne();
        res.json({msg: 'Paciente eliminado'});
    } catch (error) {
        console.log(error);
    }
};

export {
    agregarCliente,
    obtenerClientes,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente,
}