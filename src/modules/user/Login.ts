import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User'
import { MyContext } from 'src/types/MyContext';

@Resolver(User)
export class LoginResolver {
  @Mutation(() => User, { nullable:true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email }})
    console.log(user)
    if(!user) {
      return null
    }

    const valid = await bcrypt.compare(password, user.password);

    if(!valid) {
      return null
    }

    if(!user.confirmed) {
      return null; // tell te user he is not logged in
    }

    console.log(ctx.req.session)
    ctx.req.session.userId = user.id;
    console.log(ctx.req.session)
    return user
  }
}