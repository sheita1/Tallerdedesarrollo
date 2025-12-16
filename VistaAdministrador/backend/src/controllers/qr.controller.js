"use strict";

import { AppDataSource } from "../config/configDb.js";
import QrScan from "../entity/qrScan.entity.js";
import { MoreThanOrEqual } from "typeorm";

/**
 * Registrar un escaneo QR
 */
export const registrarEscaneoQR = async (req, res) => {
  try {
    const { patrimonioId } = req.body;

    if (!patrimonioId) {
      return res.status(400).json({ error: "patrimonioId es requerido" });
    }

    const repo = AppDataSource.getRepository(QrScan);
    const userAgent = req.headers["user-agent"] || "";
    const ip = req.ip;

    // ✅ 1. Detectar si es móvil
    const esMovil = /android|iphone|ipad|ipod|mobile/i.test(userAgent);
    if (!esMovil) {
      return res.json({ ok: true, ignorado: "no-es-movil" });
    }

    // ✅ 2. Evitar múltiples registros por día (IP + patrimonio)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const yaExiste = await repo.findOne({
      where: {
        patrimonioId,
        ip,
        fecha: MoreThanOrEqual(hoy)
      }
    });

    if (yaExiste) {
      return res.json({ ok: true, ignorado: "ya-registrado-hoy" });
    }

    // ✅ 3. Registrar escaneo válido
    await repo.save({
      patrimonioId,
      ip,
      userAgent
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Error registrando escaneo:", error);
    res.status(500).json({ error: "Error registrando escaneo" });
  }
};

/**
 * Obtener total de escaneos por patrimonio (ranking)
 */
export const obtenerTotalEscaneos = async (req, res) => {
  try {
    const result = await AppDataSource.query(`
      SELECT patrimonio_id AS "patrimonioId", COUNT(*) AS total
      FROM qr_scans
      GROUP BY patrimonio_id
      ORDER BY total DESC
    `);

    res.json({ ok: true, data: result });
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    res.status(500).json({ error: "Error obteniendo estadísticas" });
  }
};

/**
 * Obtener escaneos por día para un patrimonio
 */
export const obtenerEscaneosPorDia = async (req, res) => {
  try {
    const { patrimonioId } = req.query;

    if (!patrimonioId) {
      return res.status(400).json({ error: "patrimonioId es requerido" });
    }

    const result = await AppDataSource.query(
      `
      SELECT 
        TO_CHAR(DATE(fecha), 'DD/MM/YYYY') AS fecha,
        COUNT(*) AS total
      FROM qr_scans
      WHERE patrimonio_id = $1
      GROUP BY DATE(fecha)
      ORDER BY DATE(fecha) ASC
    `,
      [patrimonioId]
    );

    res.json({ ok: true, data: result });
  } catch (error) {
    console.error("Error obteniendo escaneos por día:", error);
    res.status(500).json({ error: "Error obteniendo escaneos por día" });
  }
};

/**
 * Estadísticas completas para un patrimonio
 */
export const obtenerEstadisticasQRPorPatrimonio = async (req, res) => {
  try {
    const { id } = req.params;

    const repo = AppDataSource.getRepository(QrScan);

    // Total
    const total = await repo.count({
      where: { patrimonioId: parseInt(id) }
    });

    // Por día
    const porDia = await repo
      .createQueryBuilder("scan")
      .select("TO_CHAR(DATE(scan.fecha), 'DD/MM/YYYY')", "fecha")
      .addSelect("COUNT(*)", "total")
      .where("scan.patrimonioId = :id", { id })
      .groupBy("fecha")
      .orderBy("MIN(scan.fecha)", "ASC")
      .getRawMany();

    res.json({
      ok: true,
      data: {
        total,
        porDia
      }
    });
  } catch (error) {
    console.error("Error obteniendo estadísticas QR:", error);
    res.status(500).json({ error: "Error obteniendo estadísticas QR" });
  }
};
