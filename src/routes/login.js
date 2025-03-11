import { Router } from "express";
import jwt from "jsonwebtoken";
import { autenticarUsuario } from "../db/index.js"; // Certifique-se de que esse caminho está correto
import { verificarAutenticacao } from "../middlewares/autenticacao.js"; // Se houver um middleware para verificação

const router = Router();

// Rota de login para autenticar o usuário
router.post("/login", async (req, res) => {
  console.log("Rota POST /login solicitada");
  try {
    // Verifica as credenciais do usuário
    const usuario = await autenticarUsuario(req.body.email, req.body.senha);
    if (usuario !== undefined) {
      // Gera o token JWT com as informações do usuário
      const token = jwt.sign(
        { user: usuario.id, acesso: usuario.acesso }, 
        process.env.SECRET, // Usando uma variável de ambiente para a chave secreta
        { expiresIn: "1h" } // Token expira em 1 hora
      );
      // Retorna o token no formato JSON
      res.status(200).json({ token });
    } else {
      // Caso as credenciais estejam incorretas
      res.status(404).json({ message: "Usuário/Senha incorretos!" });
    }
  } catch (error) {
    // Se ocorrer um erro, retorna o erro
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

// Rota de autenticação (verifica se o token é válido)
router.get("/auth", verificarAutenticacao, async (req, res) => {
  console.log("Rota GET /auth solicitada");
  try {
    // Após a autenticação, retorna o ID do usuário
    res.status(200).json({ user: `${req.userId}` });
  } catch (error) {
    // Se ocorrer um erro, retorna o erro
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

export default router;
