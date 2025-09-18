import mongoose from 'mongoose';
import app from './app';
import { createServer, Server } from 'http';
import config from './app/config';
import initializeSocketIO from './socket';

let server: Server;
export const io = initializeSocketIO(createServer(app));

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Connection to database is successfully established');

    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });

    io.listen(Number(config.socket_port));
    console.log(
      //@ts-ignore
      `Socket is listening on port ${config.ip}:${config.socket_port}`.yellow
        .bold,
    );

    (global as any).socketio = io;
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
