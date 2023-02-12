import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { isEmptyArray } from 'common/array-helpers';
import BlacklistItem from 'components/BlacklistItem';
import BlacklistSelect from 'components/BlacklistSelect';
import { useAppSelector } from 'hooks';
import { selectBlacklist, selectReviewers } from 'models/blacklist';
import { shallowEqual } from 'react-redux';

const Blacklist: React.FC = () => {
  const reviewers = useAppSelector(selectReviewers, shallowEqual);
  const blackList = useAppSelector(selectBlacklist, shallowEqual);

  if (isEmptyArray(reviewers)) {
    return null;
  }

  return (
    <>
      <Divider />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Чёрный список
      </Typography>
      <BlacklistSelect reviewers={reviewers} />
      <List dense sx={{ maxHeight: 210, overflow: 'auto' }}>
        {blackList.map((user) => (
          <BlacklistItem key={user.id} user={user} />
        ))}
      </List>
    </>
  );
};

export default Blacklist;
