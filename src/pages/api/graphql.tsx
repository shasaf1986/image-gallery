import { ApolloServer } from 'apollo-server-micro';
import { Resolvers } from './generated/graphql';
import { typeDefs } from './schema';
import searchPhotos from '../../services/flicker/api/searchPhotos';

const resolvers: Resolvers = {
  Query: {
    photos: async (_, { query, page, perPage, operator }) => {
      const photosResult = await searchPhotos({
        tags: query,
        perPage: perPage || undefined,
        page: page || undefined,
        tagMode: operator ? (operator === 'AND' ? 'all' : 'any') : undefined,
      });
      return {
        page: {
          page: photosResult.page.page,
          pages: photosResult.page.pages,
        },
        photos: photosResult.photos.map(({ regularUrl, title }) => ({
          src: regularUrl,
          title,
        })),
      };
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
