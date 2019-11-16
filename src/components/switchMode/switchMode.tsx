import React from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../store';
import { toggleAdvancedMode } from '../../store/photos/actions';

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: '5px 0',
    },
  }),
);

const SwithMode: React.FC = () => {
  const classes = useStyles();
  const { isAdvancedMode } = useSelector((state: AppState) => state.photos);
  const dispatch = useDispatch();

  return (
    <div className={classes.root}>
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              onChange={() => {
                dispatch(toggleAdvancedMode());
              }}
              color="primary"
              checked={isAdvancedMode}
              value="Advanced"
            />
          }
          label="Advanced"
        />
      </FormGroup>
    </div>
  );
}

export default SwithMode;
