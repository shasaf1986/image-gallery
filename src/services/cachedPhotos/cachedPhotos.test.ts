import CachedPhotos from './cachedPhotos';
import PhotosResult from '../flicker/types/photosResult';

describe('cached photos', () => {
  const prefixKey = 'TEST_CACHED_IMAGES';
  let cachedPhotos: CachedPhotos;

  beforeEach(() => {
    cachedPhotos = new CachedPhotos({ prefixKey });
    localStorage.clear();
  });
  afterAll(() => {
    localStorage.clear();
  });

  it('should save query', () => {
    const tags = ['dummy', 'dumyy2'];
    const tagMode = 'any';
    const page = 1;
    const photosResult: PhotosResult = {
      page: {
        page: 1,
        pages: 20,
        perPage: 100,
        total: 200,
      },
      photos: [],
    };
    cachedPhotos.setPhotosResult(tags, tagMode, page, photosResult);
    const savedData = cachedPhotos.getPhotosResult(tags, tagMode, page);
    expect(savedData !== null).toEqual(true);
  });
});
