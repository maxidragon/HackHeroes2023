import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JwtAuthDto } from '../dto/jwt-auth.dto';

const { SECRET = 'secret' } = process.env;

const extractFromCookie = (req: any): string | null => {
  if (req && req.cookies) return req.cookies['jwt'];
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: extractFromCookie,
      secretOrKey: SECRET,
    });
  }

  async validate(jwtAuthDto: JwtAuthDto): Promise<any> {
    return jwtAuthDto;
  }
}
