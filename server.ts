import express, { Express, Request, Response } from 'express';
import * as http from 'http';
import next, { NextApiHandler } from 'next';
import * as socketio from 'socket.io';
import {
   HandleAuthentication,
   OnConnection,
} from './backend/workshop/socket/SockerServer';
import { hasUserAccessToWorkshop } from './backend/workshop/UserAccess';
import Prisma from './backend/singleton/Prisma';
import { createClient } from 'redis';

const port: number = parseInt(process.env.PORT || '3001', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
   const app: Express = express();
   const server: http.Server = http.createServer(app);
   const io: socketio.Server = new socketio.Server();
   io.attach(server);

   new Prisma();

   // Create IO Listener
   io.on('connection', (socket) => OnConnection(socket, io));

   io.use(HandleAuthentication);

   app.all('*', (req: any, res: any) => nextHandler(req, res));

   server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
   });
});
