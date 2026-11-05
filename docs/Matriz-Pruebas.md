# Matriz de pruebas

Casos de prueba diseñados antes de escribir las pruebas, según la estructura de ISO/IEC/IEEE 29119. El ID de cada caso aparece en el título de su prueba, para poder rastrearlo en los resultados de Jest.

**Criterio de suficiencia.** Cada ruta de la API y cada componente tienen al menos una prueba, y los caminos de error están probados.

**Resultado obtenido.** Esta columna se llena con el JSON de resultados de Jest de la corrida final, nunca a mano. Las filas de regresión llevan dos resultados: el rojo, antes de la corrección, y el verde, después, cada uno con su corrida.

| Tipo        | Qué comprueba                                     | Herramientas                 | Casos |
| ----------- | ------------------------------------------------- | ---------------------------- | ----- |
| Unitaria    | Una pieza aislada, con sus dependencias simuladas | Jest y React Testing Library | 14    |
| Integración | La API completa contra un MySQL real              | Jest y Supertest             | 10    |
| Regresión   | Un defecto corregido no vuelve a aparecer         | Jest y Supertest             | 4     |

## 1. Backend: integración

Archivo: `node-express-server/tests/integration/tutorials.api.test.js`. Componente: la API completa, contra un MySQL real, en la base `tutorials_test`.

| ID    | Tipo        | Entrada                                                                   | Resultado esperado                                                     | Resultado obtenido | Requisito         |
| ----- | ----------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------ | ----------------- |
| IT-01 | Integración | `POST /api/tutorials` con `title` y `description`                         | Respuesta 2xx con el tutorial y su id; queda guardado en la base       |                    | Crear             |
| IT-02 | Integración | `POST /api/tutorials` sin `title`                                         | 400 con `Content can not be empty!`; no guarda nada                    |                    | Crear             |
| IT-03 | Integración | `GET /api/tutorials`, con dos tutoriales en la base                       | 200 con los dos tutoriales                                             |                    | Listar            |
| IT-04 | Integración | `GET /api/tutorials?title=Node`, con `Curso de Node` y `React` en la base | 200 solo con `Curso de Node`                                           |                    | Buscar            |
| IT-05 | Integración | `GET /api/tutorials/published`, con uno publicado y uno pendiente         | 200 solo con el publicado                                              |                    | Listar publicados |
| IT-06 | Integración | `GET /api/tutorials/:id` con un id existente                              | 200 con el tutorial                                                    |                    | Obtener           |
| IT-07 | Integración | `GET /api/tutorials/99999`                                                | 404 con `Cannot find Tutorial with id=99999.`                          |                    | Obtener           |
| IT-08 | Integración | `PUT /api/tutorials/:id` con un `title` distinto                          | 200 con `Tutorial was updated successfully.`; la base guarda el cambio |                    | Editar            |
| IT-09 | Integración | `DELETE /api/tutorials/:id` con un id existente                           | 200 con `Tutorial was deleted successfully!`; ya no está en la base    |                    | Eliminar          |
| IT-10 | Integración | `DELETE /api/tutorials`, con dos tutoriales en la base                    | 200 con `2 Tutorials were deleted successfully!`; la tabla queda vacía |                    | Eliminar todos    |

## 2. Backend: unitarias

Archivo: `node-express-server/tests/unit/tutorial.controller.test.js`. Componente: `tutorial.controller.js`, con el modelo simulado. Cada caso es un `it.each`, así que en Jest cuenta una prueba por operación.

| ID    | Tipo     | Entrada                                                                         | Resultado esperado                                              | Resultado obtenido | Requisito o defecto |
| ----- | -------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------ | ------------------- |
| UT-01 | Unitaria | Cada una de las siete operaciones, con el modelo rechazando con un error        | 500 con el mensaje de la operación, y sin propagar la excepción |                    | Fiabilidad; D-08    |
| UT-02 | Unitaria | `create`, `findAll`, `deleteAll` y `findAllPublished`, con un error sin mensaje | 500 con el mensaje por defecto de la operación                  |                    | Fiabilidad          |

## 3. Backend: regresión

Componente: la API completa, contra un MySQL real. Se escriben en los pull requests de cada corrección, primero solas y en rojo.

| ID    | Tipo      | Archivo                                             | Entrada                                                   | Resultado esperado                             | Antes de la corrección | Después de la corrección | Defecto                                                             |
| ----- | --------- | --------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------- | ---------------------- | ------------------------ | ------------------------------------------------------------------- |
| RG-01 | Regresión | `tests/regression/d01-d02-ids-inexistentes.test.js` | `PUT /api/tutorials/99999`                                | 404 con `Cannot update Tutorial with id=99999` |                        |                          | [D-01](https://github.com/arlex13/pipeline-sqa-tutoriales/issues/1) |
| RG-02 | Regresión | `tests/regression/d01-d02-ids-inexistentes.test.js` | Dos `PUT` seguidos con los mismos datos a un id existente | 200 en los dos, no un 404 falso                |                        |                          | [D-01](https://github.com/arlex13/pipeline-sqa-tutoriales/issues/1) |
| RG-03 | Regresión | `tests/regression/d01-d02-ids-inexistentes.test.js` | `DELETE /api/tutorials/99999`                             | 404 con `Cannot delete Tutorial with id=99999` |                        |                          | [D-02](https://github.com/arlex13/pipeline-sqa-tutoriales/issues/2) |
| RG-04 | Regresión | `tests/regression/d03-crear-responde-201.test.js`   | `POST /api/tutorials` con `title` y `description`         | 201 con el tutorial creado                     |                        |                          | [D-03](https://github.com/arlex13/pipeline-sqa-tutoriales/issues/3) |

RG-02 debe pasar antes y después de la corrección: protege que la corrección de D-01 no convierta un `PUT` sin cambios en un 404 falso.

## 4. Frontend: unitarias de componente

En `react-client/src/`, junto a cada componente. Simulan `TutorialDataService` o axios, así que no necesitan un servidor.

| ID    | Tipo     | Componente            | Archivo                                       | Entrada                                                         | Resultado esperado                                                                      | Resultado obtenido | Requisito        |
| ----- | -------- | --------------------- | --------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------ | ---------------- |
| FE-01 | Unitaria | `TutorialDataService` | `services/tutorial.service.test.js`           | Cada método del servicio, con axios simulado                    | Llama a su ruta con su verbo y devuelve la respuesta                                    |                    | Las siete rutas  |
| FE-02 | Unitaria | `App`                 | `App.test.js`                                 | La ruta `/`                                                     | Muestra la navegación y la lista                                                        |                    | Navegación       |
| FE-03 | Unitaria | `TutorialsList`       | `components/tutorials-list.component.test.js` | Dos tutoriales; se elige uno publicado y después uno pendiente  | Muestra la lista y el detalle del elegido, con `Published` o `Pending` y el enlace Edit |                    | Listar           |
| FE-04 | Unitaria | `TutorialsList`       | `components/tutorials-list.component.test.js` | Se escribe un título y se pulsa Search                          | Llama a `findByTitle` con ese título y muestra solo lo que recibe                       |                    | Buscar           |
| FE-05 | Unitaria | `TutorialsList`       | `components/tutorials-list.component.test.js` | Se pulsa Remove All                                             | Llama a `deleteAll` y recarga la lista                                                  |                    | Eliminar todos   |
| FE-06 | Unitaria | `TutorialsList`       | `components/tutorials-list.component.test.js` | `getAll`, `findByTitle` o `deleteAll` fallan                    | Registra el error y no se rompe                                                         |                    | Fiabilidad       |
| FE-07 | Unitaria | `AddTutorial`         | `components/add-tutorial.component.test.js`   | Se escriben los datos, se pulsa Submit y después Add            | Envía los datos, muestra el éxito y Add vuelve al formulario vacío                      |                    | Crear            |
| FE-08 | Unitaria | `AddTutorial`         | `components/add-tutorial.component.test.js`   | `create` falla                                                  | Sigue en el formulario, con los datos, y registra el error                              |                    | Fiabilidad       |
| FE-09 | Unitaria | `Tutorial`            | `components/tutorial.component.test.js`       | La ruta `/tutorials/1`; se cambian los campos y se pulsa Update | Carga el tutorial de la ruta, envía los cambios y muestra el éxito                      |                    | Obtener y editar |
| FE-10 | Unitaria | `Tutorial`            | `components/tutorial.component.test.js`       | Se pulsa Publish y, en otro caso, UnPublish                     | Envía el estado nuevo y lo muestra                                                      |                    | Publicar         |
| FE-11 | Unitaria | `Tutorial`            | `components/tutorial.component.test.js`       | Se pulsa Delete                                                 | Elimina y navega a la lista                                                             |                    | Eliminar         |
| FE-12 | Unitaria | `Tutorial`            | `components/tutorial.component.test.js`       | `get`, `update` o `delete` fallan                               | Registra el error y no muestra éxito                                                    |                    | Fiabilidad       |

## 5. Lo que estas pruebas no cubren

- **D-14 y D-15** quedan abiertos y documentados en [SQA-Plan.md](SQA-Plan.md). Ninguna prueba confirma su comportamiento defectuoso.
- **`server.js` e `index.js`** solo arrancan la aplicación, así que quedan fuera de la cobertura. Lo mismo vale para `serviceWorker.js` y `setupTests.js`.
- **Carga, estrés y rendimiento** están fuera de alcance según el enunciado. Las pruebas end-to-end son opcionales y no se hacen.
