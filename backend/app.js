require("dotenv").config(); 
const port = process.env.PORT;

const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// resolver problemas de CORS
app.use(cors({credentials: true, origin: "http://localhost:3000" }))

// Diretório de upload
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

// Conexão com Banco de Dados
require("./config/db.js")

// routes
const router = require("./routes/Router");
app.use(router);


app.listen(port, () => {
   console.log(`App rodando na porta ${port}`);
})
