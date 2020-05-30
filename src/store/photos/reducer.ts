import {
  PhotosState,
  PhotosActionTypes,
  PHOTOS_LOADED,
  LOAD_MORE_PHOTOS,
  SET_PREVIOUS_QUERIES,
  TOGGLE_ADVANCED_MODE,
  SelectedQuery,
  TOGGLE_QUERY,
  TOGGLE_CONDITION,
  FREE_TEXT_SEARCH_PHOTOS,
  PHOTOS_LOADED_FAILED,
} from './types';

const initialState: PhotosState = {
  previousQueries: [],
  isAndCondition: true,
  query: '',
  photos: [],
  isLoading: false,
  hasMore: false,
  lastPage: 0,
  isAdvancedMode: false,
};

export default function photosReducer(
  state = initialState,
  action: PhotosActionTypes
): PhotosState {
  switch (action.type) {
    case FREE_TEXT_SEARCH_PHOTOS: {
      return {
        ...state,
        isLoading: true,
        hasMore: false,
        lastPage: 0,
        photos: [],
        query: action.payload.query,
      };
    }
    case PHOTOS_LOADED: {
      const { photosResult, tags } = action.payload;
      const { page, photos } = photosResult;
      let previousQueries = state.previousQueries;
      // if its only single query and not empty and not in list
      if (tags.length === 1 && tags[0].trim().length > 0) {
        const query = tags[0];
        const selectedQuery = state.previousQueries.find(
          (selectedQuery) => selectedQuery.query === query
        );
        if (!selectedQuery) {
          // add new prev query
          previousQueries = [
            {
              isSelected: false,
              query,
            },
            ...state.previousQueries,
          ];
        }
      }
      return {
        ...state,
        isLoading: false,
        lastPage: page.page,
        hasMore: page.page < page.pages,
        previousQueries,
        photos: [...state.photos, ...photos],
      };
    }
    case LOAD_MORE_PHOTOS: {
      return {
        ...state,
        isLoading: true,
        hasMore: false,
      };
    }
    case SET_PREVIOUS_QUERIES: {
      const previousQueries = action.payload.previousQueries.map((query) => {
        const selectedQuery: SelectedQuery = {
          isSelected: false,
          query,
        };
        return selectedQuery;
      });
      return {
        ...state,
        previousQueries,
      };
    }
    case TOGGLE_QUERY: {
      const previousQueryIndex = state.previousQueries.findIndex(
        (previousQuery) => previousQuery.query === action.payload.query
      );
      const previousQuery = state.previousQueries[previousQueryIndex];

      return {
        ...state,
        isLoading: true,
        hasMore: false,
        lastPage: 0,
        photos: [],
        previousQueries: [
          ...state.previousQueries.slice(0, previousQueryIndex),
          {
            ...previousQuery,
            isSelected: !previousQuery.isSelected,
          },
          ...state.previousQueries.slice(previousQueryIndex + 1),
        ],
      };
    }
    case TOGGLE_ADVANCED_MODE: {
      // clean state when changed
      return {
        ...state,
        isAdvancedMode: !state.isAdvancedMode,
        isLoading: false,
        isAndCondition: true,
        previousQueries: state.previousQueries.map((previousQuery) => ({
          ...previousQuery,
          isSelected: false,
        })),
        hasMore: false,
        lastPage: 0,
        photos: [],
        query: '',
      };
    }
    case TOGGLE_CONDITION: {
      return {
        ...state,
        isLoading: true,
        hasMore: false,
        lastPage: 0,
        photos: [],
        isAndCondition: !state.isAndCondition,
      };
    }
    case PHOTOS_LOADED_FAILED: {
      // TODO : this is not the solution, should handle it better
      return {
        ...state,
        isLoading: false,
      };
    }

    default: {
      return state;
    }
  }
}
