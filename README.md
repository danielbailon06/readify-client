# Readify

Este repositorio contiene el Frontend (React) de Readify, una aplicación web pensada como un espacio acogedor para amantes de la lectura.

Readify permite a los usuarios descubrir libros, organizar su biblioteca personal y hacer seguimiento de su progreso de lectura en un entorno visual cuidado y agradable.

## ¿Qué puedes hacer en la app?
- Buscar libros por título o autor
- Guardarlos en tu biblioteca personal
- Clasificarlos en:
    - Want to Read
    - Currently Reading
    - Read
- Llevar un seguimiento del progreso de lectura
- Crear estanterías personalizadas (shelves)
- Disfrutar de una experiencia inmersiva con sonidos y temporizador de lectura

### Este repositorio corresponde EXCLUSIVAMENTE al Frontend (React).

El Backend (API con Express) se encuentra aquí:
-> https://github.com/danielbailon06/readify-server

## Instalación y ejecución en local
1. Clonar el repositorio
git clone https://github.com/tu-usuario/readify-frontend.git
cd readify-frontend
2. Instalar dependencias
npm install
3. Variables de entorno

Debes crear un archivo .env en la raíz del proyecto con el siguiente contenido:

VITE_API_URL=http://localhost:5005

### Importante:

Esta variable conecta el frontend con el backend
Si usas el backend desplegado, puedes poner la URL de Vercel

Ejemplo:

VITE_API_URL=https://readify-backend-ten.vercel.app
4. Ejecutar la aplicación
npm run dev

La app se abrirá en:

http://localhost:5173

### Demo

Puedes ver la aplicación desplegada aquí:
-> https://readifyapp.vercel.app

## Tecnologías utilizadas
React (con Vite)
React Router DOM
Axios
CSS personalizado
Context API (gestión de autenticación)
### Funcionalidades principales
- Sistema de autenticación (Signup / Login con JWT)
- Gestión de biblioteca personal
- Seguimiento de progreso de lectura
- Creación y gestión de shelves
- Buscador de libros conectado al backend
- IA integrada para consultas

El frontend depende completamente del backend para obtener datos
Es necesario que el backend esté corriendo o desplegado
