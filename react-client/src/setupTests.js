// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// Dos avisos que las dependencias fijadas repiten en cada prueba: los cambios de React
// Router 7 y el act de Testing Library 13 con React 18.3. El proyecto no migra esas
// versiones, así que se omiten solo esos, para que el log muestre lo que sí importa.
const AVISOS_CONOCIDOS = [
  "React Router Future Flag Warning",
  "ReactDOMTestUtils.act",
];

const filtrarAvisos = (original) => {
  return (mensaje, ...resto) => {
    if (!AVISOS_CONOCIDOS.some((aviso) => String(mensaje).includes(aviso))) {
      original(mensaje, ...resto);
    }
  };
};

console.warn = filtrarAvisos(console.warn);
console.error = filtrarAvisos(console.error);
