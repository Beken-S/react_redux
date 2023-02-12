import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { BaseError, TypeError, ERROR_CODE } from 'common/errors';
import { useAppDispatch, useAppSelector } from 'hooks';
import { resetErrors, selectErrors, setRepositoryError, setUserError } from 'models/errors';
import { fetchSettings, selectLoadingStatus } from 'models/loading';
import { selectRepositoryName } from 'models/repository';
import { selectUserLogin } from 'models/user';
import { useState, ChangeEventHandler, FormEventHandler, useEffect } from 'react';
import { shallowEqual } from 'react-redux';

const enum FormId {
  userLogin = 'settings_user_login',
  repositoryName = 'settings_repository_name',
}

const SettingsForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectLoadingStatus);
  const currentUserLogin = useAppSelector(selectUserLogin);
  const currentRepositoryName = useAppSelector(selectRepositoryName);
  const errors = useAppSelector(selectErrors, shallowEqual);
  const [userLogin, setUserLogin] = useState(currentUserLogin);
  const [repositoryName, setRepositoryName] = useState(currentRepositoryName);
  const [isDisabled, setIsDisabled] = useState(true);

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (event): void => {
    event.preventDefault();

    if (userLogin === '') {
      dispatch(setUserError(new TypeError('Пожалуйста введите логин пользователя.')));
    }
    if (repositoryName === '') {
      dispatch(setRepositoryError(new TypeError('Пожалуйста введите название репозитория.')));
    }
    if (userLogin !== '' && repositoryName !== '') {
      dispatch(fetchSettings(userLogin, repositoryName));
    }
  };

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target: HTMLInputElement = event.currentTarget;

    if (errors.user != null || errors.repository != null) {
      dispatch(resetErrors());
    }

    switch (target.id) {
      case FormId.userLogin:
        setUserLogin(target.value);
        break;
      case FormId.repositoryName:
        setRepositoryName(target.value);
        break;
      default:
    }
  };

  useEffect(() => {
    setIsDisabled(errors.user != null || errors.repository != null);
  }, [errors]);

  return (
    <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={onSubmitHandler}>
      <TextField
        id={FormId.userLogin}
        value={userLogin}
        onChange={onChangeHandler}
        error={errors.user != null}
        helperText={errors.user != null ? getErrorHelperText(errors.user) : ''}
        margin="normal"
        fullWidth
        label="Логин"
        required
      />
      <TextField
        id={FormId.repositoryName}
        value={repositoryName}
        onChange={onChangeHandler}
        error={errors.repository != null}
        helperText={errors.repository != null ? getErrorHelperText(errors.repository) : ''}
        margin="normal"
        fullWidth
        label="Репозиторий"
        placeholder="Название"
        required
      />
      <LoadingButton loading={isLoading} disabled={isDisabled} sx={{ mt: 1, mb: 1 }} type="submit">
        Применить
      </LoadingButton>
    </Box>
  );
};

function getErrorHelperText(error: BaseError): string {
  switch (error.code) {
    case ERROR_CODE.NotFoundError:
    case ERROR_CODE.TypeError:
    case ERROR_CODE.InvalidDataLength:
      return error.message;
    default:
      return 'Что-то пошло не так.';
  }
}

export default SettingsForm;
