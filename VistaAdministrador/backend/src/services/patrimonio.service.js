"use strict"; 
import Patrimonio from "../entity/patrimonio.entity.js"; 
import { AppDataSource } from "../config/configDb.js"; 

export async function getPatrimonioService(query) {
     try { 
        const { id, nombre } = query;
         const patrimonioRepository = AppDataSource.getRepository(Patrimonio); 
         const patrimonioFound = await patrimonioRepository.findOne({ where: [{ id }, { nombre }], }); if (!patrimonioFound) return [null, "Patrimonio no encontrado"]; 
         return [patrimonioFound, null]; } 
         catch (error) { console.error("Error al obtener el patrimonio:", error);
             return [null, "Error interno del servidor"]; } }
              export async function getPatrimoniosService() { 
                try { const patrimonioRepository = AppDataSource.getRepository(Patrimonio); 
                    const patrimonios = await patrimonioRepository.find(); 
                    if (!patrimonios || patrimonios.length === 0) return [null, "No hay patrimonios"]; 
                    return [patrimonios, null]; } catch (error) { console.error("Error al obtener los patrimonios:", error); return [null, "Error interno del servidor"]; } } 
                    
                    export async function updatePatrimonioService(query, body) { try { const { id, nombre } = query; 
                    const patrimonioRepository = AppDataSource.getRepository(Patrimonio); 
                    const patrimonioFound = await patrimonioRepository.findOne({ where: [{ id }, { nombre }], }); 
                    if (!patrimonioFound) return [null, "Patrimonio no encontrado"]; 
                    
                    const existingPatrimonio = await patrimonioRepository.findOne({ where: [{ nombre: body.nombre }], }); 
                    if (existingPatrimonio && existingPatrimonio.id !== patrimonioFound.id) {
                         return [null, "Ya existe un patrimonio con el mismo nombre"]; 
                        
                    } const dataUpdate = { nombre: body.nombre, ubicacion: body.ubicacion, descripcion: body.descripcion, tipo: body.tipo, imagen: body.imagen, estado: body.estado, updatedAt: new Date(), };
                     await patrimonioRepository.update({ id: patrimonioFound.id }, dataUpdate); 
                     const patrimonioUpdated = await patrimonioRepository.findOne({ where: { id: patrimonioFound.id }, }); 
                     if (!patrimonioUpdated) { return [null, "Patrimonio no encontrado después de actualizar"]; } 
                     return [patrimonioUpdated, null]; } catch (error) { console.error("Error al modificar el patrimonio:", error); 
                    return [null, "Error interno del servidor"]; } } 
                    
                    export async function deletePatrimonioService(query) { try { const { id, nombre } = query; 
                    const patrimonioRepository = AppDataSource.getRepository(Patrimonio); const patrimonioFound = await patrimonioRepository.findOne({ where: [{ id }, { nombre }], }); 
                    if (!patrimonioFound) return [null, "Patrimonio no encontrado"]; 
                    const patrimonioDeleted = await patrimonioRepository.remove(patrimonioFound); return [patrimonioDeleted, null]; 
                } catch (error) { console.error("Error al eliminar el patrimonio:", error); return [null, "Error interno del servidor"]; } }
                
                export async function createPatrimonioService(body) { try { const patrimonioRepository = AppDataSource.getRepository(Patrimonio); const existingPatrimonio = await patrimonioRepository.findOne({ where: { nombre: body.nombre } }); if (existingPatrimonio) { return [null, "Ya existe un patrimonio con ese nombre"]; } const nuevoPatrimonio = patrimonioRepository.create({ nombre: body.nombre, ubicacion: body.ubicacion, descripcion: body.descripcion, tipo: body.tipo, imagen: body.imagen || null, estado: body.estado, fechaRegistro: new Date() }); const patrimonioGuardado = await patrimonioRepository.save(nuevoPatrimonio); return [patrimonioGuardado, null]; 
            } catch (error) { console.error("Error al registrar el patrimonio:", error); return [null, "Error interno del servidor"]; } } // ✅ Bloque único de exportación export { getPatrimonioService, getPatrimoniosService, updatePatrimonioService, deletePatrimonioService, createPatrimonioService };
