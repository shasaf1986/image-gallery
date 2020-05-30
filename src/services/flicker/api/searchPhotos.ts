import baseService from './baseService';
import parsePhotosResult from '../parsers/parsePhotosResult';
import SearchPhotosOptions from '../types/searchPhotosOptions';

export default async function searchPhotos({
  contentType = '1',
  safeSearch = '1',
  tagMode = 'any',
  page = 1,
  isGetty = true,
  perPage = 50,
  tags,
}: SearchPhotosOptions) {
  const { data } = await baseService({
    tag_mode: tagMode,
    tags: tags.join(','),
    method: 'flickr.photos.search',
    format: 'json',
    nojsoncallback: '1',
    safe_search: safeSearch,
    content_type: contentType,
    is_getty: isGetty ? '1' : '0',
    per_page: perPage,
    page: page,
  });
  return parsePhotosResult(data.photos);
}
