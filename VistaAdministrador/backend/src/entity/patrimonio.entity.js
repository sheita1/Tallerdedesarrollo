"use strict";
import { EntitySchema } from "typeorm";

const PatrimonioSchema = new EntitySchema({
  name: "Patrimonio",
  tableName: "patrimonios",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    ubicacion: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    descripcion: {
      type: "text",
      nullable: true,
    },
    tipo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    // ✅ Campo para guardar la ruta de la imagen PNG
    imagen: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    estado: {
      type: "varchar",
      length: 50,
      default: "activo",
      nullable: false,
    },
    visibleEnTurismo: {
      type: "boolean",
      default: true,
      nullable: false,
    },
    fechaRegistro: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    updatedAt: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
      nullable: false,
    },
  },
  indices: [
    {
      name: "IDX_PATRIMONIO_ID",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_PATRIMONIO_NOMBRE",
      columns: ["nombre"],
    },
  ],
});

export default PatrimonioSchema;
