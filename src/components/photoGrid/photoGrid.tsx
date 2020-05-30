import React from 'react';
import Photo from '../photo';
import { makeStyles, createStyles, Grid, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../store';
import { loadMorePhotos } from '../../store/photos/actions';
import { Masonry } from '../masonry/masonry';
import Spinner from '../spinner';

const useStyles = makeStyles(
  createStyles({
    root: {
      margin: '10px -2px',
    },
  })
);

// function useRows() {
//   const theme = useTheme();
//   const isUpSm = useMediaQuery(theme.breakpoints.up('sm'));
//   const isUpMd = useMediaQuery(theme.breakpoints.up('md'));
//   const isUpLg = useMediaQuery(theme.breakpoints.up('lg'));
//   return useMemo(() => {
//     if (isUpLg) {
//       return 4;
//     }
//     if (isUpMd) {
//       return 3;
//     }
//     if (isUpSm) {
//       return 2;
//     }
//     return 1;
//   }, [isUpSm, isUpMd, isUpLg]);
// }

const PhotoGrid: React.FC = () => {
  const { photos, isLoading } = useSelector((state: AppState) => state.photos);
  const query = useSelector((state: AppState) => state.photos.query);

  const classes = useStyles();
  const hasMore = useSelector((state: AppState) => state.photos.hasMore);
  const dispatch = useDispatch();
  return (
    <div className={classes.root}>
      {false && <Typography variant="h6">{'No records found'}</Typography>}
      <Grid spacing={0} container>
        <Masonry
          after={(isProccessing) => (isProccessing || isLoading) && <Spinner />}
          onLoadMore={() => {
            dispatch(loadMorePhotos());
          }}
          hasMore={hasMore}
          query={query}
          length={photos.length}
        >
          {(index) => <Photo isVisible photo={photos[index]} />}
        </Masonry>
      </Grid>
    </div>
  );
};

export default PhotoGrid;
