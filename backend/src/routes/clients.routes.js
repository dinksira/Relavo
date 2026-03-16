const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: "Clients route placeholder" }));
router.post('/', (req, res) => res.json({ message: "Create client placeholder" }));

module.exports = router;
