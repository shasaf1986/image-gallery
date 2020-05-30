import Photo from '../../services/flicker/types/photo';
import PhotosResult from '../../services/flicker/types/photosResult';
import { TagMode } from '../../services/flicker/types/searchPhotosOptions';

export const FREE_TEXT_SEARCH_PHOTOS = 'FREE_TEXT_SEARCH_PHOTOS';
export const LOAD_MORE_PHOTOS = 'LOAD_MORE_PHOTOS';
export const PHOTOS_LOADED = 'PHOTOS_LOADED';
export const SET_PREVIOUS_QUERIES = 'SET_PREVIOUS_QUERIES';
export const TOGGLE_ADVANCED_MODE = 'TOGGLE_ADVANCED_MODE';
export const TOGGLE_QUERY = 'TOGGLE_QUERY';
export const TOGGLE_CONDITION = 'TOGGLE_CONDITION';
export const PHOTOS_LOADED_FAILED = 'PHOTOS_LOADED_FAILED';

export interface ToggleQueryPayload {
  query: string;
}

export interface FreeTextSearchPayload {
  query: string;
}

export interface PhotosLoadedPayload {
  tags: string[];
  tagMode: TagMode;
  photosResult: PhotosResult;
}

export interface SetPreviousQueriesPayload {
  previousQueries: string[];
}

export interface FreeTextSearchPhotosAction {
  type: typeof FREE_TEXT_SEARCH_PHOTOS;
  payload: FreeTextSearchPayload;
}

export interface PhotosLoadedAction {
  type: typeof PHOTOS_LOADED;
  payload: PhotosLoadedPayload;
}

export interface PhotosLoadedFailedAction {
  type: typeof PHOTOS_LOADED_FAILED;
}

export interface LoadMorePhotosAction {
  type: typeof LOAD_MORE_PHOTOS;
}

export interface SetPreviousQueriesAction {
  type: typeof SET_PREVIOUS_QUERIES;
  payload: SetPreviousQueriesPayload;
}

export interface ToggleAdvancedModeAction {
  type: typeof TOGGLE_ADVANCED_MODE;
}

export interface ToggleQueryAction {
  type: typeof TOGGLE_QUERY;
  payload: ToggleQueryPayload;
}

export interface ToggleConditionAction {
  type: typeof TOGGLE_CONDITION;
}

export interface SelectedQuery {
  query: string;
  isSelected: boolean;
}

export interface PhotosState {
  query: string;
  previousQueries: SelectedQuery[];
  photos: Photo[];
  hasMore: boolean;
  isLoading: boolean;
  lastPage: number;
  isAdvancedMode: boolean;
  isAndCondition: boolean;
}

export type PhotosActionTypes =
  | FreeTextSearchPhotosAction
  | PhotosLoadedAction
  | LoadMorePhotosAction
  | SetPreviousQueriesAction
  | ToggleAdvancedModeAction
  | ToggleQueryAction
  | ToggleConditionAction
  | PhotosLoadedFailedAction;
