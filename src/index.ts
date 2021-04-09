import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register'
import session from 'express-session';
import connectRedis from 'connect-redis';
import { redis } from './redis';
import cors from 'cors';
import { LoginResolver } from './modules/user/Login';
import { MeResolver } from './modules/user/Me';


const main = async () => {
  await createConnection()

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver],
    authChecker:({ context: { req } }) => {
      return !!req.session.userId // cast it to a boolean
      // if(req.session.userId) {
      //   return true;
      // }
      // return false;
    }
  });


  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req })
  });

  const app = Express();

  const RedisStore = connectRedis(session);

  // console.log('store',RedisStore)
  console.log('redis',session)

  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }))

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: 'cookie',
      secret: 'ababa',
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 365 * 7 // 7 years
      }

    })
  )

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () => console.log('Server started at http://localhost:4000/graphql'))
}

main()
