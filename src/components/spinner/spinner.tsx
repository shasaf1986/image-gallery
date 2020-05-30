import React from 'react';
import {
  CircularProgress,
  makeStyles,
  createStyles,
  Box,
} from '@material-ui/core';

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: '5px 0',
      width: '100%',
    },
  })
);

const Spinner: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root} display="flex" justifyContent="center">
      <CircularProgress />
    </Box>
  );
};

export default Spinner;
