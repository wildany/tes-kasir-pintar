import {
  BadRequestException,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './schema/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth Service');
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<Auth> {
    const isAvailable = await this.cekUser(createAuthDto.username);
    if (!isAvailable) {
      const salt = await bcrypt.genSalt();
      createAuthDto.password = await bcrypt.hash(createAuthDto.password, salt);
      const createUser = new this.authModel(createAuthDto);
      const result = await createUser.save();
      this.logger.verbose(
        `Successfully creating user ${createAuthDto.username}`,
      );
      return result;
    } else {
      this.logger.error(
        `${isAvailable.username} already exist, failed to creating new user`,
      );
      throw new BadRequestException('Username telah terdaftar');
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { username, password } = loginAuthDto;
    const user = await this.authModel.findOne({ username: username });
    if (user) {
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        this.logger.verbose(`Login successfully`);
        return user;
      } else {
        this.logger.error('Wrong password, Failed to login');
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'Password salah',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    this.logger.error('User not found');
    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        message: 'User tidak ditemukan',
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async cekUser(username: string): Promise<any> {
    const user = await this.authModel.findOne({ username: username });
    this.logger.verbose(`Successfully checking user ${username}`);
    return user;
  }

  async findAll() {
    try {
      const users = await this.authModel.find().exec();
      this.logger.verbose('Successfully get all user');
      return users;
    } catch (error) {
      this.logger.error('User not found');
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'User tidak ditemukan',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  generateToken(user: any) {
    const dataToken = { id: user.id, username: user.username };
    const token = this.jwtService.sign(dataToken);
    this.logger.verbose(`Creating token for user ${user.username}`);
    return { token: token };
  }
}
