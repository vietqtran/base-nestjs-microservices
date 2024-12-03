import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserCredentials } from './schemas/user-credentials.schema';
import { Model } from 'mongoose';
import { Session } from './schemas/session.schema';
import { ClientKafka } from '@nestjs/microservices';
import { CustomRpcException } from './exceptions/custom-rpc.exception';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserCredentials.name) private readonly userCredentialsModel: Model<UserCredentials>,
        @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
        @Inject('USERS_SERVICE') private readonly usersService: ClientKafka,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async validateUser(email: string, password: string) {
        const userCredentials = await this.userCredentialsModel.findOne({
            email,
        });

        if (!userCredentials) {
            console.error('!!! ERROR: Error at auth.service.validateUser - user not found');
            throw new CustomRpcException('Credentials not found', 400, {
                field: 'user',
                message: 'not-found',
            });
        }

        const isMatched = await bcrypt.compare(password, userCredentials.hashed_password);
        if (!isMatched) {
            console.error('!!! ERROR: Error at auth.service.validateUser - password not matched');
            throw new CustomRpcException('Password does not matched', 400, {
                field: 'password',
                message: 'not-matched',
            });
        }

        const userId = userCredentials.user_id;
        const user = await firstValueFrom(this.usersService.send('users.get-by-id', userId));

        if (!user) {
            console.error('!!! ERROR: Error at auth.service.validateUser - user not found');
            throw new CustomRpcException('User not found', 400, {
                field: 'user',
                message: 'not-found',
            });
        }

        return user;
    }

    async login(signInDto: SignInDto) {
        const {credentials, session} = signInDto
        const user = await this.validateUser(credentials.email, credentials.password);
        const accessToken = await this.generateToken(user, 'access');
        const refreshToken = await this.generateToken(user, 'refresh');
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const sessionData = {
            user_id: user._id,
            hashed_refresh_token: hashedRefreshToken,
            ip: session.ip,
            ua: session.ua,
        }
        const createdSession = await this.sessionModel.create(sessionData);

        if (!createdSession) {
            console.error('!!! ERROR: Error at auth.service.login - create session');
            throw new CustomRpcException('Failed to create session', 400, {
                field: 'session',
                message: 'create-session',
            });
        }

        return {
            user: user.toObject(),
            accessToken,
            refreshToken,
            sessionId: createdSession.toObject()._id,
        };
    }

    async signUp(signUpDto: SignUpDto) {
        const {email, username, password, confirmPassword} = signUpDto

        if (password !== confirmPassword) {
            console.error('!!! ERROR: Error at auth.service.signUp - password not matched');
            throw new CustomRpcException('Passwords do not matched', 400, {
                field: 'confirm-password',
                message: 'not-match',
            });
        }

        const existedUsername = await firstValueFrom(this.usersService.send('users.get-by-filter', {username }));
        if (existedUsername) {
            console.error('!!! ERROR: Error at auth.service.signUp - user existed');
            throw new CustomRpcException('User existed', 400, {
                field: 'username',
                message: 'existed',
            });
        }

        const existedEmail = await firstValueFrom(this.usersService.send('users.get-by-filter', {email }));
        if (existedEmail) {
            console.error('!!! ERROR: Error at auth.service.signUp - user existed');
            throw new CustomRpcException('User existed', 400, {
                field: 'email',
                message: 'existed',
            });
        }

        const createUserDto = {
            username,
            email,
        };
        const createdUser = await firstValueFrom(this.usersService.send('users.create', createUserDto));
        if (!createdUser) {
            console.error('!!! ERROR: Error at auth.service.signUp - create user');
            throw new CustomRpcException('Failed to create user', 400, {
                field: 'user',
                message: 'create-user',
            });
        }

        const hashed_password = await bcrypt.hash(password, 10);
        const createdUserCredentials = await this.userCredentialsModel.create({
            user_id: createdUser._id,
            email,
            username,
            hashed_password,
            password_history: [password],
        });
        if (!createdUserCredentials) {
            console.error('!!! ERROR: Error at auth.service.signUp - create user credentials');
            throw new CustomRpcException('Failed to create user credentials', 400, {
                field: 'user',
                message: 'create-user',
            });
        }

        return createdUser.toObject();
    }

    async generateToken(user: any, type: 'refresh' | 'access') {
        try {
            switch (type) {
                case 'access':
                    const accessToken = await this.jwtService.signAsync(
                        { sub: user._id, email: user.email, username: user.username, roles: user.roles }
                    );
                    return accessToken;
                case 'refresh':
                    const refreshToken = await this.jwtService.signAsync(
                        { sub: user._id, email: user.email, username: user.username, roles: user.roles },
                        { 
                            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                            expiresIn: `${this.configService.get<string>('JWT_REFRESH_EXPIRE_IN')}s` 
                        }
                    );
                    return refreshToken;
                default: 
                    throw new Error('Invalid type');
            }
        } catch (error) {
            console.error('!!! ERROR: Error at auth.service.generateToken');
            throw new CustomRpcException('Failed to generate token', 400, {
                field: 'system-error',
                message: 'system-error',
            });
        }
    }

    async getSessionById(sessionId: string) {
        const session = await this.sessionModel.findById(sessionId);
        if (!session) {
            console.error('!!! ERROR: Error at auth.service.getSessionById - session not found');
            throw new CustomRpcException('Session not found', 400, {
                field: 'session',
                message: 'not-found',
            });
        }
        return session.toObject();
    }

    onModuleInit() {
        const topics = [
          'users.get-by-id',
          'users.get-by-filter',
          'users.create'
        ];
        topics.forEach((topic) => this.usersService.subscribeToResponseOf(topic));
    }
}
