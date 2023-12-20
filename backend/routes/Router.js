const express = require("express");
const router = express();

// rota de teste
router.get("/", (req, res) => {
   res.send("API Working!")
})

module.exports = router