import { VersionSchema } from '@validation/schema/version.schema';
import { petApi } from './api';

const versionService = {
  getVersion: async (): Promise<VersionSchema> => {
    return petApi.get('/version');
  },
} as const;

export default versionService;
