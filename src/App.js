import {React, useEffect} from 'react';
import { connect } from 'react-redux';
import * as types from './Store/Actions/index';

import Layout from './Containers/Layout/Layout';
import Spinner from './Components/Spinner/Spinner';

import './App.css';

const App = (props) => {

  useEffect(() => {
      props.tryAutoSignIn();
  }, []);

  return (
    <div className="App">
      <Spinner 
        showSpinner={props.spinner}
        text = "Trying to Log you in automatically"
      />
      <Layout />
    </div>
  );

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
