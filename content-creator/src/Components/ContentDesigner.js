import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Input from 'material-ui/Input/Input';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

import Header from './Helpers/Header.js'
import NavigationBar from './Helpers/NavigationBar.js'
import StickyFooter from './Helpers/StickyFooter.js'
import HomeComponent from '../Home.js';
import logo from '../logo.svg';
import '../App.css';
import '../font-awesome-4.7.0/css/font-awesome.min.css'
import FontAwesome from 'react-fontawesome';

const TabContainer = props => (
  <div style={{ padding: 20 }}>
    {props.children}
  </div>
);


class ContentDesigner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { index: 0, notification: '', content: '' };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancelClicked = this.cancelClicked.bind(this);
    this.notificationTextChanged = this.notificationTextChanged.bind(this);
    this.onContentChanged = this.onContentChanged.bind(this);
  }

  onContentChanged(event) {
    this.setState({ content: event.target.value });
  }

  handleTabChanged = (event, index) => {
    this.setState({ index });
  };

  notificationTextChanged(event) {
    this.setState({ notification: event.target.value });
  };

  cancelClicked(event) {
    ReactDOM.render(
      <MuiThemeProvider>
        <HomeComponent />
      </MuiThemeProvider>,
      document.getElementById('root'));
  }

  handleSubmit(event) {
    // Todo validate (All fields mandatory)
    event.preventDefault();

    // Submit to API
    axios.post("http://nearbycontentapi.azurewebsites.net/api/Content", { title: this.state.notification, content: this.state.content }).then(res => {
      if (res.data.statusCode === 1) {
        alert("Save was successful. You may now return to home by pressing cancel.");
      }
      else {
        alert("Save failed");
      }
    });
  }

  render() {
    return (
      <div id="contentCreator">
        <Header subtitle="Create Message" />
        <NavigationBar backEvent={this.cancelClicked} />

        <Paper className="Paper">
          <form id="createContentForm" onSubmit={this.handleSubmit} className="Form">
            <div>
              <Tabs index={this.state.index} onChange={this.handleTabChanged}>
                <Tab label="Notification" />
                <Tab label="Message" />
                <Tab label="Save" />
              </Tabs>
            </div>
            {
              this.state.index === 0 &&
              <TabContainer>
                <h3>Add a notification to the message</h3>
                <p>When content is delivered to a user's phone, a notification will be shown. What is your message about? The notification should sum it up in as few words as possible.</p>
                <Input
                  placeholder="Boo! I'm a notification."
                  value={this.state.notification}
                  onChange={this.notificationTextChanged} />
                <br />
              </TabContainer>
            }
            {
              this.state.index === 1 &&
              <TabContainer>
                <h3>Message Text</h3>
                <p>What do you want your message to say?</p>
                <div className="designer-left">
                  <div onClick={this.focus}>
                    <textarea
                      className="HtmlEditor"
                      value={this.state.content}
                      onChange={this.onContentChanged} />
                  </div>
                </div>
                <div className="designer-right">
                  <h4>Stuck for ideas?</h4>
                  <p>
                    The box on your left is as limitless as your imagination. It's roughly the maximum size a message can be in the Cagepmini Messages App.
                  </p>
                  <p>
                    You can fill it with whatever you want. Plaintext is fine, but if you have the know-how why not try using HTML and embedding CSS styles? This will spice up your message with colour and help grab peoples attention.
                  </p>
                </div>
              </TabContainer>
            }
            {
              this.state.index === 2 &&
              <TabContainer>
                <h3>Time to save</h3>
                <h4>Before you save, make sure you have...</h4>
                <ul>
                  <li>Created an amazing and catchy notification. </li>
                  <li>Put together a snazzy message using your best HTML developer hat </li>
                </ul>
                <Button raised primary={true}>Add Content</Button>
                <Button raised secondary={true} onClick={this.cancelClicked}>Cancel</Button>
              </TabContainer>
            }
          </form>
        </Paper>
        <StickyFooter />
      </div>
    );
  }
}

export default ContentDesigner;