import roteadorLogin from "./routes/login.js";
import roteadorUsuario from "./routes/usuarios.js";

import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();                        // Instancia o Express
const port = 3000;                            // Define a porta
app.use(express.urlencoded({ extended: true }));
app.use(express.json());                      // Middleware para parsing JSON

// Rota raiz
app.get("/", (req, res) => {
  console.log("Rota GET/ solicitada");
  res.json({
    nome: "Luis Henrique",                   // Substitua pelo seu nome
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Serviço escutando na porta: ${port}`);
});
app.use(roteadorUsuario);
app.use(roteadorLogin);
