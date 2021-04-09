import { Resolver, Query, Mutation, Arg, Authorized, UseMiddleware } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User'
import { RegisterInput } from '../register/RegisterInput';
import { logger } from '../../middleware/logger';

@Resolver(User)
export class RegisterResolver {
  @Query(() => String)
  @Authorized()
  async hello() {
    return 'recipe helllo';
  }

  @Mutation(() => User)
  @UseMiddleware(logger)
  async register(
    @Arg('data') { email, firstName, lastName, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    return user
  }
}