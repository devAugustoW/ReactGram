const express =  require("express");
const router = express();

// Rota de teste
router.get("/", (req, res) => {
   res.send("API Working!")
});

module.exports = router;