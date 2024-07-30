import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dynamicImport } from './dynamic';

const DEFAULT_ADMIN = {
  email: 'admin@mail.com',
  password: 'password'
}

const authenticate = async (email: string, password: string) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

const adminJs = dynamicImport('@adminjs/nestjs').then(({AdminModule}) => AdminModule.createAdminAsync({
  useFactory: () => ({
    adminJsOptions: {
      rootPath: '/admin',
      resources: [],
    },
    auth: {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'secret'
    },
    sessionOptions: {
      resave: true,
      saveUninitialized: true,
      secret: 'secret'
    },
  }),
}))

@Module({
  imports: [adminJs],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
