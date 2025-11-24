"use strict";
import User from "../entity/user.entity.js";
import Patrimonio from "../entity/patrimonio.entity.js"; // ✅ nuevo
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const count = await userRepository.count();
    if (count > 0) return;

    await Promise.all([
      // ✅ Administrador corregido
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Sebastian Ignacio Muñoz Echeverrigaray",
          rut: "19.594.938-7",
          email: "administrador2024@gmail.cl",
          password: await encryptPassword("admin1234"),
          rol: "administrador",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Sebastián Ampuero Belmar",
          rut: "21.151.897-9",
          email: "usuario1.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        })
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Alexander Benjamín Marcelo Carrasco Fuentes",
          rut: "20.630.735-8",
          email: "usuario2.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Pablo Andrés Castillo Fernández",
          rut: "20.738.450-K",
          email: "usuario3.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Felipe Andrés Henríquez Zapata",
          rut: "20.976.635-3",
          email: "usuario4.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Diego Alexis Meza Ortega",
          rut: "21.172.447-1",
          email: "usuario5.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
      userRepository.save(
        userRepository.create({
          nombreCompleto: "Juan Pablo Rosas Martin",
          rut: "20.738.415-1",
          email: "usuario6.2024@gmail.cl",
          password: await encryptPassword("user1234"),
          rol: "usuario",
        }),
      ),
    ]);
    console.log("* => Usuarios creados exitosamente");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

async function createPatrimonios() {
  try {
    const patrimonioRepository = AppDataSource.getRepository(Patrimonio);

    const count = await patrimonioRepository.count();
    if (count > 0) {
      console.log("* => Patrimonios ya existen, no se insertan duplicados");
      return;
    }

    const patrimoniosIniciales = [
      {
        nombre: "Fuerte Niebla",
        ubicacion: "Valdivia, Región de Los Ríos",
        descripcion: "Fortificación colonial construida en el siglo XVII.",
        tipo: "histórico",
        imagen: "",
        estado: "activo",
      },
      {
        nombre: "Parque Nacional Torres del Paine",
        ubicacion: "Magallanes",
        descripcion: "Área protegida con paisajes naturales únicos.",
        tipo: "natural",
        imagen: "",
        estado: "activo",
      },
    ];

    for (const patrimonio of patrimoniosIniciales) {
      await patrimonioRepository.save(patrimonio);
    }

    console.log("* => Patrimonios creados exitosamente");
  } catch (error) {
    console.error("Error al crear patrimonios:", error);
  }
}

export { createUsers, createPatrimonios };
