import express  from "express";
const router = express.Router();
import {
    agregarCliente, 
    obtenerClientes,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente,
} from "../controllers/clienteController.js";
import checkAuth from "../middleware/authMiddleware.js"

router.
    route('/')
    .post(checkAuth, agregarCliente)
    .get(checkAuth, obtenerClientes);

router
    .route('/:id')
    .get(checkAuth, obtenerCliente)
    .put(checkAuth, actualizarCliente)
    .delete(checkAuth, eliminarCliente);

export default router;