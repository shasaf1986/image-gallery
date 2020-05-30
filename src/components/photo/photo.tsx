import React, { useState, useCallback, useMemo } from 'react';
import { Paper, makeStyles, createStyles, Fade } from '@material-ui/core';
import FadeImage from '../fadeImage';
import PhotoData from '../../services/flicker/types/photo';
import { MasnoryImage } from '../masonry/masonryImage';
import { Item } from '../masonry/item';
import faker from 'faker';
import { useDebounce, useTimeout, useTimeoutFn } from 'react-use';

const useStyles = makeStyles(
  createStyles({
    wrapper: {
      position: 'absolute',
    },
    root: {
      position: 'relative',
      width: '100%',
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
  isVisible: boolean;
}

interface MasnoryItemProps {
  isStable: boolean;
}

const fallbackPhoto = {
  src: 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg',
  alt: '404'
};

const Photo: React.FC<Props> = (({ photo, isVisible }) => {
  const classes = useStyles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const onLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);
  const onError = useCallback(() => {
    setUseFallback(true);
  }, []);

  const src = useFallback ? fallbackPhoto.src : photo.regularUrl;
  const alt = photo.title;


  const color = useMemo(() => faker.internet.color(), []);
  const [show, setShow] = useState(false);

  useDebounce(() => {
    if (isLoaded) {
      setShow(true);
    }
  }, 150, [isLoaded]);

  return (
    <Item isStable={isLoaded}>
      {/* <Fade in> */}
      <div className={classes.root}>
        <Paper style={{
          backgroundColor: color,
        }} className={classes.paper} >
          <Fade in={show}>
            <div >
              <MasnoryImage onError={onError} onLoad={onLoad} src={src} alt={alt} />
            </div>
          </Fade>
        </Paper>
        <b>{alt}</b>
      </div>
      {/* </Fade> */}
    </Item>
  );
});

export default Photo;
