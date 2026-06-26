import Elysia from "elysia";

export const app = new Elysia();

app.onStart( ({server}) => {
    console.log(`estoy escuchando en ws://${server?.hostname}:${server?.port}/ws`);
});

app.ws("/ws", {
  message(ws, mensaje) {
    ws.send(mensaje);
    console.log(`mensaje recibido de ${ws.id}:${mensaje}`);
  },
});

export default app;  

// hacer publica la ip del servidor donde se encuentra
// input: permitir colocar la ip  y el puerto 