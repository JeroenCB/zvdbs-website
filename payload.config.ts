import { buildConfig } from 'payload/config';
import path from 'path';
import News from './src/collections/News';
import Pages from './src/collections/Pages';
import Members from './src/collections/Members';
import Records from './src/collections/Records';
import Users from './src/collections/Users';

export default buildConfig({
  admin: {
    user: Users.slug,
    css: path.resolve(__dirname, './src/styles/admin.css'),
  },
  collections: [Users, News, Pages, Members, Records],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: {
    mongoURL: process.env.MONGODB_URI || 'mongodb://localhost:27017/zvdbs',
  },
  cors: ['http://localhost:3000', 'http://localhost:3001'],
  csrf: ['http://localhost:3000', 'http://localhost:3001'],
});
