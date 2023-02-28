import AppContainer from 'components/AppContainer';
import AppContent from 'components/AppContent';
import AppPanel from 'components/AppPanel';

const App = () => {
  return (
    <>
      <AppPanel />
      <AppContainer>
        <AppContent />
      </AppContainer>
    </>
  );
};

export default App;
