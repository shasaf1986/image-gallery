import { call, put, take, takeLatest, delay, select, cancel } from 'redux-saga/effects';
import {
  LOAD_MORE_PHOTOS,
  PhotosState, TOGGLE_ADVANCED_MODE, TOGGLE_CONDITION, TOGGLE_QUERY,
  FREE_TEXT_SEARCH_PHOTOS, FreeTextSearchPhotosAction,
} from '../store/photos/types';
import searchPhotos from '../services/flicker/api/searchPhotos';
import { photosLoaded, photosLoadedFailed } from '../store/photos/actions';
import { AppState } from '../store';
import CachedPhotos from '../services/cachedPhotos/cachedPhotos';
import { Task } from '@redux-saga/core';

export default function* photosSaga() {
  while (true) {
    let task: Task | undefined;
    const { isAdvancedMode }: PhotosState = yield select((state: AppState) => state.photos);
    if (isAdvancedMode) {
      task = yield takeLatest([TOGGLE_CONDITION, TOGGLE_QUERY], loadPhotosAdvanced);
    } else {
      task = yield takeLatest(FREE_TEXT_SEARCH_PHOTOS, loadPhotosByQuery);
    }
    // cancel when mode changed
    yield take(TOGGLE_ADVANCED_MODE);
    yield cancel(task!);
  }
}

function* loadPhotosAdvanced() {
  const { previousQueries, isAndCondition }: PhotosState =
    yield select((state: AppState) => state.photos);
  const tags = previousQueries
    .filter(query => query.isSelected)
    .map(query => query.query);
  const tagMode = isAndCondition ? 'all' : 'any';
  yield startWatchPhotos(tags, tagMode);
}

function* loadPhotosByQuery(action: FreeTextSearchPhotosAction) {
  yield startWatchPhotos([action.payload.query], 'all');
}

function* startWatchPhotos(tags: string[], tagMode: 'any' | 'all') {
  // debounce
  yield delay(300);
  yield loadPhotos(tags, 1, tagMode);
  while (true) {
    yield take(LOAD_MORE_PHOTOS);
    const { lastPage }: PhotosState = yield select((state: AppState) => state.photos);
    yield loadPhotos(tags, lastPage + 1, tagMode);
  }
}

function* loadPhotos(tags: string[], page: number, tagMode: 'any' | 'all') {
  const isEmpty = tags.every((tag) => tag.trim().length === 0);
  // empty case just dispatch an empty action
  if (isEmpty) {
    yield put(photosLoaded());
    return;
  }

  let photosResult = CachedPhotos.instance.getPhotosResult(tags, tagMode, page);
  // not cached
  if (photosResult === null) {
    try {
      photosResult = yield call(searchPhotos, {
        tags,
        tagMode,
        page,
      });
      CachedPhotos.instance.setPhotosResult(tags, tagMode, page, photosResult!);
    } catch (error) {
      // something went wrong
      yield put(photosLoadedFailed());
      return;
    }
  }

  yield put(photosLoaded({
    photosResult: photosResult!,
    tagMode,
    tags,
  }));
}
