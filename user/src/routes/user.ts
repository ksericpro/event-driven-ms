import express from "express";
import UserController from "../controllers/user";

const router = express.Router();

const controller = new UserController();

router.get("/ping", async (_req, res) => {
  const response = await controller.getMessage();
  return res.send(response);
});

router.post("/login", async (_req, res) => {
  const { email, password } = _req.body;
  const response = await controller.login(email, password);
  console.log(`status=${controller.getStatus()}`);
  //console.log(typeof(controller.getStatus()))
  const status_code = controller.getStatus();
  return res.status(status_code?status_code:500).send(response);
});

router.post("/register", async (_req, res) => {
  const { email, password } = _req.body;
  const response = await controller.register(email, password);
  console.log(`status=${controller.getStatus()}`);
  const status_code = controller.getStatus();
  return res.status(status_code?status_code:500).send(response);
});

export default router;