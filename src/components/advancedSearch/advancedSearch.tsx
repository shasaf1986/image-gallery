import React from 'react';
import {
  Paper, makeStyles, createStyles,
  FormLabel, FormControl, FormGroup,
  Checkbox, FormControlLabel, RadioGroup,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store';
import { toggleQuery } from '../../store/photos/actions';
import ConditionRadio from './components/conditionRadio';

const useStyles = makeStyles(
  createStyles({
    root: {
      padding: '0',
    },
    overflowContainer: {
      padding: '8px',
      overflowY: 'auto',
      maxHeight: '400px',
    }
  }),
);


const AdvancedSearch: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { previousQueries, isAndCondition } = useSelector((state: AppState) => state.photos);

  return (
    <Paper className={classes.root} >
      <div className={classes.overflowContainer}>
        <FormControl fullWidth component="fieldset">
          <FormLabel component="legend">Condition</FormLabel>
          <RadioGroup row value={isAndCondition ? "and" : "or"}>
            <ConditionRadio isAndCondition />
            <ConditionRadio isAndCondition={false} />
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth component="fieldset">
          <FormLabel component="legend">Queries</FormLabel>
          <FormGroup row>
            {
              previousQueries.map(({ isSelected, query }) => (
                <FormControlLabel
                  key={query}
                  control={
                    <Checkbox
                      onChange={() => {
                        dispatch(toggleQuery({ query }));
                      }}
                      color='primary'
                      checked={isSelected}
                    />
                  }
                  label={query}
                />
              ))
            }
          </FormGroup>
        </FormControl>
      </div>
    </Paper>
  );
}

export default AdvancedSearch;
