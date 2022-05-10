import {
   getSession,
   handleAuth,
   handleCallback,
   handleLogin,
} from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';

export default handleAuth({
   async callback(req, res) {
      try {
         await handleCallback(req, res, {
            async afterCallback(req, res, session, state) {
               if (session.user) {
                  const insertData = {
                     email: session.user.email,
                     emailConfirmed: session.user.email_verified,
                     profilePictureURL: session.user.picture,
                     firstName: session.user.given_name,
                     lastName: session.user.family_name,
                  };
                  await new PrismaClient().user.upsert({
                     where: {
                        email: session.user.email,
                     },
                     update: insertData,
                     create: insertData,
                  });
               }
               return session;
            },
         });
      } catch (error) {
         console.log(error);
         res.status(500).end('Error handling callback');
      }
   },
});
