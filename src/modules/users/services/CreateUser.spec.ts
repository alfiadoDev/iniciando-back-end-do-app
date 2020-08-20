import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepoitory = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUserRepoitory,
      fakeHashProvider,
    );

    const appointment = await createUserService.execute({
      name: 'meu nome',
      email: 'email@email.com',
      password: '123456',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email', async () => {
    const fakeUserRepoitory = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUserRepoitory,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'meu nome',
      email: 'email@email.com',
      password: '123456',
    });

    expect(
      createUserService.execute({
        name: 'meu nome',
        email: 'email@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
