import { PayloadAction, Selector } from 'global-types';
import { User } from 'models/user';
import { Reducer } from 'redux';

type RepositoryName = string;
type Contributors = User[];
type Repository = {
  name: RepositoryName;
  contributors: Contributors;
};

const SET_REPOSITORY_ACTION = 'REPOSITORY::SET';

type SetRepositoryAction = PayloadAction<typeof SET_REPOSITORY_ACTION, Repository>;
type RepositoryAction = SetRepositoryAction;

type SetRepositoryGenerator = (payload: Repository) => SetRepositoryAction;

const setRepository: SetRepositoryGenerator = (payload) => ({
  type: SET_REPOSITORY_ACTION,
  payload,
});

type RepositoryState = Repository | null;

const repositoryReducer: Reducer<RepositoryState, RepositoryAction> = (state = null, action): RepositoryState => {
  switch (action.type) {
    case SET_REPOSITORY_ACTION:
      return action.payload;
    default:
      return state;
  }
};

const selectRepository: Selector<RepositoryState> = ({ repository }) => repository;
const selectRepositoryName: Selector<RepositoryName> = ({ repository }) => (repository ? repository.name : '');
const selectContributors: Selector<Contributors> = ({ repository }) => (repository ? repository.contributors : []);

export default repositoryReducer;
export { setRepository, selectRepository, selectRepositoryName, selectContributors };
export type { RepositoryName, Contributors, RepositoryState, RepositoryAction };
