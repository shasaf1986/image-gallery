import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { Paper, makeStyles, createStyles } from '@material-ui/core';
import FadeImage from '../fadeImage';
import PhotoData from '../../services/flicker/types/photo';

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: '2px',
    },
    paper: {
      // borderRadius: 0,
      padding: 0,
      overflow: 'hidden',
    },
    image: {
      display: 'block',
      width: '100%',
      // same as paper
      borderRadius: '4px',
    },
  }),
);

interface Props {
  photo: PhotoData;
}

const Photo: React.FC<Props> = ({ photo }) => {
  const classes = useStyles();
  const { title } = photo;

  return (
    <div className={classes.root}>
      <Tooltip title={title}>
        <Paper className={classes.paper} >
          <FadeImage alt={title} className={classes.image} src={photo.regularUrl} />
        </Paper>
      </Tooltip>
    </div>
  );
}

export default Photo;
