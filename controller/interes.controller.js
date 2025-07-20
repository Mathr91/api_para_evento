const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

const SECRET = process.env.JWT_SECRET;

exports.registrarInteres = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const { id_stand } = req.body;

    if (!authHeader || !authHeader.startsWith('Bearer ') || !id_stand) {
      return res.status(400).json({ message: 'Authorization y id_stand son requeridos' });
    }

    const tokenCliente = authHeader.split(' ')[1];

    // Validar y decodificar el JWT del cliente
    let payload;
    try {
      payload = jwt.verify(tokenCliente, SECRET);
    } catch (error) {
      return res.status(401).json({ message: 'QR inválido o expirado' });
    }

    const id_cliente = payload.id_cliente;

    // Registrar el interés
    await pool.query(
      `INSERT INTO intereses (id_cliente, id_stand)
       VALUES (?, ?)`,
      [id_cliente, id_stand]
    );

    res.status(201).json({ message: 'Interés registrado exitosamente' });

  } catch (error) {
    console.error('Error al registrar interés:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
