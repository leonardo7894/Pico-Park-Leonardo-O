import { describe, test, expect, afterAll, beforeAll } from "bun:test";
import { app } from "../src/app";

describe("dado un mensaje que envia el ususario se debe devolver el mismo mensaje", () => {
  beforeAll(() => {
    app.listen(3000);
  });
  test("el socket debe recibir el midmo mensaje que recibio", async () => {
    const ws = new WebSocket("ws://localhost:3000/ws");
    ws.onopen = () => {
      ws.send("holaaaaa");
    };
    const posibleMensaje = new Promise((resover) => {
      ws.onmessage = (mensaje) => resover(mensaje.data);
    });

    expect(await posibleMensaje).toBe("holaaaaa");
    ws.close();
  });
  afterAll(async () => {
    await app.stop();
  });
});
