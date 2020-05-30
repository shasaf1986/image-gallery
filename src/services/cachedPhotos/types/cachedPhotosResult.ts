import PhotosResult from '../../flicker/types/photosResult';
import { TagMode } from '../../flicker/types/searchPhotosOptions';

export default interface CachedPhotosResult {
  tags: string[];
  tagMode: TagMode;
  createdDate: Date;
  photosResult: PhotosResult;
}
