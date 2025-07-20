const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

exports.registrarCliente = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body;

    if (!nombre || (!email && !telefono)) {
      return res.status(400).json({ message: 'Nombre y al menos email o teléfono son obligatorios' });
    }

    // Verificar duplicado por email o teléfono
    const [existing] = await pool.query(
      'SELECT * FROM clientes WHERE email = ? OR telefono = ?',
      [email, telefono]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Este cliente ya fue registrado anteriormente' });
    }

    const id_cliente = uuidv4();

    await pool.query(
      'INSERT INTO clientes (id_cliente, nombre, email, telefono) VALUES (?, ?, ?, ?)',
      [id_cliente, nombre, email, telefono]
    );

    const token = jwt.sign({ id_cliente }, SECRET, { expiresIn: '10d' });

    res.status(201).json({
      message: 'Cliente registrado exitosamente',
      cliente: {
        id_cliente,
        nombre,
        email,
        telefono
      },
      token
    });

  } catch (error) {
    console.error('Error al registrar cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
