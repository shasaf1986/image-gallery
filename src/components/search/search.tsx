import React from 'react';
import { Paper, makeStyles, createStyles, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store';
import { freeTextSearchPhotos } from '../../store/photos/actions';

const useStyles = makeStyles(
  createStyles({
    paper: {
      borderRadius: 0,
    },
    root: {
      padding: '4px 8px',
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      display: 'block',
      width: '100%',
    },
  })
);

const Search: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const query = useSelector((state: AppState) => state.photos.query);

  return (
    <Paper className={classes.root}>
      <InputBase
        placeholder="Search photos ..."
        value={query}
        onChange={(event) => {
          const { value } = event.target;
          dispatch(
            freeTextSearchPhotos({
              query: value,
            })
          );
        }}
        className={classes.input}
      />
      <SearchIcon />
    </Paper>
  );
};

export default Search;
