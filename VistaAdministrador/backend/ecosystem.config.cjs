// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "turista-backend",
      script: "./src/index.js",
      cwd: "/home/smunoz/Tallerdedesarrollo/VistaAdministrador/backend",
      env: {
        PORT: 4000, // backend escuchando en 4000 para evitar conflictos
        HOST: "http://146.83.198.35",
        NODE_ENV: "production",

        DB_HOST: "pgsqltrans.face.ubiobio.cl",
        DB_PORT: 5432,
        DB_USER: "smunoz2",
        DB_PASSWORD: "sebastian2025",
        DB_NAME: "smunoz2_bd",

        ACCESS_TOKEN_SECRET: "cBYbc7pLA3"
      }
    }
  ]
};

