import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { ResponseHandlerService } from '../service/response-handler.service';
import { IResponseHandlerParams } from '../interface/reponse-handler.interface';
import * as jwt from 'jsonwebtoken';
import { sign, SignOptions } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import NodeRSA from 'encrypt-rsa';
import * as fs from 'fs';
import * as path from 'path';
import * as base32 from 'hi-base32';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  // async signIn(
  //   authCredentialsDto: AuthCredentialsDto,
  // ): Promise<{ accessToken: string; permission: string }> {
  //   const { username, password } = authCredentialsDto;
  //   const user = await this.usersRepository.findOne({ username });

  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     const payload: JwtPayload = { username };
  //     const accessToken: string = await this.jwtService.sign(payload);
  //     return {
  //       accessToken,
  //       permission: await this.rolePermissionService.getUserPermission(user.id),
  //     };
  //   } else {
  //     throw new UnauthorizedException('Please check your login credentials');
  //   }
  // }
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<IResponseHandlerParams> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ username });
    if (!user.isActive) {
      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        message: 'Account is not activated! Please contact to your admin',
        data: {},
      });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username, id: user.id };
      const token: string = await this.jwtService.sign(payload);
      const accessToken = 'Bearer ' + (await base32.encode(token));
      // console.log(user);
      // return {
      //   accessToken,
      //   permission: await this.rolePermissionService.getUserPermission(user.id),
      // };
      /*const permissions = await this.rolePermissionService.getUserPermission(
        user.id,
      );*/
      // return ResponseHandlerService({
      //   success: true,
      //   httpCode: HttpStatus.OK,
      //   message: 'Logged in successfully',
      //   accessToken: accessToken,
      //   permissions: permissions.data,
      // });

      /* const nodeRSA = new NodeRSA();
      const privateKEY = await fs.readFileSync(
        path.join(__dirname, './../../private.key'),
        'utf8',
      );
      const publicKEY = await fs.readFileSync(
        path.join(__dirname, './../../public.key'),
        'utf8',
      );
      console.log(privateKEY);
      */
      // const { privateKey, publicKey } = nodeRSA.createPrivateAndPublicKeys();
      /*const nodeRSA = new NodeRSA();
      const { privateKey, publicKey } = nodeRSA.createPrivateAndPublicKeys();
      console.log(privateKey);
      console.log(publicKey);*/

      // const { privateKey, publicKey } =
      //   await nodeRSA.createPrivateAndPublicKeys();
      // const encryptedText = await nodeRSA.encryptStringWithRsaPublicKey({
      //   text: 'hello'
      // });

      /*const privateKey =
        '-----BEGIN PRIVATE KEY-----\n' +
        'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC1svD0lcxnjrs8\n' +
        'UVMTl9ev1JGUZhzEk5rTeivF89cKxSmIEPQtBQBFPYxCH0O+PcKGXhLQeggf/PRZ\n' +
        '/gzVh80dhwTv2TbR8gDXcgbnx9Cd0Q0M3VjQkvadKL+vOfrtwX2c6Et3ryUZs0ac\n' +
        'hC0mWONcAZLa5QvzljSlwEOoODf372YgXzED9rf833muyfq3dZ9Y6OgS2Wcy8PLY\n' +
        'gimijXo+1X6yDj9Mv0r3A1t3Fchzkma1rSvxIHUcg7DfTCz5P1IWTG1aejcSBJK8\n' +
        'ajM523Y3O4No1Gz1pGq6sfHvBOdpVIkUq+MW6XtxtsnIvSiznCyAQwEHOU8bjnsl\n' +
        'htrw+BnPAgMBAAECggEAWwztdBMw1+ANcX9rOxFHEyRZQ10cI2G4HytEjjDP3OTK\n' +
        'GBYu1fSAmzHpfCUApG98cCrqELBmK+ltZT9KnSItJhPH5I0bzH8R7uSEE1fs8XiV\n' +
        'qpGs9PAARubpj1xlowjn8l3xm2sYE1XkF4Cgw2udmzhqp+hJYeouPbUn8j8hxMrJ\n' +
        'PSsKB3Q55c6dhiQ9yStydLMMgVnQsIcZq5UayoRD/Evnfn6qQQI+D6L9zZ7LwMDd\n' +
        '2KLLM/2phYIBhNgfbsXKeiphpgicC7G6s+RhKMs6uul5Dz1Cq1g1CvwMj6z4U3F0\n' +
        'igxV0HSHXN4umXk19fYRrKe9Chfna5XCFblXHPuG6QKBgQDftNhE0oqOJX2FaXTx\n' +
        '6XZE6onN+ZxNzWjlt6uUEGq8ZSIE2duiXdJ57wq/uKBLlKamlmJ5IVq/K7VkutMl\n' +
        'FhxuXhwwT+3h9PamH/k4bw5KQM8Zc5yEpNdgkIHVAXPR8efVWECf0zfTQECOWRxl\n' +
        '8gLQpQKvdMUCeJ6NeM6to6gy9QKBgQDP7bIhKDrlPHFK3G9T9FEImL/seHYmxzbD\n' +
        'F7I/i/Qnal8wVVLvAMWlOzFKiYx3BSi0KRvR3n2WDKdcS490i2B+FjziM4ZyT8tv\n' +
        'vGqUVuKAv8krHaI33jiiBzHi00EHHsex4Hjzu3ipECwgw4dKaeNSZzGuh8aAukBG\n' +
        'gxcRgoRHMwKBgFQtw/fZ1gN5Pgt2zGe/dx6ltudIFzX7po5SmADmUJPF5pA2vnwR\n' +
        'nAMAHWZZfhASxscG7dUw5Ons85wM5SkeceJiDW9slFIjkLCgdXJz78enLYchRvNu\n' +
        '6BDRL9nMax3ETn2scNzzaR1YHzKxe4stDzwd663EXeH5K4iGvhb+72sFAoGBAKJ4\n' +
        'YAzKi6KdpQTS0+as7DikaqsSwXexiBfPR0eiSwgVdQWmViRM3SMr6msMqYZCsLh9\n' +
        'urA1grohbxCONizhz2cWZ0J08mQV96d6eWkprtjdgwo+oIe5C1WH+7H6UkCHC5Dx\n' +
        'DnGclj68VU7QmcFKlgbIfaibjT7+ycSPIBJdgpDDAoGADEVa9U7UxAiZdyT/ChDy\n' +
        '3655cNxaEwGjzAtQ33ux2OPLtjx6mzJNcQrohJRwtn/r64FqJb9JbiWkLohKv4Jj\n' +
        '9YHhwviomJ+nbiMfacPH7f2T6lPY4cMOHOTgdBAtvy6hji3C5/0wCuqiXKWJP6GH\n' +
        'OXk3VwKRU8tNNYr5pbE3LZo=\n' +
        '-----END PRIVATE KEY-----\n';

      const publicKey =
        '-----BEGIN PUBLIC KEY-----\n' +
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtbLw9JXMZ467PFFTE5fX\n' +
        'r9SRlGYcxJOa03orxfPXCsUpiBD0LQUART2MQh9Dvj3Chl4S0HoIH/z0Wf4M1YfN\n' +
        'HYcE79k20fIA13IG58fQndENDN1Y0JL2nSi/rzn67cF9nOhLd68lGbNGnIQtJljj\n' +
        'XAGS2uUL85Y0pcBDqDg39+9mIF8xA/a3/N95rsn6t3WfWOjoEtlnMvDy2IIpoo16\n' +
        'PtV+sg4/TL9K9wNbdxXIc5Jmta0r8SB1HIOw30ws+T9SFkxtWno3EgSSvGozOdt2\n' +
        'NzuDaNRs9aRqurHx7wTnaVSJFKvjFul7cbbJyL0os5wsgEMBBzlPG457JYba8PgZ\n' +
        'zwIDAQAB\n' +
        '-----END PUBLIC KEY-----\n';

      const nodeRSA = new NodeRSA();
      const test = {
        username: 'lagertha',
        password: '123456',
        name: 'e2232',
        email: 'test@mail.com',
      };
      const encryptedString = await nodeRSA.encryptStringWithRsaPublicKey({
        text: JSON.stringify(test),
        publicKey: publicKey,
      });

      const decryptedString = await nodeRSA.decryptStringWithRsaPrivateKey({
        text: encryptedString,
        privateKey: privateKey,
      });

      console.log({ encryptedString });
      console.log(JSON.parse(decryptedString));
      */

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: { accessToken },
      });
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  public async validateToken(auth: string): Promise<IResponseHandlerParams> {
    if (auth.split(' ')[0] !== 'Bearer') {
      return ResponseHandlerService({
        success: false,
        httpCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid token',
      });
      // return new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const token = base32.decode(auth.split(' ')[1]);
    try {
      // const decoded = jwt.verify(token, this.configService.get('JWT_SECRET'));
      const publicKEY = await fs.readFileSync(
        path.join(__dirname, './../../public.key'),
        'utf8',
      );
      const privateKEY = await fs.readFileSync(
        path.join(__dirname, './../../private.key'),
        'utf8',
      );
      const decoded = await jwt.verify(token, privateKEY, {
        algorithms: ['RS256'],
      });

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: decoded,
      });
    } catch (err) {
      // const message =
      //   'Token error: ' + (err.message || err.name || err.HttpStatus);
      // throw new HttpException(message, HttpStatus.UNAUTHORIZED);
      return ResponseHandlerService({
        success: false,
        httpCode: HttpStatus.UNAUTHORIZED,
        errorDetails: err.message,
      });
    }
  }
}
