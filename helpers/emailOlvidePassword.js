import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {

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
          subject: 'Reestablece tu Password de IKTAN Training',
          text: 'Reestablece tu Password de IKTAN Training',
          html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password.</p>

                 <p>Sigue el siguiente enlace para generar un nuevo password: 
                 <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a> </p>

                 <p>Si tu no generaste esta acción, puedes ignorar este mensaje</p>
          `
      });

      console.log("Mensaje Enviado: %s", info.messageId);

}

export default emailOlvidePassword;