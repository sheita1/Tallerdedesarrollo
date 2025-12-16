# VistaAdministrador/Dockerfile - CÓDIGO FINAL

# ----------------------------------------------------
# --- ETAPA 1: BUILD FRONTEND ADMINISTRADOR (REACT) ---
FROM node:18-alpine as admin_build
WORKDIR /app
# RUTA CORREGIDA: Acceso directo desde la Raíz
COPY VistaAdministrador/frontend/package*.json ./
RUN npm install
COPY VistaAdministrador/frontend /app 
# Compila (asumiendo que Vite genera la carpeta 'dist')
RUN npm run build 

# --- ETAPA 2: BUILD FRONTEND TURISTA (REACT) ---
FROM node:18-alpine as turista_build
WORKDIR /app
# RUTA CORREGIDA: Acceso directo desde la Raíz
COPY VistaTurista/package*.json ./
RUN npm install
COPY VistaTurista /app 
# Compila (asumiendo que Vite genera la carpeta 'dist')
RUN npm run build 

# --- ETAPA 3: FINAL - BACKEND Y SERVICIO (CON PERMISOS CORREGIDOS) ---
FROM node:18-alpine
WORKDIR /app

# 1. Preparar el Backend
COPY VistaAdministrador/backend/package*.json ./
RUN npm install
COPY VistaAdministrador/backend .

# 2. Copiar los Frontends compilados a la carpeta 'public' del Backend
COPY --from=admin_build /app/dist ./public/admin 
COPY --from=turista_build /app/dist ./public/turista 

# 🚨 CORRECCIÓN CRÍTICA DE PERMISOS PARA EL VOLUMEN 🚨
# 3. Crear la carpeta /app/uploads si no existe
RUN mkdir -p /app/uploads

# 4. Asignar la propiedad de /app/uploads al usuario 'node'. (Clave para solucionar el 404)
RUN chown -R node:node /app/uploads

# 5. Cambiar al usuario no-root 'node' por seguridad y para respetar los permisos
USER node

# 6. Puertos y Comando
EXPOSE 1556 
CMD ["npm", "start"]