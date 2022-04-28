import "reflect-metadata";
import type {PageConfig} from 'next'
import {ApolloServer} from "apollo-server-micro";
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { resolvers } from "@generated/type-graphql";
import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

export const config: PageConfig = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

const prisma = new PrismaClient();

const apolloServer = new ApolloServer({
    schema: await buildSchema({
        resolvers,
        validate: false,
    }),
    context: async ({ req, res, connection }) => {
        return {
            req,
            res,
            connection,
            prisma,
        };
    },
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const startServer = apolloServer.start()

export default async function handler(req: Request, res: Response) {
    if (req.method === 'OPTIONS') {
        res.end()
        return false
    }

    await startServer
    await apolloServer.createHandler({
        path: '/api/graphql',
    })(req, res)
}
