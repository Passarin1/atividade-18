import { Router } from "express";
import jwt from "jsonwebtoken";
import { autenticarUsuario } from "../db/index.js";

const router = Router();

// Middleware para verificar a autenticação do usuário
function verificarAutenticacao(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Obtendo o token do cabeçalho
  if (!token) {
    return res.status(403).json({ message: "Token não fornecido!" });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido!" });
    }
    req.userId = decoded.user; // Atribuindo o ID do usuário ao request
    next(); // Passando para o próximo middleware ou rota
  });
}

router.get("/auth", verificarAutenticacao, async (req, res) => {
  console.log("Rota GET /auth solicitada");
  try {
    res.status(200).json({ user: `${req.userId}` });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

router.post("/login", async (req, res) => {
  console.log("Rota POST /login solicitada");
  try {
    const usuario = await autenticarUsuario(req.body.email, req.body.senha);
    if (usuario !== undefined) {
      const token = jwt.sign(
        { user: usuario.id, acesso: usuario.acesso },
        process.env.SECRET,
        { expiresIn: "1h" } // Token expira em 1 hora
      );
      res.status(200).json({ token: token }); // Usando status 200 para sucesso
    } else {
      res.status(404).json({ message: "Usuário/Senha incorreta!" });
    }
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

export default router;
