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

# --- ETAPA 3: FINAL - BACKEND Y SERVICIO ---
FROM node:18-alpine
WORKDIR /app

# 1. Preparar el Backend
# RUTA CORREGIDA: Acceso directo desde la Raíz
COPY VistaAdministrador/backend/package*.json ./
RUN npm install
COPY VistaAdministrador/backend .

# 2. Copiar los Frontends compilados a la carpeta 'public' del Backend
COPY --from=admin_build /app/dist ./public/admin 
COPY --from=turista_build /app/dist ./public/turista 

# 3. Puertos y Comando
EXPOSE 1556 
CMD ["npm", "start"]