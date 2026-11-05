# Plan de Aseguramiento de la Calidad del Software

| Dato        | Valor                                                                                 |
| ----------- | ------------------------------------------------------------------------------------- |
| Proyecto    | Pipeline CI/CD con Aseguramiento de Calidad Integrado                                 |
| Curso       | Aseguramiento de la Calidad del Software                                              |
| Universidad | Universidad Mariano Gálvez de Guatemala, ingeniería en sistemas                       |
| Catedrático | Ing. Edgar Matul García                                                               |
| Responsable | Wilson Alexander Caal Pacay                                                           |
| Repositorio | [arlex13/pipeline-sqa-tutoriales](https://github.com/arlex13/pipeline-sqa-tutoriales) |
| Versión     | 1.0, noviembre de 2026                                                                |

## 1. Propósito

Este plan define cómo se asegura la calidad de una aplicación CRUD de tutoriales ya existente, hecha con React, Express y MySQL. Su regla central es que ningún cambio entra a la rama principal sin pasar antes por verificaciones automáticas. El plan fija qué se mide, con qué herramientas y con qué umbrales, cómo se revisa cada cambio y cómo se gestionan los defectos y la deuda técnica.

## 2. Alcance

**Producto.** La aplicación [bezkoder/react-express-mysql](https://github.com/bezkoder/react-express-mysql), importada sin cambios en la etiqueta `v0-linea-base`. Su modelo es `Tutorial` y su API expone siete rutas en `/api/tutorials`.

**Incluye:**

- Pruebas unitarias, de integración y de regresión, con reporte de cobertura y umbral mínimo.
- Análisis estático con ESLint, Prettier y SonarCloud.
- Pipeline de GitHub Actions con las etapas `build`, `test`, `analyze` y `report`.
- Quality gates que hacen fallar el pipeline cuando no se cumplen los umbrales.
- Protección de la rama `main`, con pull request obligatorio y verificaciones automáticas.
- Gestión de defectos y de deuda técnica con GitHub Issues.
- Medición de métricas antes y después de la intervención.
- Documentación técnica y manual de uso.
- Tres opcionales del enunciado: Docker Compose con MySQL, variables de entorno seguras y notificación automática a Telegram.

**Fuera de alcance, según el enunciado:**

- Desarrollar una aplicación desde cero.
- Pruebas de carga, estrés o rendimiento.

**Opcionales del enunciado que no se hacen:** despliegue automático en la nube y pruebas end-to-end.

**Fuera de alcance por decisión de este plan:**

- Autenticación y autorización de la API. Ver el riesgo D-04.
- Migrar el frontend desde Create React App. Ver el riesgo D-12.

## 3. Estándares de referencia

El plan toma la estructura y los conceptos de estos estándares, adaptados a un proyecto individual y de corta duración. No cita cláusulas específicas, porque no se consultó el texto completo de las normas.

| Estándar           | Para qué se usa                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| IEEE 730           | Norma de planes de aseguramiento de la calidad: propósito, actividades, responsabilidades, registros y riesgos               |
| ISO/IEC 25010      | Características de calidad del producto que se miden. Ver la tabla siguiente                                                 |
| ISO/IEC/IEEE 29119 | Estructura de las pruebas y su documentación: niveles de prueba y casos con entrada, resultado esperado y resultado obtenido |

| Característica de ISO/IEC 25010 | Cómo se mide en este proyecto                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| Adecuación funcional            | Pruebas de las siete rutas y de cada componente, y pruebas fallidas igual a 0           |
| Fiabilidad                      | Pruebas de los caminos de error, issues de fiabilidad de SonarCloud y cobertura         |
| Seguridad                       | `npm audit`, issues de seguridad de SonarCloud y configuración por variables de entorno |
| Mantenibilidad                  | ESLint, Prettier, issues de mantenibilidad, deuda técnica, duplicación y complejidad    |

## 4. Responsabilidades

El proyecto es individual, así que hay un único responsable. Las funciones que los estándares reparten entre varias personas recaen en él, y los controles automáticos aportan la verificación que no depende de la persona.

| Función                 | Quién                       | Responsabilidad                                                                                                       |
| ----------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Responsable de calidad  | Wilson Alexander Caal Pacay | Decide el alcance, los umbrales y las excepciones. Revisa cada pull request que se fusiona. Responde por cada entrega |
| Verificación automática | Pipeline y SonarCloud       | Ejecutan los gates en cada cambio                                                                                     |

## 5. Actividades

### 5.1 Por fase

| Fase                         | Actividades                                                                                                              | Evidencia                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| 0. Entorno                   | Comprobar las herramientas de la PC de trabajo                                                                           | [Linea-Base-Calidad.md](Linea-Base-Calidad.md)                                 |
| 1. Planeación y línea base   | Importar la aplicación, configurar SonarCloud, medir, confirmar y registrar defectos, redactar este plan                 | [Linea-Base-Calidad.md](Linea-Base-Calidad.md) e issues #1 a #16               |
| 2. Puesta a punto y pipeline | Formato, ESLint, refactor para poder probar, variables de entorno, Docker Compose, matriz de pruebas, pruebas y pipeline | [Matriz-Pruebas.md](Matriz-Pruebas.md), `ci.yml` y la primera corrida en verde |
| 3. Protección y regresión    | Proteger `main`, regresiones con corrida en rojo y corrección en verde, y demostración de los gates                      | La regla de protección y las corridas rojas y verdes                           |
| 4. Análisis y mejora         | Corregir issues, medir el estado final, comparar y documentar                                                            | [Reporte-Mejora.md](Reporte-Mejora.md) y los manuales                          |
| 5. Cierre y presentación     | Diapositivas y video                                                                                                     | `docs/presentacion/`                                                           |

### 5.2 Equivalencia con las fases del enunciado

El enunciado propone una guía de cinco fases. Este plan reparte de otra forma sus fases 2 y 3: el pipeline entra junto con las correcciones que necesita para pasar, y las regresiones van después de proteger `main`, para que su corrida en rojo bloquee de verdad el merge.

| Fase del enunciado          | Dónde se cumple                                                          |
| --------------------------- | ------------------------------------------------------------------------ |
| 1. Planeación y preparación | Fases 0 y 1                                                              |
| 2. Pruebas automatizadas    | Fase 2: matriz, unitarias, integración y cobertura. Fase 3: regresión    |
| 3. Pipeline CI/CD           | Fase 2: pipeline, análisis estático y gates. Fase 3: protección de ramas |
| 4. Análisis y mejora        | Fase 4, con parte de las correcciones adelantadas a la Fase 2            |
| 5. Cierre y presentación    | Fase 5                                                                   |

### 5.3 Pruebas

El diseño completo está en [Matriz-Pruebas.md](Matriz-Pruebas.md). Son 28 pruebas: cada ruta de la API y cada componente tienen al menos una, y los caminos de error están probados.

| Nivel                  | Cantidad | Qué prueba                                                                      | Herramientas                 |
| ---------------------- | -------- | ------------------------------------------------------------------------------- | ---------------------------- |
| Unitarias del servidor | 2        | El controlador con el modelo simulado                                           | Jest                         |
| Unitarias del cliente  | 12       | El servicio y cada componente, con el servicio o axios simulados                | Jest y React Testing Library |
| Integración            | 10       | La API real contra un MySQL real                                                | Jest y Supertest             |
| Regresión              | 4        | Cada defecto corregido: la prueba falla con el defecto y pasa con la corrección | Jest y Supertest             |

## 6. Métricas y umbrales

### 6.1 Gates del pipeline

Cada uno hace fallar el pipeline si no se cumple.

| Gate                                 | Umbral                                                | Lo hace cumplir                                             | Cómo se demuestra               |
| ------------------------------------ | ----------------------------------------------------- | ----------------------------------------------------------- | ------------------------------- |
| Compilación del cliente              | Sin errores ni advertencias de ESLint                 | `CI=true npm run build`, en `build`                         | Configurado                     |
| Pruebas fallidas                     | 0                                                     | Jest, en `test`                                             | Las corridas rojas de regresión |
| Cobertura total de cada paquete      | 70 % en líneas, sentencias y funciones; 60 % en ramas | `coverageThreshold` de Jest, en `test`                      | Configurado y medido            |
| Advertencias de ESLint               | 0                                                     | `--max-warnings=0`, en `analyze`                            | Demostración de ESLint          |
| Formato                              | Sin diferencias                                       | Prettier, en `analyze`                                      | Configurado                     |
| Avisos altos o críticos del servidor | 0 en pull requests                                    | `npm audit --audit-level=high`, en `analyze`                | Configurado                     |
| Quality gate                         | Sonar way                                             | SonarCloud, con `sonar.qualitygate.wait=true`, en `analyze` | Demostración de SonarCloud      |

El enunciado exige como mínimo 60 % de cobertura. Este plan fija un umbral más alto y nunca se baja de 60 % para hacer pasar el pipeline.

### 6.2 Dos gates de cobertura que se complementan

**Jest controla el total de cada paquete** y **SonarCloud controla lo que entra en cada cambio.** El quality gate Sonar way evalúa solo el código nuevo:

| Condición sobre el código nuevo | Umbral      |
| ------------------------------- | ----------- |
| Calificación de seguridad       | A           |
| Calificación de fiabilidad      | A           |
| Calificación de mantenibilidad  | A           |
| Cobertura                       | 80 % o más  |
| Duplicación                     | 3 % o menos |
| Hotspots revisados              | 100 %       |

Con menos de 20 líneas nuevas, SonarCloud no evalúa la cobertura ni la duplicación. La **meta de trabajo es 85 % de cobertura en SonarCloud**, para tener margen sobre el 80 %. Se mantiene Sonar way porque es un estándar externo y difícil de relajar a conveniencia.

### 6.3 Definición de código nuevo

La definición es **Previous version**. El análisis de línea base usa la versión `0.0.0` y los análisis del pipeline usan `1.0.0`.

- En un pull request, el código nuevo son las líneas que el pull request cambia.
- En `main`, el código nuevo es todo lo que cambió desde el análisis de la versión anterior. Formato, ESLint y refactor tocan casi todas las líneas, así que en `main` casi todo el código cuenta como nuevo. Por eso hay que cubrir casi toda la aplicación, también el cliente.

### 6.4 Métricas de comparación

Se miden en la línea base y en el estado final, con las mismas herramientas y reglas: pruebas, cobertura, hallazgos de ESLint, archivos sin formato, issues de SonarCloud por cualidad y severidad, calificaciones, duplicación, complejidad, deuda técnica, hotspots y `npm audit`. El `npm audit` se compara el mismo día, porque su base de avisos cambia sola.

## 7. Herramientas

| Herramienta                                            | Uso                                                                     |
| ------------------------------------------------------ | ----------------------------------------------------------------------- |
| GitHub y GitHub Actions                                | Repositorio, pull requests y pipeline                                   |
| GitHub Issues                                          | Gestión de defectos y de deuda técnica                                  |
| Jest y Supertest                                       | Pruebas del backend y su cobertura                                      |
| React Testing Library, con el Jest de Create React App | Pruebas del frontend y su cobertura                                     |
| ESLint y Prettier                                      | Análisis estático y formato                                             |
| SonarCloud, plan OSS                                   | Análisis estático, deuda técnica y quality gate                         |
| `npm audit`                                            | Avisos de seguridad de las dependencias                                 |
| Docker Compose y MySQL 8.4                             | Base de datos local. En CI, MySQL 8.4 corre como contenedor de servicio |
| Telegram                                               | Aviso automático del resultado del pipeline                             |

## 8. Criterios de entrada y salida

**Para abrir un pull request:**

- El cambio está en una rama con su prefijo: `ci/`, `fix/`, `test/`, `docs/` o `demo/`.
- Las pruebas, ESLint y Prettier pasan en local.
- Si corrige un defecto, enlaza su issue con `Closes #n`. Si es un defecto de comportamiento, trae además su prueba de regresión.

**Para hacer merge a `main`:**

- `build`, `test`, `analyze` y `SonarCloud Code Analysis` en verde.
- La rama está al día con `main`.
- El responsable leyó el cambio, marcó la lista de la plantilla y dejó un comentario.

**Para dar el proyecto por terminado:**

- La última corrida de `main` está en verde, con las cuatro etapas.
- El quality gate de `main` está aprobado, sin issues de severidad alta o media ni hotspots sin revisar.
- La cobertura pasa de 85 % en SonarCloud y de 70 % en Jest, en los dos paquetes.
- Cada defecto está cerrado por una corrección, o abierto con su motivo en la sección 11.

## 9. Gestión de defectos

Cada defecto es un issue de GitHub, numerado como D-n, con una etiqueta de tipo (`bug`, `seguridad` o `deuda-tecnica`) y una de prioridad.

| Prioridad | Significado                                                                                   |
| --------- | --------------------------------------------------------------------------------------------- |
| P0        | Riesgo crítico: se corrige de inmediato                                                       |
| P1        | Impide probar, rompe el contrato de la API o es un riesgo de seguridad alto                   |
| P2        | Afecta al usuario o desvía el contrato sin romper la aplicación, o es deuda técnica relevante |
| P3        | Mantenibilidad o robustez menor                                                               |

**Ciclo de vida:**

- **Con corrección.** El pull request que lo corrige lo cierra con `Closes #n`. Un defecto de comportamiento lleva dos commits: primero la prueba de regresión sola, con el pipeline en rojo, y después la corrección, con el pipeline en verde. El merge conserva los dos commits, para que el historial demuestre que la prueba detecta el defecto.
- **Sin corrección.** Queda abierto con la etiqueta `riesgo-aceptado` o `deuda-tecnica`, y la sección 11 dice por qué.

**Hallazgos de las herramientas.** Los issues de severidad Blocker, High y Medium de SonarCloud se corrigen en el código. Marcar uno como seguro solo vale para un falso positivo comprobado, con la justificación escrita.

## 10. Revisión de código

**Automática.** En cada pull request corren los gates de la sección 6, y SonarCloud publica su análisis como una verificación. La protección de `main` exige pull request y verificaciones en verde, exige que la rama esté al día e impide los push directos, también al administrador.

**Manual.** La [plantilla de pull request](../.github/pull_request_template.md) define la lista que se revisa antes de cada merge. El responsable lee el cambio, marca la lista y deja un comentario.

**Sin aprobaciones obligatorias.** La protección exige cero aprobaciones, porque GitHub no deja aprobar un pull request propio y en un proyecto individual bloquearía todo merge. La evidencia de la revisión manual son la lista marcada y el comentario.

**Cómo se aplicó.** En cuatro pull requests, el comentario de revisión se dejó después del merge. La sección 9 de [Reporte-Mejora.md](Reporte-Mejora.md#9-revisión-manual) lo detalla.

Los pull requests de demostración de los gates se cierran sin merge y no llevan revisión manual.

## 11. Riesgos

### 11.1 Riesgos aceptados

| ID                                                                   | Riesgo                                                                         | Motivo por el que se acepta                                                      |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| [D-04](https://github.com/arlex13/pipeline-sqa-tutoriales/issues/4)  | `DELETE /api/tutorials` borra toda la tabla sin autenticación                  | Lo usa el botón Remove All, y la autenticación está fuera de alcance             |
| [D-10](https://github.com/arlex13/pipeline-sqa-tutoriales/issues/10) | `react-client/.env` está versionado                                            | Solo trae `PORT=8081`, que no es un secreto, y es convención de Create React App |
| [D-12](https://github.com/arlex13/pipeline-sqa-tutoriales/issues/12) | Create React App está descontinuado y `react-scripts` trae avisos de seguridad | Migrar amplía el alcance. El `npm audit` del cliente solo reporta y no bloquea   |

### 11.2 Deuda abierta

| ID                                                                   | Hallazgo                                                            | Motivo por el que queda abierta                                                                 |
| -------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [D-14](https://github.com/arlex13/pipeline-sqa-tutoriales/issues/14) | Un id no numérico llega a la base, y `PUT` y `DELETE` responden 500 | Impacto bajo: es un error del cliente reportado como error del servidor                         |
| [D-15](https://github.com/arlex13/pipeline-sqa-tutoriales/issues/15) | Al editar, el frontend no avisa si el backend rechaza el cambio     | Con D-01 corregido ya no hay éxito falso. Falta mostrar el error, que es una mejora de interfaz |

### 11.3 Riesgos del proceso

| Riesgo                                                                          | Mitigación                                                                                                                         |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Un aviso nuevo de `npm audit` pone `main` en rojo sin que cambie el código      | El `npm audit` del servidor bloquea solo en pull requests; en los push solo reporta                                                |
| El perfil de reglas de SonarCloud cambia entre mediciones                       | El perfil se eligió antes de medir, y se registran su nombre, sus reglas y su fecha                                                |
| En `main`, casi todo cuenta como código nuevo y el gate exige 80 % de cobertura | Meta de trabajo de 85 % y cobertura también del cliente                                                                            |
| Autorrevisión: una sola persona revisa todo                                     | Los gates automáticos no dependen de la persona, y la lista de la plantilla define qué revisar                                     |
| Las pruebas de integración borran datos                                         | Corren contra `tutorials_test`, y la suite aborta si el nombre de la base no termina en `_test`                                    |
| Un secreto llega a un archivo versionado                                        | `.env` ignorado, secrets de GitHub y revisión del historial al cierre                                                              |
| El token de SonarCloud vence                                                    | Dura 90 días. Si vence, `analyze` falla y no entra ningún pull request. La rotación está en [Manual-Tecnico.md](Manual-Tecnico.md) |

## 12. Registros y trazabilidad

| Registro                           | Dónde                                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| Métricas iniciales                 | [Linea-Base-Calidad.md](Linea-Base-Calidad.md)                                                     |
| Casos de prueba y resultados       | [Matriz-Pruebas.md](Matriz-Pruebas.md)                                                             |
| Comparativa de antes y después     | [Reporte-Mejora.md](Reporte-Mejora.md)                                                             |
| Arquitectura y decisiones técnicas | [Manual-Tecnico.md](Manual-Tecnico.md)                                                             |
| Instalación y uso de la aplicación | [Manual-Uso.md](Manual-Uso.md)                                                                     |
| Defectos                           | [Issues de GitHub](https://github.com/arlex13/pipeline-sqa-tutoriales/issues)                      |
| Resultado de cada corrida          | [GitHub Actions](https://github.com/arlex13/pipeline-sqa-tutoriales/actions)                       |
| Estado de calidad                  | [SonarCloud](https://sonarcloud.io/summary/overall?id=arlex13_pipeline-sqa-tutoriales&branch=main) |
