import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppContainer from 'components/AppContainer';
import Settings from 'components/Settings';

const AppPanel: React.FC = () => {
  return (
    <AppBar position="static" sx={{ mb: 8 }}>
      <AppContainer>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, userSelect: 'none' }}>
            Случайный Ревьюeр
          </Typography>
          <Settings />
        </Toolbar>
      </AppContainer>
    </AppBar>
  );
};

export default AppPanel;
