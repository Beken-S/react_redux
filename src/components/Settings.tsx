import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Blacklist from 'components/Blacklist';
import SettingsForm from 'components/SettingsForm';
import { useAppDispatch } from 'hooks';
import { resetErrors } from 'models/errors';
import { useCallback, useState } from 'react';

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    dispatch(resetErrors());
  }, [setIsOpen, dispatch]);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <SettingsIcon />
      </IconButton>
      <Dialog maxWidth="xs" open={isOpen}>
        <DialogTitle>Настройки</DialogTitle>
        <DialogContent>
          <SettingsForm />
          <Blacklist />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Settings;
