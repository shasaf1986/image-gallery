import React, { useMemo } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import createStore from '../../store';
import { Provider } from 'react-redux';

const App: React.FC = ({ children }) => {
  const store = useMemo(() => createStore(), []);

  return (
    <Provider store={store}>
      <CssBaseline />
      <Container>{children}</Container>
    </Provider>
  );
};

export default App;
