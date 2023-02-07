import Container from '@mui/material/Container';

type ContainerProps = {
  children?: React.ReactNode;
};

const AppContainer: React.FC<ContainerProps> = ({ children }) => {
  return <Container maxWidth="lg">{children}</Container>;
};

export default AppContainer;
export type { ContainerProps };
