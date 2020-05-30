import React from 'react';
import Search from '../search';
import PhotoGrid from '../photoGrid';
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import SwithMode from '../switchMode';
import AdvancedSearch from '../advancedSearch';

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: '10px 0',
    },
    header: {
      fontFamily: 'Sans-Serif',
      fontWeight: 'bold',
      paddingBottom: '10px',
      textShadow: '0 1px 0 rgba(255, 255, 255, 0.4)',
    },
  })
);

const PhotoGallery: React.FC = () => {
  const { isAdvancedMode } = useSelector((state: AppState) => state.photos);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography className={classes.header} align={'center'} variant="h3">
        {'Image Gallery'}
      </Typography>
      {isAdvancedMode && <AdvancedSearch />}
      {!isAdvancedMode && <Search />}
      <SwithMode />
      <PhotoGrid />
      {/* {isLoading && <Spinner />} */}
    </div>
  );
};

export default PhotoGallery;
