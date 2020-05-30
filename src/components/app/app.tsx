import React, { Fragment } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import PhotoGallery from '../photoGallery';

const App: React.FC = () => (
  <Fragment>
    <CssBaseline />
    <Container>
      <PhotoGallery />
    </Container>
  </Fragment>
);

export default App;
