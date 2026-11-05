# Pipeline CI/CD con aseguramiento de calidad integrado

[![CI](https://github.com/arlex13/pipeline-sqa-tutoriales/actions/workflows/ci.yml/badge.svg)](https://github.com/arlex13/pipeline-sqa-tutoriales/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=arlex13_pipeline-sqa-tutoriales&metric=alert_status)](https://sonarcloud.io/summary/overall?id=arlex13_pipeline-sqa-tutoriales&branch=main)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=arlex13_pipeline-sqa-tutoriales&metric=coverage)](https://sonarcloud.io/component_measures?id=arlex13_pipeline-sqa-tutoriales&metric=coverage)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=arlex13_pipeline-sqa-tutoriales&metric=bugs)](https://sonarcloud.io/component_measures?id=arlex13_pipeline-sqa-tutoriales&metric=bugs)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=arlex13_pipeline-sqa-tutoriales&metric=code_smells)](https://sonarcloud.io/component_measures?id=arlex13_pipeline-sqa-tutoriales&metric=code_smells)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=arlex13_pipeline-sqa-tutoriales&metric=sqale_rating)](https://sonarcloud.io/component_measures?id=arlex13_pipeline-sqa-tutoriales&metric=sqale_rating)

Proyecto de práctica del curso Aseguramiento de la Calidad del Software, Universidad Mariano Gálvez de Guatemala, con el Ing. Edgar Matul García. Estudiante: Wilson Alexander Caal Pacay.

## Descripción

Este repositorio toma una aplicación CRUD de tutoriales que ya existía, hecha con React, Express y MySQL, y le integra aseguramiento de la calidad. Todo cambio pasa por pruebas automatizadas, análisis estático y quality gates antes de entrar a `main`.

Sobre la aplicación base se agregó:

- Pruebas unitarias, de integración contra MySQL y de regresión, con umbrales de cobertura.
- Análisis estático con ESLint, Prettier y SonarCloud.
- Un pipeline de GitHub Actions que corre en cada push y en cada pull request hacia `main`.
- Protección de la rama `main`.
- Variables de entorno y Docker Compose para la base de datos.
- Notificación del resultado del pipeline a Telegram.
- Corrección de defectos registrados como [issues](https://github.com/arlex13/pipeline-sqa-tutoriales/issues) y medición de la calidad antes y después.

El código original está intacto en la etiqueta `v0-linea-base`. Sobre ese estado se midió la [línea base](docs/Linea-Base-Calidad.md). La etiqueta `v1.0.0` marca el estado final del código, y el [reporte de mejora](docs/Reporte-Mejora.md) compara los dos.

## Stack

| Capa                | Tecnología                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Frontend            | React 18, Create React App (`react-scripts` 5), React Router 6, Bootstrap 4 y axios 0.35                                 |
| Backend             | Node.js 24, Express 4, Sequelize 6, `mysql2` 3 y `dotenv`                                                                |
| Base de datos       | MySQL 8.4                                                                                                                |
| Pruebas y cobertura | Jest 30 y Supertest en el servidor; React Testing Library con el Jest de Create React App en el cliente                  |
| Análisis estático   | ESLint 10 con configuración plana en el servidor, el ESLint 8 de Create React App en el cliente, Prettier 3 y SonarCloud |
| CI/CD               | GitHub Actions                                                                                                           |
| Contenedores        | Docker Compose, solo para MySQL                                                                                          |
| Notificaciones      | Telegram                                                                                                                 |

## Pipeline y quality gates

El pipeline está en [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

| Etapa     | Qué hace                                                                                | Qué la hace fallar                                                                                                                                        |
| --------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`   | Instala las dependencias y compila el cliente con `CI=true`                             | Un error de compilación o una advertencia de ESLint en el cliente                                                                                         |
| `test`    | Corre las pruebas de los dos paquetes; las del servidor usan un contenedor de MySQL 8.4 | Una prueba fallida, o una cobertura por paquete bajo 70 % en líneas, sentencias y funciones, o bajo 60 % en ramas                                         |
| `analyze` | Corre ESLint, Prettier, `npm audit` y SonarCloud                                        | Una advertencia de ESLint, un archivo sin formato, una vulnerabilidad alta o crítica del servidor (solo en pull requests) o el quality gate de SonarCloud |
| `report`  | Escribe el resumen de la corrida, publica el reporte y notifica a Telegram              | No bloquea: corre aunque fallen las etapas anteriores                                                                                                     |

- El `npm audit` del cliente solo informa: Create React App arrastra dependencias vulnerables, y eso se acepta como deuda técnica (D-12, ver el [SQA Plan](docs/SQA-Plan.md#111-riesgos-aceptados)).
- En los push, el job `analyze` se llama `analyze-push` y su `npm audit` del servidor no bloquea. Así, solo la corrida del pull request cuenta como la verificación requerida `analyze`.
- [SonarCloud](https://sonarcloud.io/summary/overall?id=arlex13_pipeline-sqa-tutoriales&branch=main) usa el gate Sonar way y el perfil Sonar way comprehensive. El análisis corre desde el pipeline, con el análisis automático apagado.
- Los secretos del pipeline (`SONAR_TOKEN`, `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`) están en GitHub Actions. Ningún valor real está en un archivo versionado.

**Rama protegida.** `main` exige pull request y las verificaciones `build`, `test`, `analyze` y `SonarCloud Code Analysis`, con la rama al día. La regla también aplica al administrador y no permite force push ni borrar la rama. No exige aprobaciones, porque GitHub no deja que el autor apruebe su propio pull request; la revisión manual está en la [plantilla de pull request](.github/pull_request_template.md). La regla y un push directo rechazado están en [docs/evidencia/proteccion/](docs/evidencia/proteccion/).

**Rechazos reales.** Las regresiones de [#18](https://github.com/arlex13/pipeline-sqa-tutoriales/pull/18) y [#19](https://github.com/arlex13/pipeline-sqa-tutoriales/pull/19) dejaron `test` en rojo antes de su corrección. Los pull requests de demostración [#20](https://github.com/arlex13/pipeline-sqa-tutoriales/pull/20) (SonarCloud) y [#21](https://github.com/arlex13/pipeline-sqa-tutoriales/pull/21) (ESLint) se cerraron sin merge. El detalle de cada corrida está en [rechazos.json](docs/evidencia/gates/rechazos.json).

## Instalación

Necesitas Git, Node.js 24 con npm, y Docker con Docker Compose o un MySQL local. Node.js 24 y MySQL 8.4 son las versiones que usa el pipeline.

Los comandos son iguales en Git Bash y en PowerShell, salvo donde se muestran las dos variantes.

### Con Docker

Docker Compose levanta solo MySQL. La API y el cliente corren en tu equipo.

```bash
git clone https://github.com/arlex13/pipeline-sqa-tutoriales.git
cd pipeline-sqa-tutoriales
docker compose up -d --wait
```

No hace falta configurar nada para MySQL: los valores por defecto de `docker-compose.yml` son marcadores de desarrollo, no secretos. La primera vez tarda más, porque descarga la imagen.

Copia el archivo de variables del servidor. En Git Bash:

```bash
cd node-express-server
cp .env.example .env
```

En PowerShell:

```powershell
cd node-express-server
Copy-Item .env.example .env
```

Arranca la API desde esa misma carpeta, porque `dotenv` busca `.env` en la carpeta actual:

```bash
npm ci
npm start
```

Debe mostrar `Server is running on port 8080.` y `Synced db.`. En otra terminal, desde la raíz del repositorio, arranca el cliente:

```bash
cd react-client
npm ci
npm start
```

La aplicación queda en <http://localhost:8081>.

> **El script de `docker/mysql-init` solo corre con el volumen vacío.** Ese script crea la base de pruebas `tutorials_test`. MySQL tampoco vuelve a leer `DB_USER`, `DB_PASSWORD` ni `DB_NAME` si el volumen ya tiene datos. Para volver a aplicar todo eso hay que recrear el volumen, lo que borra los tutoriales guardados:
>
> ```bash
> docker compose down -v
> docker compose up -d --wait
> ```

Docker Compose no lee `node-express-server/.env`. Para levantar MySQL con esos valores, usa `docker compose --env-file node-express-server/.env up -d --wait`. Un `DB_USER` distinto también exige cambiar el `GRANT` de `docker/mysql-init/01-base-de-pruebas.sql`.

### Sin Docker

Crea las bases y el usuario en tu MySQL, como administrador y con tu propia contraseña. La aplicación crea la tabla al arrancar, pero no la base.

```sql
CREATE DATABASE tutorials;
CREATE DATABASE tutorials_test; -- Solo para las pruebas del servidor
CREATE USER 'tutorials_app'@'localhost' IDENTIFIED BY 'tu_clave';
GRANT ALL PRIVILEGES ON tutorials.* TO 'tutorials_app'@'localhost';
GRANT ALL PRIVILEGES ON tutorials_test.* TO 'tutorials_app'@'localhost';
```

Clona el repositorio y copia el archivo de variables del servidor, como en la sección anterior. Escribe tu contraseña en `DB_PASSWORD`, dentro de `.env`, y arranca la API y el cliente con los mismos comandos.

Si la API muestra `Failed to sync db: ...`, revisa los valores de `.env`.

### Variables de entorno

| Variable            | Paquete  | Valor de ejemplo            | Para qué sirve                                                   |
| ------------------- | -------- | --------------------------- | ---------------------------------------------------------------- |
| `DB_HOST`           | servidor | `localhost`                 | Host de MySQL                                                    |
| `DB_PORT`           | servidor | `3306`                      | Puerto de MySQL                                                  |
| `DB_USER`           | servidor | `tutorials_app`             | Usuario de MySQL                                                 |
| `DB_PASSWORD`       | servidor | `cambia_esto`               | Contraseña de MySQL. El ejemplo es un marcador, no un secreto    |
| `DB_NAME`           | servidor | `tutorials`                 | Base de la aplicación. Las pruebas siempre usan `tutorials_test` |
| `PORT`              | servidor | `8080`                      | Puerto de la API                                                 |
| `CORS_ORIGIN`       | servidor | `http://localhost:8081`     | Único origen desde el que el navegador puede llamar a la API     |
| `REACT_APP_API_URL` | cliente  | `http://localhost:8080/api` | URL de la API. Se lee al compilar                                |

Las del servidor van en `node-express-server/.env`, copiado de `.env.example`. La del cliente solo hace falta si la API está en otra dirección: copia `react-client/.env.example` como `react-client/.env.local`. Ni `.env` ni `.env.local` se versionan. La excepción es `react-client/.env`, que solo trae `PORT=8081` y no es un secreto (D-10).

### Problemas frecuentes

| Qué pasa                                                                  | Causa                                                                                                                               | Qué hacer                                                                                                                                                                          |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| La lista de tutoriales aparece vacía, sin ningún mensaje                  | La API no responde, o abriste la aplicación en una dirección distinta de `http://localhost:8081`, el único origen que la API acepta | Revisa la terminal de la API y abre `http://localhost:8081`                                                                                                                        |
| `Failed to sync db: ...` en la terminal de la API                         | MySQL no está listo, las credenciales no coinciden, o el volumen se creó con otros valores                                          | Sin Docker, revisa `.env`. Con Docker, comprueba `docker compose ps` y, si hace falta, recrea el volumen con `docker compose down -v`                                              |
| Las pruebas del servidor fallan por un error de acceso a `tutorials_test` | El volumen de MySQL ya existía y el script de `docker/mysql-init` no corrió                                                         | Ejecuta `docker compose down -v` y luego `docker compose up -d --wait`                                                                                                             |
| Las pruebas del servidor fallan con `Connection lost` o `ECONNREFUSED`    | MySQL todavía estaba arrancando                                                                                                     | Levántalo con `docker compose up -d --wait`, que espera a que esté listo, y repite                                                                                                 |
| Docker dice que el puerto 3306 está ocupado                               | Otro MySQL usa ese puerto                                                                                                           | Elige otro con `DB_PORT=3307 docker compose up -d --wait`, o en PowerShell con `$env:DB_PORT = "3307"; docker compose up -d --wait`. El servidor necesita el mismo valor en `.env` |
| PowerShell no deja ejecutar `npm` por la política de ejecución            | Está bloqueado el script `npm.ps1`                                                                                                  | Usa `npm.cmd` en lugar de `npm`                                                                                                                                                    |

## Uso

Abre <http://localhost:8081>:

1. **Crear:** pulsa `Add` en el menú, llena `Title` y `Description` y pulsa `Submit`.
2. **Listar:** pulsa `Tutorials` y elige un tutorial de la lista para ver su detalle.
3. **Buscar:** escribe parte del título en `Search by title` y pulsa `Search`.
4. **Editar:** elige un tutorial de la lista, pulsa `Edit`, cambia los datos y pulsa `Update`.
5. **Publicar:** en la misma pantalla, pulsa `Publish` o `UnPublish`.
6. **Eliminar:** en la misma pantalla, pulsa `Delete`. `Remove All`, en la lista, borra todos los tutoriales. Ninguno de los dos pide confirmación.

La API responde en `http://localhost:8080/api/tutorials`. El [Manual de uso](docs/Manual-Uso.md) describe cada paso, los mensajes que ve el usuario y las siete rutas con sus códigos de respuesta.

## Scripts

Cada paquete instala sus dependencias con `npm ci` en su propia carpeta.

**Raíz**

| Script                 | Qué hace                                                       |
| ---------------------- | -------------------------------------------------------------- |
| `npm run format`       | Aplica Prettier a todo el repositorio                          |
| `npm run format:check` | Comprueba el formato sin cambiar nada. Es el gate del pipeline |

**`node-express-server`**

| Script                  | Qué hace                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| `npm start`             | Arranca la API con `node server.js`                                                                             |
| `npm test`              | Corre las pruebas con Jest, un archivo a la vez (`--runInBand`), porque comparten la misma base. Necesita MySQL |
| `npm run test:coverage` | Igual que `npm test`, con cobertura y umbrales                                                                  |
| `npm run test:ci`       | Igual que `test:coverage`, y además escribe `test-results.json`. Lo usa el pipeline                             |
| `npm run lint`          | Corre ESLint con `--max-warnings=0`                                                                             |

**`react-client`**

| Script                  | Qué hace                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `npm start`             | Arranca el servidor de desarrollo en el puerto 8081                                 |
| `npm run build`         | Compila el cliente en `build/`                                                      |
| `npm test`              | Corre las pruebas en modo interactivo                                               |
| `npm run test:coverage` | Corre las pruebas una vez, con cobertura y umbrales                                 |
| `npm run test:ci`       | Igual que `test:coverage`, y además escribe `test-results.json`. Lo usa el pipeline |
| `npm run lint`          | Corre ESLint sobre `src` con `--max-warnings=0`                                     |
| `npm run eject`         | Script original de Create React App. Este proyecto no lo usa                        |

Los comandos para repetir en local las verificaciones del pipeline están en la sección 5.4 del [Manual técnico](docs/Manual-Tecnico.md#54-correr-todo-en-local).

## Estructura del repositorio

```text
pipeline-sqa-tutoriales/
├── .github/
│   ├── workflows/ci.yml          # Pipeline
│   └── pull_request_template.md  # Lista de la revisión manual
├── docker/mysql-init/            # Script que crea la base tutorials_test
├── docs/                         # Documentación y evidencia
├── node-express-server/
│   ├── app.js                    # Crea y exporta la app, sin escuchar
│   ├── server.js                 # Sincroniza la base y escucha
│   ├── app/                      # config, controllers, models y routes
│   ├── tests/                    # unit, integration, regression y helpers
│   ├── eslint.config.mjs         # ESLint 10, configuración plana
│   ├── jest.config.js            # Reportes y umbrales de cobertura
│   └── .env.example
├── react-client/
│   ├── public/
│   ├── src/                      # Componentes, servicio y pruebas *.test.js
│   ├── .eslintrc.json            # ESLint 8 de Create React App
│   ├── .env                      # Solo PORT=8081
│   └── .env.example
├── docker-compose.yml            # MySQL 8.4
├── sonar-project.properties      # Configuración de SonarCloud
├── package.json                  # Prettier y scripts de formato
├── .prettierrc
├── LICENSE
└── README.md
```

## Documentación

| Documento                                           | Contenido                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [SQA-Plan.md](docs/SQA-Plan.md)                     | Propósito, alcance, estándares, actividades, métricas, herramientas y riesgos         |
| [Matriz-Pruebas.md](docs/Matriz-Pruebas.md)         | Casos de prueba con su entrada, resultado esperado y resultado obtenido               |
| [Linea-Base-Calidad.md](docs/Linea-Base-Calidad.md) | Métricas del código original, antes de la intervención                                |
| [Reporte-Mejora.md](docs/Reporte-Mejora.md)         | Comparativa de antes y después, defectos corregidos y lo que no se corrigió           |
| [Manual-Tecnico.md](docs/Manual-Tecnico.md)         | Arquitectura del pipeline, decisiones técnicas, mantenimiento y solución de problemas |
| [Manual-Uso.md](docs/Manual-Uso.md)                 | Instalación, uso de la aplicación y rutas de la API                                   |
| [presentacion/](docs/presentacion/)                 | Presentación de resultados en PDF                                                     |
| [evidencia/](docs/evidencia/)                       | Datos de la línea base, de la medición final, de los rechazos y de la protección      |
| [img/](docs/img/)                                   | Capturas de la línea base y del estado final                                          |

## Crédito y licencias

La aplicación base es [bezkoder/react-express-mysql](https://github.com/bezkoder/react-express-mysql), de bezkoder. Se importó sin cambios desde el commit `570e477`, y ese estado es la etiqueta `v0-linea-base`. La interfaz conserva textos del original, como la marca `bezKoder` del menú.

Sobre la licencia de esa base:

- El `package.json` del servidor declara ISC.
- El `package.json` del cliente no declara licencia.
- El repositorio original no trae archivo `LICENSE`.

La licencia [MIT](LICENSE) de este repositorio cubre solo lo agregado sobre esa base, no el código original de bezkoder.
