// Código de demostración, sin pruebas: existe solo para que el quality gate de SonarCloud lo rechace.
const contarPublicados = (tutoriales) => {
  const publicados = tutoriales.filter((t) => t.published);
  const total = publicados.length;
  return total;
};

const contarPendientes = (tutoriales) => {
  const pendientes = tutoriales.filter((t) => !t.published);
  const total = pendientes.length;
  return total;
};

const titulos = (tutoriales) => {
  const lista = tutoriales.map((t) => t.title);
  const ordenada = [...lista].sort();
  return ordenada;
};

const resumen = (tutoriales) => {
  const publicados = contarPublicados(tutoriales);
  const pendientes = contarPendientes(tutoriales);
  const total = publicados + pendientes;
  const nombres = titulos(tutoriales);
  return { publicados, pendientes, total, nombres };
};

const porcentajePublicado = (tutoriales) => {
  const datos = resumen(tutoriales);
  const fraccion = datos.publicados / datos.total;
  const porcentaje = fraccion * 100;
  const redondeado = Math.round(porcentaje);
  return redondeado;
};

module.exports = {
  contarPublicados,
  contarPendientes,
  titulos,
  resumen,
  porcentajePublicado,
};
