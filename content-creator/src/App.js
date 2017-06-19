import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './font-awesome-4.7.0/css/font-awesome.min.css'
import FontAwesome from 'react-fontawesome';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import HomeComponent from './Home.js'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <HomeComponent />
      </MuiThemeProvider>
    );
  }
}

export default App;
