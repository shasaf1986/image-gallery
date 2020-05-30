import CachedPhotosResult from './types/cachedPhotosResult';
import PhotosResult from '../flicker/types/photosResult';
import moment from 'moment';
import { TagMode } from '../flicker/types/searchPhotosOptions';

interface Options {
  maxEntries?: number;
  prefixKey?: string;
}
export default class CachedPhotos {
  private static _instance: CachedPhotos = new CachedPhotos();

  static get instance() {
    return this._instance;
  }

  private readonly _prefixKey: string;

  // add limit for entries since localstorage is limited
  private readonly _maxEntries: number;

  private readonly _cachedPhotosResultMap: Map<
    string,
    CachedPhotosResult
  > = new Map();

  constructor({
    maxEntries = 1000,
    prefixKey = 'CACHED_PHOTOS',
  }: Options = {}) {
    this._prefixKey = prefixKey;
    this._maxEntries = maxEntries;
    for (let key in localStorage) {
      if (!key.startsWith(this._prefixKey)) {
        continue;
      }
      this._cachedPhotosResultMap.set(key, JSON.parse(localStorage[key]));
    }
  }

  private getKey(tags: string[], tagMode: string, page: number) {
    // if its only one query than the tag is not relevant
    const effectiveTagMode = tagMode.length === 1 ? 'all' : tagMode;
    return `${this._prefixKey}_TAGS=${tags.join(
      '|'
    )}_MODE=${effectiveTagMode}_PAGE=${page}`;
  }

  getPhotosResult(tags: string[], tagMode: 'any' | 'all', page: number) {
    const key = this.getKey(tags, tagMode, page);
    const cachedPhotosResult = this._cachedPhotosResultMap.get(key);
    if (cachedPhotosResult) {
      return cachedPhotosResult.photosResult;
    }
    return null;
  }

  cleanKeyIfNeed() {
    let keyToDelete: string | undefined;
    let createdDate: Date | undefined;

    if (this._cachedPhotosResultMap.size >= this._maxEntries) {
      this._cachedPhotosResultMap.forEach((value, key) => {
        if (createdDate || moment(value.createdDate).isBefore(createdDate)) {
          createdDate = value.createdDate;
          keyToDelete = key;
        }
      });
    }
    if (keyToDelete) {
      localStorage.removeItem(keyToDelete);
      this._cachedPhotosResultMap.delete(keyToDelete);
    }
  }

  setPhotosResult(
    tags: string[],
    tagMode: TagMode,
    page: number,
    photosResult: PhotosResult
  ) {
    const key = this.getKey(tags, tagMode, page);
    const cachedPhotosResult: CachedPhotosResult = {
      photosResult,
      createdDate: new Date(),
      tagMode,
      tags,
    };
    localStorage.setItem(key, JSON.stringify(cachedPhotosResult));
    this._cachedPhotosResultMap.set(key, cachedPhotosResult);
    this.cleanKeyIfNeed();
  }

  getCachedQueries() {
    const cachedPhotosResultMapByQuery: Map<
      string,
      CachedPhotosResult
    > = new Map();

    this._cachedPhotosResultMap.forEach((cachedPhotosResult) => {
      if (cachedPhotosResult.tags.length !== 1) {
        return;
      }
      const query = cachedPhotosResult.tags[0];
      const prevCachedPhotosResult = cachedPhotosResultMapByQuery.get(query);
      if (prevCachedPhotosResult) {
        const isNewer = moment(cachedPhotosResult.createdDate).isAfter(
          prevCachedPhotosResult.createdDate
        );
        if (isNewer) {
          cachedPhotosResultMapByQuery.set(query, cachedPhotosResult);
        }
      } else {
        cachedPhotosResultMapByQuery.set(query, cachedPhotosResult);
      }
    });

    return Array.from(cachedPhotosResultMapByQuery.values())
      .sort((cachedPhotosResultA, cachedPhotosResultB) => {
        if (
          moment(cachedPhotosResultA.createdDate).isBefore(
            cachedPhotosResultB.createdDate
          )
        ) {
          return 1;
        }
        return -1;
      })
      .map((cachedPhotosResult) => cachedPhotosResult.tags[0]);
  }
}
