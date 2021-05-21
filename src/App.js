import React from 'react';
import {connect} from 'react-redux';
import * as types from './Store/Actions/index';

import Layout from './Containers/Layout/Layout';

import './App.css';

class App extends React.Component {
  componentDidMount () {
    this.props.tryAutoSignIn();
  }

  render(){
    return (
      <div className="App">
        <Layout />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    tryAutoSignIn : () => dispatch(types.tryAutoSignIn())
  }
}

export default connect(null,mapDispatchToProps)(App);
