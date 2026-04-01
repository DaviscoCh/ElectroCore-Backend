const nodemailer = require('nodemailer');

// Configuración del transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  // contraseña de aplicación, no la real
    },
    tls: {
        rejectUnauthorized: false  // ← agrega esta línea
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

exports.enviarConfirmacionPedido = async ({ correo, nombres, numero_pedido, total, items }) => {
    const itemsHTML = items.map(item => `
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.nombre}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:center;">${item.cantidad}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:right;">$${parseFloat(item.precio).toFixed(2)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:right;">$${parseFloat(item.subtotal).toFixed(2)}</td>
        </tr>
    `).join('');

    await transporter.sendMail({
        from: `"ElectroCore" <${process.env.EMAIL_USER}>`,
        to: correo,
        subject: `✅ Pedido ${numero_pedido} confirmado`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #0a0c10; padding: 30px; text-align: center;">
                    <h1 style="color: #00ffe0; margin: 0;">ElectroCore</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2>¡Gracias por tu compra, ${nombres}!</h2>
                    <p>Tu pedido <strong>${numero_pedido}</strong> ha sido recibido.</p>
                    <table style="width:100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background:#f0f0f0;">
                                <th style="padding:8px; text-align:left;">Producto</th>
                                <th style="padding:8px;">Cant.</th>
                                <th style="padding:8px;">Precio</th>
                                <th style="padding:8px;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>${itemsHTML}</tbody>
                    </table>
                    <p style="text-align:right; font-size:1.2rem;">
                        <strong>Total: $${total.toFixed(2)}</strong>
                    </p>
                </div>
                <div style="padding: 15px; text-align: center; color: #999; font-size: 12px;">
                    © 2026 ElectroCore
                </div>
            </div>
        `
    });
};