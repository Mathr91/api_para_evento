const pool = require('../db/connection');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

exports.registrarUsuario = async (req, res) => {
  try {
    const { email, password, id_rol, id_organizacion } = req.body;

    if (!email || !password || !id_rol) {
      return res.status(400).json({ message: 'Email, contraseña e id_rol son requeridos' });
    }

    // Verificar si ya existe el email
    const [existing] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Este email ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const id_usuario = uuidv4();

    await pool.query(
      `INSERT INTO usuarios (id_usuario, email, password, id_rol, id_organizacion)
       VALUES (?, ?, ?, ?, ?)`,
      [id_usuario, email, hashedPassword, id_rol, id_organizacion || null]
    );

    res.status(201).json({ message: 'Usuario creado exitosamente', id_usuario });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
