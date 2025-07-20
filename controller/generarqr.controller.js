const jwt = require('jsonwebtoken');

exports.generarQR = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar existencia del cliente
    const [clientes] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
    if (clientes.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const cliente = clientes[0];

    // Ya tiene QR generado
    if (cliente.qr_generado === 1) {
      return res.status(400).json({ message: 'El cliente ya tiene un QR generado', token: cliente.qr_token });
    }

    // Generar JWT firmado
    const payload = { id_cliente: cliente.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Guardar el token y marcar como generado
    await pool.query(
      'UPDATE clientes SET qr_token = ?, qr_generado = 1, qr_generado_en = NOW() WHERE id = ?',
      [token, id]
    );

    res.json({
      message: 'QR generado exitosamente',
      token
    });

  } catch (error) {
    console.error('Error al generar QR:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
