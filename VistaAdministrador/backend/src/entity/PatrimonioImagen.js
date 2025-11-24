"use strict";
import { EntitySchema } from "typeorm";

const PatrimonioImagen = new EntitySchema({
  name: "PatrimonioImagen",
  tableName: "patrimonio_imagenes",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    ruta: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    fechaSubida: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    patrimonioId: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    patrimonio: {
      type: "many-to-one",
      target: "Patrimonio",
      joinColumn: {
        name: "patrimonioId",
      },
      onDelete: "CASCADE",
    },
  },
  indices: [
    {
      name: "IDX_PATRIMONIO_IMAGEN_ID",
      columns: ["id"],
      unique: true,
    },
    {
      name: "IDX_PATRIMONIO_IMAGEN_PATRIMONIO_ID",
      columns: ["patrimonioId"],
    },
  ],
});

export default PatrimonioImagen;
