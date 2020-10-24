import { container } from 'tsyringe';

import uploadConfig from '@config/upload';

import IStorageProvider from './models/IStorageProvider';
import DisckStorageProvider from './implementations/DisckStorageProvider';
import S3StorageProvider from './implementations/S3StorageProvider';

const providers = {
  disck: DisckStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
