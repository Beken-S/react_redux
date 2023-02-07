import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { isEmptyArray } from 'common/array-helpers';
import Roulette from 'components/Roulette';
import UserCard from 'components/UserCard';
import { useAppSelector } from 'hooks';
import { selectReviewers, selectUser, selectRepositoryName } from 'models/settings';
import { shallowEqual } from 'react-redux';

const AppContent: React.FC = () => {
  const reviewers = useAppSelector(selectReviewers, shallowEqual);
  const user = useAppSelector(selectUser, shallowEqual);
  const repository = useAppSelector(selectRepositoryName);

  if (user == null || isEmptyArray(reviewers)) {
    return <Typography align="center">Пожалуйста установите в настройках репозиторий и пользователя.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h6" sx={{ mb: 1, minWidth: '232px' }}>
        Репозиторий:
      </Typography>
      <UserCard login={user.login} repository={repository} src={user.avatar_url} />
      <Divider flexItem sx={{ mt: 2, mb: 2, minWidth: '232px' }} />
      <Typography variant="h6" sx={{ mb: 1, minWidth: '232px' }}>
        Ревьюер:
      </Typography>
      <Roulette countTargets={reviewers.length} buttonText="Выбрать ревьюера">
        {reviewers.map(({ id, login, avatar_url }) => (
          <UserCard key={id} login={login} src={avatar_url} />
        ))}
        <UserCard login={reviewers[0].login} src={reviewers[0].avatar_url} />
      </Roulette>
    </Box>
  );
};

export default AppContent;
