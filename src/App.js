import React, { Component } from 'react';
import {HashRouter as Router, Switch, Redirect, Route} from "react-router-dom";

import {ROUTES} from "./components/constants";
import SignInView from "./components/SignIn";
import SignUpView from "./components/SignUp";
import MainView from "./components/Main";

class App extends Component {
  render() {
      return (
        <Router>
            <Switch>
                <Route exact path={ROUTES.signIn} component={SignInView} />
                <Route path={ROUTES.signUp} component={SignUpView} />
                <Route path={ROUTES.main} component={MainView}/>
                <Redirect to={ROUTES.signIn}/>
            </Switch>
        </Router>
      );
  }
}

export default App;
