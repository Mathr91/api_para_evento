const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const clientesRoutes = require('./routes/clientes.routes');
app.use('/api/clientes', clientesRoutes);
app.use('/api', require('./routes/interes.routes'));
app.use('/api', require('./routes/auth.routes'));
app.use('/api', require('./routes/usuario.routes'));



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
