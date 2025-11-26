"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, DB_HOST, PASSWORD } from "./configEnv.js";

import UserSchema from "../entity/user.entity.js";
import PatrimonioSchema from "../entity/patrimonio.entity.js";
import PatrimonioImagen from "../entity/PatrimonioImagen.js";
import QrScanSchema from "../entity/qrScan.entity.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,          // ✅ aquí va el host de la BD
  port: 5432,
  username: DB_USERNAME,
  password: PASSWORD,
  database: DATABASE,
  entities: [
    UserSchema,
    PatrimonioSchema,
    PatrimonioImagen,
    QrScanSchema, 
  ],
  synchronize: true,
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos!");
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}
