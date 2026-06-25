import Elysia from "elysia";

export const app = new Elysia();

app.onStart( ({server}) => {
    console.log(`estoy escuchando en ws://${server?.hostname}:${server.port}/ws`)
})

app.ws("/ws", {
  message(ws, mensaje) {
    ws.send(mensaje);
  },
});

export default app;  