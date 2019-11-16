import React, { useMemo, useEffect } from 'react';
import Photo from '../photo';
import PhotoData from '../../services/flicker/types/photo';
import { useMediaQuery, useTheme, makeStyles, createStyles, Grid, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../store';
import { loadMorePhotos } from '../../store/photos/actions';

const useStyles = makeStyles(
  createStyles({
    root: {
      margin: '10px -2px',
    },
  }),
);

function useRows() {
  const theme = useTheme();
  const isUpSm = useMediaQuery(theme.breakpoints.up('sm'));
  const isUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const isUpLg = useMediaQuery(theme.breakpoints.up('lg'));
  return useMemo(() => {
    if (isUpLg) {
      return 4;
    }
    if (isUpMd) {
      return 3;
    }
    if (isUpSm) {
      return 2;
    }
    return 1;
  }, [isUpSm, isUpMd, isUpLg]);
}

function usePhotosByRows(rows: number) {
  const photos = useSelector((state: AppState) => state.photos.photos);
  return useMemo(() => {
    const photosByRows: Array<PhotoData[]> = [];
    // initilize arrays
    for (let i = 0; i < rows; i++) {
      const photosByRow: PhotoData[] = [];
      photosByRows.push(photosByRow);
      for (let j = i; j < photos.length; j += rows) {
        photosByRow.push(photos[j]);
      }
    }
    return photosByRows;
  }, [photos, rows]);
}

function useLoadMore() {
  const hasMore = useSelector((state: AppState) => state.photos.hasMore);
  const dispatch = useDispatch();

  useEffect(() => {
    // just return
    if (!hasMore) {
      return;
    }

    function onScroll(event: Event) {
      // TODO: 1. handle only user scroll 2. make it cross
      const scroll = window.innerHeight + window.scrollY;
      const height = document.documentElement.offsetHeight;
      // thresh
      if (scroll + 400 >= height) {
        // prevents next trigger before stage change 
        dispose();
        dispatch(loadMorePhotos());
      }
    }

    window.addEventListener('scroll', onScroll);

    let isDisposed = false;
    function dispose() {
      if (isDisposed) {
        return;
      }
      isDisposed = true;
      window.removeEventListener('scroll', onScroll);
    }
    return dispose;
  }, [hasMore, dispatch]);
}

function useNoRecordsFound() {
  const {
    isLoading, query, photos,
    isAdvancedMode, previousQueries
  } = useSelector((state: AppState) => state.photos);

  return useMemo(() => {
    if (isLoading) {
      return false;
    }
    if (isAdvancedMode) {
      const hasSelectedQuery = previousQueries.some((query) => query.isSelected);
      if (!hasSelectedQuery) {
        return false;
      }
    }
    else {
      const isQueryEmpty = query.trim().length === 0;
      if (isQueryEmpty) {
        return false;
      }
    }
    return photos.length === 0;
  }, [isLoading, query, photos, isAdvancedMode, previousQueries]);
}

const PhotoGrid: React.FC = () => {
  useLoadMore();
  const rows = useRows();
  const photosByRows = usePhotosByRows(rows);
  const classes = useStyles();
  const noRecordsFound = useNoRecordsFound();

  return (
    <div className={classes.root} >
      {noRecordsFound && <Typography variant="h6">{'No records found'}</Typography>}
      <Grid spacing={0} container  >
        {photosByRows.map((photosByRow, rowNumber) =>
          <Grid
            item
            key={rowNumber.toString()}
            // @ts-ignore
            xs={12 / rows}
          >
            {photosByRow.map((photo) =>
              <Photo key={photo.id} photo={photo} />
            )}
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default PhotoGrid;
