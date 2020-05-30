import {
  FreeTextSearchPayload,
  FreeTextSearchPhotosAction,
  FREE_TEXT_SEARCH_PHOTOS,
  PhotosLoadedAction,
  PHOTOS_LOADED,
  LoadMorePhotosAction,
  LOAD_MORE_PHOTOS,
  SET_PREVIOUS_QUERIES,
  SetPreviousQueriesAction,
  SetPreviousQueriesPayload,
  PhotosLoadedPayload,
  ToggleAdvancedModeAction,
  TOGGLE_ADVANCED_MODE,
  ToggleQueryAction,
  TOGGLE_QUERY,
  ToggleQueryPayload,
  ToggleConditionAction,
  TOGGLE_CONDITION,
  PhotosLoadedFailedAction,
  PHOTOS_LOADED_FAILED,
} from './types';

export function freeTextSearchPhotos(
  payload: FreeTextSearchPayload
): FreeTextSearchPhotosAction {
  return {
    type: FREE_TEXT_SEARCH_PHOTOS,
    payload,
  };
}

export function photosLoaded(
  payload?: PhotosLoadedPayload
): PhotosLoadedAction {
  // creates an empty payload in
  const effectivePayload: PhotosLoadedPayload = payload
    ? payload
    : {
        photosResult: {
          photos: [],
          page: {
            page: 1,
            pages: 1,
            perPage: 0,
            total: 0,
          },
        },
        tagMode: 'all',
        tags: [],
      };

  return {
    type: PHOTOS_LOADED,
    payload: effectivePayload,
  };
}

export function loadMorePhotos(): LoadMorePhotosAction {
  return {
    type: LOAD_MORE_PHOTOS,
  };
}

export function setPreviousQueries(
  payload: SetPreviousQueriesPayload
): SetPreviousQueriesAction {
  return {
    type: SET_PREVIOUS_QUERIES,
    payload,
  };
}

export function toggleAdvancedMode(): ToggleAdvancedModeAction {
  return {
    type: TOGGLE_ADVANCED_MODE,
  };
}

export function toggleQuery(payload: ToggleQueryPayload): ToggleQueryAction {
  return {
    type: TOGGLE_QUERY,
    payload,
  };
}

export function toggleCondition(): ToggleConditionAction {
  return {
    type: TOGGLE_CONDITION,
  };
}

export function photosLoadedFailed(): PhotosLoadedFailedAction {
  return {
    type: PHOTOS_LOADED_FAILED,
  };
}
