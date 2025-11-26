"use strict";
import { AppDataSource } from "../config/configDb.js";
import QrScan from "../entity/qrScan.entity.js";

export const registrarEscaneoQR = async (req, res) => {
  try {
    const { patrimonioId } = req.body;

    if (!patrimonioId) {
      return res.status(400).json({ error: "patrimonioId es requerido" });
    }

    const repo = AppDataSource.getRepository(QrScan);

    await repo.save({
      patrimonioId,
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Error registrando escaneo:", error);
    res.status(500).json({ error: "Error registrando escaneo" });
  }
};

export const obtenerTotalEscaneos = async (req, res) => {
  try {
    const result = await AppDataSource.query(`
      SELECT patrimonio_id, COUNT(*) AS total
      FROM qr_scans
      GROUP BY patrimonio_id
      ORDER BY total DESC
    `);

    res.json(result);
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({ error: "Error obteniendo estadísticas" });
  }
};

export const obtenerEscaneosPorDia = async (req, res) => {
  try {
    const { patrimonioId } = req.query;

    const result = await AppDataSource.query(`
      SELECT DATE(fecha) AS fecha, COUNT(*) AS total
      FROM qr_scans
      WHERE patrimonio_id = $1
      GROUP BY DATE(fecha)
      ORDER BY fecha ASC
    `, [patrimonioId]);

    res.json(result);
  } catch (error) {
    console.error("Error obteniendo escaneos por día:", error);
    res.status(500).json({ error: "Error obteniendo escaneos por día" });
  }
};
