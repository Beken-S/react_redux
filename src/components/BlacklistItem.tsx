import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { useAppDispatch } from 'hooks';
import { User } from 'models/settings';
import { deleteFromBlacklist } from 'models/settings';
import { MouseEventHandler } from 'react';

type BlacklistItemProps = { user: User } & ListItemProps;

const BlacklistItem: React.FC<BlacklistItemProps> = ({ user, ...other }) => {
  const dispatch = useAppDispatch();

  const deleteHandler: MouseEventHandler<HTMLButtonElement> = (event) => {
    dispatch(deleteFromBlacklist(Number(event.currentTarget.dataset.id)));
  };

  return (
    <ListItem
      secondaryAction={
        <IconButton onClick={deleteHandler} data-id={user.id} edge="end" color="primary">
          <DeleteIcon />
        </IconButton>
      }
      {...other}
    >
      <ListItemAvatar>
        <Avatar src={user.avatar_url} sx={{ width: 32, height: 32 }} />
      </ListItemAvatar>
      <ListItemText>{user.login}</ListItemText>
    </ListItem>
  );
};

export default BlacklistItem;
export type { BlacklistItemProps };
