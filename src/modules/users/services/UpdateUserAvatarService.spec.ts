import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/storageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to update avatar to user', async () => {
    const fakeUserRepoitory = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUserRepoitory,
      fakeStorageProvider,
    );

    const user = await fakeUserRepoitory.create({
      name: 'olaaaa',
      email: 'e@e.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      avatarFileName: 'perfil.jpg',
      user_id: user.id,
    });

    expect(user.avatar).toBe('perfil.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    const fakeUserRepoitory = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUserRepoitory,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatarService.execute({
        avatarFileName: 'perfil.jpg',
        user_id: 'noexiste user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete avatar when updating new one', async () => {
    const fakeUserRepoitory = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUserRepoitory,
      fakeStorageProvider,
    );

    const user = await fakeUserRepoitory.create({
      name: 'olaaaa',
      email: 'e@e.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      avatarFileName: 'perfil.jpg',
      user_id: user.id,
    });

    await updateUserAvatarService.execute({
      avatarFileName: 'perfil2.jpg',
      user_id: user.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('perfil.jpg');

    expect(user.avatar).toBe('perfil2.jpg');
  });
});
