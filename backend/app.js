require("dotenv").config();

const express = require("express");
const app = express();

const path = require("path");
const cors = require("cors");

const port = process.env.PORT

// config respostas em 'JSON' e/ou 'form data'
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// resolvendo problemas com CORS
app.use(cors({credentials: true, origin: "http://localhost:3000"}))

// Diretório de uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))

// Conexão com Banco de Dados
require("./confg/bd.js")

// routes
const router = require("./routes/Router");
app.use(router)

app.listen(port, () => {
   console.log(`App rodando na porta ${port}`)
})