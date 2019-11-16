import photosReducer from './reducer';
import { freeTextSearchPhotos } from './actions';

describe('photos reducer', () => {
  // just a sample test
  it('should return correct state after free text search', () => {
    const query = 'some query';
    const state = photosReducer(undefined, freeTextSearchPhotos({
      query,
    }));
    expect(state.isLoading).toBe(true);
    expect(state.photos.length).toBe(0);
    expect(state.query).toBe(query);
  });

});