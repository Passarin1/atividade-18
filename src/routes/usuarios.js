import { Router } from "express";

import verificarAutenticacao from "../middlewares/autenticacao.js";

import {
  selectUsuario,
  selectUsuarios,
  insertUsuario,
  deleteUsuario,
  updateUsuario,
} from "../db/index.js";

const router = Router();

router.get("/usuario", async (req, res) => {
  console.log("Rota GET /usuario solicitada");
  try {
    const usuarios = await selectUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

router.get("/usuario/:id", async (req, res) => {
  console.log(`Rota GET /usuario/${req.params.id} solicitada`);
  try {
    const usuario = await selectUsuario(req.params.id);
    if (usuario.length > 0) res.json(usuario);
    else res.status(404).json({ message: "Usuário não encontrado!" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

router.post("/usuario", verificarAutenticacao, async (req, res) => {
  console.log("Rota POST /usuario solicitada");
  try {
    await insertUsuario(req.body);
    res.status(201).json({ message: "Usuário inserido com sucesso!" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

router.put("/usuario", verificarAutenticacao, async (req, res) => {
  console.log("Rota PUT /usuario solicitada");
  try {
    const usuario = await selectUsuario(req.body.id);
    if (usuario.length > 0) {
      await updateUsuario(req.body);
      res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } else res.status(404).json({ message: "Usuário não encontrado!" });
  } catch (error) {
    console.log(error);
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

router.delete("/usuario/:id", verificarAutenticacao, async (req, res) => {
  console.log("Rota DELETE /usuario solicitada");
  try {
    await deleteUsuario(req.params.id);
    res.status(200).json({ message: "Usuário excluido com sucesso!" });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || "Erro!" });
  }
});

export default router;