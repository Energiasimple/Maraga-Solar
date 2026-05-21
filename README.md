# Maraga Solar — Plataforma web

## Pasos para publicar en Vercel (5 minutos)

### 1. Instala Node.js (si no lo tienes)
Descárgalo de: https://nodejs.org  (versión LTS)

### 2. Sube el proyecto a GitHub
1. Ve a https://github.com y crea un repositorio nuevo (puede ser privado)
2. Nombre sugerido: `maraga-solar`
3. Arrastra toda la carpeta `maraga-solar` al repositorio, o usa:
   ```bash
   cd maraga-solar
   git init
   git add .
   git commit -m "Maraga Solar v1.0"
   git remote add origin https://github.com/TU_USUARIO/maraga-solar.git
   git push -u origin main
   ```

### 3. Conecta con Vercel
1. Ve a https://vercel.com → New Project
2. Selecciona **Import Git Repository**
3. Elige el repo `maraga-solar`
4. Vercel detecta automáticamente que es un proyecto Vite
5. Haz clic en **Deploy**
6. En ~2 minutos tendrás tu URL: `maraga-solar.vercel.app`

### 4. Conectar tu dominio propio (opcional)
1. En Vercel → tu proyecto → Settings → Domains
2. Agrega `maraga.mx` o el dominio que tengas
3. Configura los DNS con tu proveedor de dominio

---

## Desarrollo local

```bash
npm install
npm run dev
```
Abre: http://localhost:5173

## Credenciales del panel admin (cambiar en producción)
- Usuario: `admin`
- Contraseña: `maraga2025`

## Estructura del proyecto
```
src/
  App.jsx       — Componente raíz y rutas
  Home.jsx      — Página de inicio pública
  Catalog.jsx   — Catálogo y detalle de producto
  Contact.jsx   — Formulario de contacto
  Admin.jsx     — Todos los paneles de administrador
  ui.jsx        — Componentes reutilizables (Btn, Field, Box...)
  data.js       — Inventario inicial y utilidades
  index.css     — Estilos globales
  main.jsx      — Entry point
```
