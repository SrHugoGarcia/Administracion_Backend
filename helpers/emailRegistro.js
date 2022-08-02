import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { email, nombre, token } = datos;

      //* Enviar el email

      const info = await transporter.sendMail({
          from: "IKTAN TRAINING",
          to: email,
          subject: 'Comprueba tu cuenta en IKTAN Training',
          text: 'Comprueba tu cuenta en IKTAN Training',
          html: `<p>Hola: ${nombre}, comprueba tu cuenta en IKTAN Training.</p>
                 <p>Tu cuenta ya esta lista, solo debes confirmar tu cuenta en el siguiente enlace:
                 <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>

                 <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
          `
      });

      console.log("Mensaje Enviado: %s", info.messageId);

}

export default emailRegistro;