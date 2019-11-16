export type SafeSearch = '1' | '2' | '3';
export type ContentType = '1' | '2' | '3' | '4' | '5' | '6' | '7';
export type TagMode = 'any' | 'all';

export default interface SearchPhotosOptions {
  safeSearch?: SafeSearch;
  contentType?: ContentType;
  isGetty?: boolean;
  tagMode?: TagMode;
  tags: string[];
  page?: number;
  perPage?: number;
}
