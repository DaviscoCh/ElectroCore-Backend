const nodemailer = require('nodemailer');

// Configuración del transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  // contraseña de aplicación, no la real
    }
});

// Email de bienvenida al registrarse
exports.enviarBienvenida = async ({ correo, nombres }) => {
    await transporter.sendMail({
        from: `"ElectroCore" <${process.env.EMAIL_USER}>`,
        to: correo,
        subject: '¡Bienvenido a ElectroCore! 🔌',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #0a0c10; padding: 30px; text-align: center;">
                    <h1 style="color: #00ffe0; margin: 0;">ElectroCore</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2>¡Hola, ${nombres}! 👋</h2>
                    <p>Tu cuenta ha sido creada exitosamente.</p>
                    <p>Ya puedes explorar nuestro catálogo de componentes electrónicos.</p>
                    <a href="${process.env.FRONTEND_URL}" 
                       style="background: #00ffe0; color: #000; padding: 12px 24px; 
                              text-decoration: none; font-weight: bold; display: inline-block;">
                        Ir a la tienda
                    </a>
                </div>
                <div style="padding: 15px; text-align: center; color: #999; font-size: 12px;">
                    © 2026 ElectroCore — Todos los derechos reservados
                </div>
            </div>
        `
    });
};
