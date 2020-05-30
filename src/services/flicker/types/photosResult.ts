import Photo from './photo';
import Page from './page';

export default interface PhotosResult {
  page: Page;
  photos: Photo[];
}
