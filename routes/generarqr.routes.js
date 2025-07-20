
const { generarQR } = require('../controller/generarqr.controller');



router.post('/:id/generar-qr', generarQR);
