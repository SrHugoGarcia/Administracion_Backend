import Administrador from "../models/Administrador.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const { email, nombre } = req.body;

    //* Prevenir usuarios duplicados
    const existeUsuario = await Administrador.findOne({email});
    if(existeUsuario) {
        const error = new Error('¡Oops! Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }


    try {
        //Guardar un nuevo usurio
        const administrador = new Administrador(req.body);
        const administradorGuardado = await administrador.save();

        //* Enviar el email
        emailRegistro({
            email,
            nombre,
            token: administradorGuardado.token,
        });

        res.json({administradorGuardado});

    } catch (error) {
        console.log(error);
    }
};

const perfil = (req, res) => {
    
    const {administrador } = req
    res.json(administrador);
}

const confirmar = async (req, res) => {
    const { token } = req.params

    const usuarioConfirmar = await Administrador.findOne({token});

    if(!usuarioConfirmar) {
        const error = new Error('Oops! Token no valido');
        return res.status(404).json({msg: error.message});
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: 'Usuario Confirmado Correctamente'});

    } catch (error) {
        console.log(error);
    }
};

//? Autenticando un usuario
const autenticar =  async (req, res) => {
    const { email, password } = req.body;
    
    //* Comprobar si el usuario existe
    const usuario = await Administrador.findOne({email});

    if(!usuario) {
        const error = new Error('Oops! El Usuario no existe');
        return res.status(404).json({msg: error.message});
    }

    //* Comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        const error = new Error('Oops! Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    //* Comprobar el password
    if( await usuario.comprobarPassword(password)) {

        //Autenticar JWT
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });

    } else {
        const error = new Error('Oops! El password es incorrecto');
        return res.status(404).json({msg: error.message});
    };


};

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeUsuario = await Administrador.findOne({email});
    if(!existeUsuario) {
        const error = new Error('Oops! El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        existeUsuario.token = generarId();
        await existeUsuario.save();

        //? Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeUsuario.nombre,
            token: existeUsuario.token
        });

        res.json({msg: 'Hemos enviado un email con las intrucciones'});
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { token } = req.params

    const tokenValido = await Administrador.findOne({ token });

    if(tokenValido) {
        //* El token es valido, el usuario existe
        res.json({msg: 'Token valido y el usuario existe'});
    } else {
        const error = new Error('Oops! Token no valido');
        return res.status(400).json({msg: error.message});
    }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const administrador = await Administrador.findOne({ token });
    if(!administrador) {
        const error = new Error('Oops! Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    try {
        administrador.token = null;
        administrador.password = password;
        await administrador.save();
        res.json({msg: 'Password modificado correctamente'});
    } catch (error) {
        console.log(error);
    }
};

const actualizarPerfil = async (req, res) => {
    const administrador = await Administrador.findById(req.params.id);
    if(!administrador) {
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    const {email} = req.body
    if(administrador.email !== req.body.email) {
        const existeEmail = await Administrador.findOne({email})
        if(existeEmail){
            const error = new Error('Oops! Este Email ya Esta en Uso')
            return res.status(400).json({msg: error.message})
        }
    }

    try {
        administrador.nombre = req.body.nombre;
        administrador.email = req.body.email;
        administrador.web = req.body.web;
        administrador.telefono = req.body.telefono;

        const administradorActualizado = await administrador.save()
        res.json(administradorActualizado)
    } catch (error) {
        console.log(error)
    }
};

const actualizarPassword = async (req, res) => {
    // Leer los datos
    const {id} = req.administrador
    const {pwd_actual, pwd_nuevo} = req.body
    //Comprobar que existe el admin
    const administrador = await Administrador.findById(id);
    if(!administrador) {
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }
    //Comprobar password
    if(await administrador.comprobarPassword(pwd_actual)) {
    //Almacenar Password
        administrador.password = pwd_nuevo
        await administrador.save();
        res.json({msg: 'Password Almacenado Correctamente'})
    } else {
        const error = new Error('Oops! El Password Actual es Incorrecto')
        return res.status(400).json({msg: error.message})
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword, 
    actualizarPerfil,
    actualizarPassword
}