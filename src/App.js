import React from 'react';
import { connect } from 'react-redux';
import * as types from './Store/Actions/index';

import Layout from './Containers/Layout/Layout';
import Spinner from './Components/Spinner/Spinner';

import './App.css';

class App extends React.Component {
  componentDidMount() {
    this.props.tryAutoSignIn();
  }

  render() {
    return (
      <div className="App">
        <Spinner 
          showSpinner={this.props.spinner}
          text = "Trying to Log you in automatically"
        />
        <Layout />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    spinner: state.auth.spinner
  }
}

const mapDispatchToProps = dispatch => {
  return {
    tryAutoSignIn: () => dispatch(types.tryAutoSignIn())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
