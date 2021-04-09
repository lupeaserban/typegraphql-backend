import { MiddlewareFn } from 'type-graphql';
// import { MyContext } from '../types/MyContext';

export const logger: MiddlewareFn = async ({ args  }, next) => {
  console.log('Request args: ', args)
  return next()
}