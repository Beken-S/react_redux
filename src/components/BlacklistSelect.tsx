import AddBoxIcon from '@mui/icons-material/AddBox';
import Autocomplete from '@mui/material/Autocomplete';
import FromGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { isPenultimateIndex, isEmptyArray } from 'common/array-helpers';
import { useAppDispatch } from 'hooks';
import { addToBlacklist } from 'models/blacklist';
import { User } from 'models/user';
import { useState, useCallback, useEffect } from 'react';

type BlacklistSelectProps = {
  reviewers: User[];
};

const BlacklistSelect: React.FC<BlacklistSelectProps> = ({ reviewers }) => {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<User[]>([]);
  const [disabledOption, setDisabledOption] = useState<User | null>(null);

  const onChangeHandler = useCallback(
    (event: unknown, newValue: User[]): void => {
      setValue(newValue);
    },
    [setValue]
  );
  const addHandler = useCallback((): void => {
    dispatch(addToBlacklist(value.map(({ id }) => id)));
    setValue([]);
  }, [value, setValue, dispatch]);

  useEffect((): void => {
    if (isPenultimateIndex(value.length, reviewers)) {
      const lastReviewer = reviewers.find((reviewer) => !value.includes(reviewer));
      if (lastReviewer != null) {
        setDisabledOption(lastReviewer);
      }
    } else {
      setDisabledOption(null);
    }
  }, [value, reviewers, setDisabledOption]);

  return (
    <FromGroup sx={{ pl: 2, pr: 0.5, py: 1, flexDirection: 'row', flexWrap: 'nowrap', gap: 2 }}>
      <Autocomplete
        multiple
        value={value}
        limitTags={1}
        options={reviewers}
        getOptionLabel={(user) => user.login}
        renderInput={(params) => <TextField {...params} variant="standard" label="Участники" />}
        getOptionDisabled={(option) => option === disabledOption}
        onChange={onChangeHandler}
        filterSelectedOptions
        sx={{ flexGrow: 1 }}
      />
      <IconButton onClick={addHandler} disabled={isEmptyArray(value)} color="primary" sx={{ alignSelf: 'center' }}>
        <AddBoxIcon />
      </IconButton>
    </FromGroup>
  );
};

export default BlacklistSelect;
export type { BlacklistSelectProps };
