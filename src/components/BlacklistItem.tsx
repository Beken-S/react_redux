import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { useAppDispatch } from 'hooks';
import { deleteFromBlacklist } from 'models/blacklist';
import { User } from 'models/user';
import { MouseEventHandler } from 'react';

type BlacklistItemProps = { user: User };

const BlacklistItem: React.FC<BlacklistItemProps> = ({ user }) => {
  const dispatch = useAppDispatch();

  const deleteHandler: MouseEventHandler<HTMLButtonElement> = (event) => {
    dispatch(deleteFromBlacklist(user.id));
  };

  return (
    <ListItem
      secondaryAction={
        <IconButton onClick={deleteHandler} edge="end" color="primary">
          <DeleteIcon />
        </IconButton>
      }
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
