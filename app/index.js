import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import libros_router from "./routes/libros_routes.js";
import autores_router from "./routes/autores_routes.js";
import usuarios_router from "./routes/usuarios_routes.js";
import dotenv from "dotenv";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

// Obtener el directorio actual en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error conectando a MongoDB:", err));

// Rutas
app.use("/libros", libros_router);
app.use("/autores", autores_router);
app.use("/usuarios", usuarios_router);

// Página principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// function verificarCuerpoVacio(req, res, next) {
//   console.log(req.body);
//   console.log(Object.keys(req.body));
//   if (req.method === "POST" || req.method === "PUT") {
//     if (Object.keys(req.body).length === 0) {
//       return res
//         .status(400)
//         .json({ mensaje: "El cuerpo de la peticion no puede estar vacio" });
//     }
//   }
//   next();
// }

// const solicitedPorIP = {};
// // IP
// function limitarSolicitudes(req, res, next) {
//   const ip = req.ip;
//   console.log(ip);
//   const tiempoActual = Date.now();

//   if (!solicitedPorIP[ip]) {
//     solicitedPorIP[ip] = [];
//   }

//   solicitedPorIP[ip] = solicitedPorIP[ip].filter(
//     (tiempo) => tiempo > tiempoActual - 60000
//   );

//   if (solicitedPorIP[ip].length >= 10) {
//     return res
//       .status(429)
//       .json({ mensaje: "Demasiadas solicitudes, espere un minuto porfavor" });
//   }

//   solicitedPorIP[ip].push(tiempoActual);
//   next();
// }

// app.use(limitarSolicitudes)
