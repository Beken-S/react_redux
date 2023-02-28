import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type UserCardProps = {
  login: string;
  repository?: string;
  src?: string;
};

const UserCard: React.FC<UserCardProps> = ({ login, repository, src }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', minWidth: '200px' }}>
      <Avatar src={src} />
      <Typography>
        {login}
        {repository != null && `/${repository}`}
      </Typography>
    </Box>
  );
};

export default UserCard;
export type { UserCardProps };
