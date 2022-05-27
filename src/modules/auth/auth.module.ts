import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGuard } from './auth.guard';
import { AUTH_PACKAGE } from './constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE,
        transport: Transport.GRPC,
        options: {
          url: 'localhost:50052',
          package: 'auth',
          protoPath: 'src/grpc/auth.proto',
        },
      },
    ]),
  ],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
