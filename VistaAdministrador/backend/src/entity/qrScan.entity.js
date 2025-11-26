"use strict";
import { EntitySchema } from "typeorm";

const QrScanSchema = new EntitySchema({
  name: "QrScan",
  tableName: "qr_scans",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    patrimonioId: {
      type: "int",
      nullable: false,
    },
    fecha: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP",
      nullable: false,
    },
    ip: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    userAgent: {
      type: "text",
      nullable: true,
    },
  },
  relations: {
    patrimonio: {
      target: "Patrimonio",
      type: "many-to-one",
      joinColumn: { name: "patrimonioId" },
      onDelete: "CASCADE",
    },
  },
});

export default QrScanSchema;
