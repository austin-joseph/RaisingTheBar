import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/home/Home';
import AuthContainer from './components/auth/AuthContainer';
import BartopContainer from './components/bartop/BartopContainer';
import CreatorContainer from './components/creator/CreatorContainer';
import Workshop from './components/workshop/Workshop';
import Results from './components/results/Results.jsx';
import NoMatch from './components/NoMatch';

class App extends Component {
  render() {
    return (
      <React.Fragment>
          <BrowserRouter basename={process.env.PUBLIC_URL+"/"}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/user/login" component={AuthContainer} />
              <Route path="/user/signup" component={AuthContainer} />
              <Route path="/user/forgot-password" component={AuthContainer} />
              <Route path="/user/reset-password" component={AuthContainer} />
              <Route path="/bartop/:var1/:var2?/:var3?" component={BartopContainer} />
              <Route path="/creator/:var1?" component={CreatorContainer} />
              <Route path="/workshop" component={Workshop} />
              <Route path="/results/:var1/:var2?/:var3?" component={Results} />
              <Route component={NoMatch} />
            </Switch>
          </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;