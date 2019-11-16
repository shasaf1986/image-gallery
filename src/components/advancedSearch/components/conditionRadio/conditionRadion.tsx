import React from 'react';
import { FormControlLabel, Radio } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { toggleCondition } from '../../../../store/photos/actions';

interface Props {
  isAndCondition: boolean;
}

const ConditionRadio: React.FC<Props> = ({ isAndCondition }) => {
  const dispatch = useDispatch();

  return (
    <FormControlLabel
      value={isAndCondition ? "and" : "or"}
      control={
        <Radio
          onChange={() => {
            dispatch(toggleCondition())
          }}
          color="primary"
        />
      }
      label={isAndCondition ? "AND" : "OR"}
      color="primary"
    />
  );
}

export default ConditionRadio;
