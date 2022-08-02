import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import conectarDB from "./config/db.js";
import administradorRoutes from "./routes/administradorRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";


//? middleware's de next

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function (origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1 ) {
            //El origien del Request esta permitido
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'))
        }
    },
};

app.use(cors(corsOptions));

app.use('/api/administradores', administradorRoutes);
app.use('/api/clientes', clienteRoutes);


const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

