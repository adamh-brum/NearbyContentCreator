import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';
import HomeComponent from './Home.js';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Input from 'material-ui/Input/Input';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

// Draft.js imports
import {
  Editor,
  createEditorState,
} from 'medium-draft';
import { MegadraftEditor, editorStateFromRaw } from "megadraft";
import "./Styles/Megadraft/css/megadraft.css"
import {stateToHTML} from 'draft-js-export-html';

//import '../../node_modules/react-quill/node_modules/quill/dist/quill.snow.css';
import logo from './logo.svg';
import './App.css';
import './font-awesome-4.7.0/css/font-awesome.min.css'
import FontAwesome from 'react-fontawesome';

const TabContainer = props => (
  <div style={{ padding: 20 }}>
    {props.children}
  </div>
);


class ContentDesigner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: editorStateFromRaw(null), index: 0, notification: '', beacons: [], checked: [0] };
    this.getBeacons();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancelClicked = this.cancelClicked.bind(this);
    this.notificationTextChanged = this.notificationTextChanged.bind(this);
    this.onContentChanged = this.onContentChanged.bind(this);
  }

  onContentChanged(editorState) {
    this.setState({editorState});
  }

  getBeacons() {
    var url = "http://localhost:5000/api/Beacon";
    axios.get(url).then(res => {
      res.data.forEach(function (element) {
        var newArray = this.state.beacons.slice();
        newArray.push({ beacon: element, checked: false });
        this.setState({ beacons: newArray })
      }, this);

      // Will leave this commented in case I ever need it again
      /*this.state.beacons.forEach(function (element) {
        alert(element.beacon.id);
      }, this);*/
    })
  }

  handleChange = (event, index) => {
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

    var locationIds = [];
    this.state.beacons.forEach(function (element) {
      if (element.checked) {
        locationIds.push(element.beacon.id);
      }
    }, this);

    // Submit to API
    let html = stateToHTML(this.state.editorState.getCurrentContent());
    var url = "http://localhost:5000/api/Content?shortDescription=" + this.state.notification + "&content=" + html + "&locationIds=" + locationIds;
    axios.post(url).then(res => {
      //const posts = res.data.data.children.map(obj => obj.data);
      //this.setState({ posts });
      alert('Submitted to API');
    });
  }

  handleToggle = (event, value) => {
    this.state.beacons.forEach(function (element) {
      if (element.beacon.id == value) {
        element.checked = !element.checked
      }
    }, this);
  };

  checked(value) {
    this.state.beacons.forEach(function (element) {
      if (element.beacon.id == value) {
        return element.checked;
      }
    }, this);
  };

  render() {
    return (
      <div id="contentCreator">
        <div className="App App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Get creative and design content</h2>
        </div>

        <Paper className="Paper">
          <form id="createContentForm" onSubmit={this.handleSubmit} className="Form">
            <div>
              <Tabs index={this.state.index} onChange={this.handleChange}>
                <Tab label="Describe" />
                <Tab label="Design" />
                <Tab label="Schedule" />
                <Tab label="Save" />
              </Tabs>
            </div>
            {
              this.state.index === 0 &&
              <TabContainer>
                <h3>What is the content for?</h3>
                <p>When content is delivered to a user's phone, a notification will be shown. What should the notification say?</p>
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
                <h3>Content Designer</h3>
                <p>Welcome to the design part. This is where you get really creative. <FontAwesome name='rocket' className='red' /> </p>
                <div className="designer-left">
                  <div onClick={this.focus}>
                    <MegadraftEditor
                      editorState={this.state.editorState}
                      onChange={this.onContentChanged} />
                  </div>
                </div>
                <div className="designer-right">
                  <p>Stuck for ideas? Here are some things to try</p>
                  <ul>
                    <li>See the box on the left <FontAwesome name='cube' className='blue' />? Click inside. </li>
                    <li>This box can be as wild as your imagination. It's a mockup of a card. This card will be displayed on a mobile phone <FontAwesome name='phone' className='violet' /></li>
                    <li>When you are inside the box, you can start typing. Try highlighting words you type and see what happens....</li>
                    <li>Also, spice up your content with some media. Use the media toolbar to the left (+) to insert pictures and movies</li>
                  </ul>
                </div>
              </TabContainer>
            }
            {
              this.state.index === 2 &&
              <TabContainer>
                <h3>Schedule Content (Optional)</h3>
                <p>This feature allows you to quickly determine which locations content will be delivered in. You can do this later on via Create Campaign or Schedule Content. Users passing these locations will see a notification and have the content card delivered to their device</p>
                <p><b>Please note this feature is in Beta Mode. By default, all content will begin broadcasting as soon as you save content and broadcast for 5 days.</b> After this, the content will still exist but will not broadcast until rescheduled.</p>
                <h4>Please select broadcast locations:</h4>
                <List>
                  {this.state.beacons.map(index => (
                    <ListItem dense button key={index.beacon.id} onClick={event => this.handleToggle(event, index.beacon.id)}>
                      <Checkbox
                        checked={this.checked(index.beacon.id)}
                        tabIndex="-1"
                        ripple={false}
                      />
                      <ListItemText primary={`${index.beacon.friendlyName} | ${index.beacon.location}`} />
                      <ListItemSecondaryAction>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </TabContainer>
            }
            {
              this.state.index === 3 &&
              <TabContainer>
                <h3>Time to save</h3>
                <h4>Before you save, make sure you have...</h4>
                <ul>
                  <li>This is your vision for the content, so it's important it describes what you've created. It will be used to grab users attention with notifications and help you remember what you've created!</li>
                  <li>Created the content! Ensure it looks good and fits your brand.</li>
                </ul>
                <Button raised primary={true}>Add Content</Button>
                <Button raised secondary={true} onClick={this.cancelClicked}>Cancel</Button>
              </TabContainer>
            }
          </form>
        </Paper>
      </div>
    );
  }
}

export default ContentDesigner;