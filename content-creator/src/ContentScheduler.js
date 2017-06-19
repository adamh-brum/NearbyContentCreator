import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import BeaconImage from './img/generic-beacons.jpg';
import './font-awesome-4.7.0/css/font-awesome.min.css'
import FontAwesome from 'react-fontawesome';
import axios from 'axios';

import Input from 'material-ui/Input/Input';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemSecondaryAction, ListItemText, makeSelectable } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HomeComponent from './Home.js'

const ContentSchedulerComponent = class ContentScheduler extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loadingState: 0, contentSearchText: '', selectedContentId: 0, selectedBeaconsAndTimes: [], allContent: [], displayedContent: [], beaconsAndAvailability: [] };

        this.contentSearchTextChanged = this.contentSearchTextChanged.bind(this);
        this.incrementLoadingState = this.incrementLoadingState.bind(this);
        this.revealListItem = this.revealListItem.bind(this);
        this.loadScheduler = this.loadScheduler.bind(this);

        this.getContent();
        this.getBeacons();
    }

    loadScheduler() {
        var tableStart = "<table class='schedulerTable'>";
        var tableEnd = "</table>";
        var rowStart = "<tr>";
        var rowEnd = "</tr>";
        var colStart = "<td>";
        var colEnd = "</td>";

        var tableString = tableStart;
        
        // add headings based on dates
        

        this.state.beaconsAndAvailability.forEach(function (beacon) {
            var row = "<tr id='" + beacon.beaconId + "'>" + colStart + beacon.location + colEnd;

            // Now render availability


            // End row
            row = row + rowEnd;

            // Add row to table
            tableString = tableString + row;
        });

        // End table string
        tableString = tableString + tableEnd;

        // Set table
        var table = document.getElementById('scheduler');
        table.innerHTML = tableString;
    }

    incrementLoadingState() {
        console.log('Incrementing loading state');
        this.state.loadingState = this.state.loadingState + 1;

        console.log('loading state ' + this.state.loadingState);
        if (this.state.loadingState === 2) {
            console.log('revealing form');

            // Hide loading panel
            var loading = document.getElementById('loading');
            loading.className = 'hidden';

            // Reveal form
            var mask = document.getElementById('mask');
            mask.removeAttribute("class");
            console.log('form is now visible');
        }
    }

    getContent() {
        console.log('requesting content');
        var currentState = this.state;
        axios.get("http://localhost:5000/api/Content/All").then(res => {
            console.log('content recieved');
            this.setState({ currentContent: res.data });
            this.setState({ displayedContent: res.data });

            this.incrementLoadingState();
        });
    }

    getBeacons() {
        console.log('requesting beacons');
        var currentState = this.state;
        axios.get("http://localhost:5000/api/Schedule").then(res => {
            console.log('beacons recieved');
            this.setState({ beaconsAndAvailability: res.data });

            // Now the beacons have joined the party we can load the scheduler
            this.loadScheduler();

            this.incrementLoadingState();


        });
    }

    selectContent(contentId) {
        var listItem = document.getElementById(contentId);

        if (this.state.selectedContentId === contentId) {
            // Then deslect the existing content
            this.setState({ selectedContentId: 0 });

            listItem.className = "contentPreviewBox";
        }
        else {
            this.setState({ selectedContentId: contentId });

            // Unselect all others
            var listItems = document.getElementsByTagName("li");
            for (var i = 0; i < listItems.length; i++) {
                var item = listItems[i];
                if (item.className.indexOf('selected') > -1) {
                    // deselect
                    var newClassName = 'contentPreviewBox';
                    if (item.className.indexOf('hidden') > -1) {
                        newClassName = newClassName + " hidden";
                    }

                    item.className = newClassName;
                }
            }

            listItem.className = listItem.className + " selected";
        }
    }

    contentSearchTextChanged(event) {
        var searchText = event.target.value;
        this.setState({ contentSearchText: searchText });

        var listItems = document.getElementsByTagName("li");

        // If search text is "", reveal all
        if (searchText === "") {
            for (var i = 0; i < listItems.length; i++) {
                this.revealListItem(listItems[i]);
            }
        }
        else {
            for (var i = 0; i < listItems.length; i++) {
                // Run search to see if this should be displayed
                var listItem = listItems[i];
                if (listItem.innerHTML.toUpperCase().indexOf(searchText.toUpperCase()) > -1) {
                    this.revealListItem(listItem);
                }
                else {
                    // Hide
                    listItem.className = listItem.className + " hidden";
                }
            }
        }
    }

    revealListItem(listItem) {
        if (listItem.className.indexOf("hidden") > -1) {
            // reveal
            listItem.className = listItem.className.substr(0, listItem.className.length - 6);
        }
    }

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
        var url = "http://localhost:5000/api/Beacon?id=" + this.state.uuid + "&Name=" + this.state.id + "&FriendlyName=" + this.state.friendlyName + "&Location=" + this.state.location;
        axios.post(url).then(res => {
            //const posts = res.data.data.children.map(obj => obj.data);
            //this.setState({ posts });

        });
    }

    render() {
        return (
            <div id="scheduleContent">
                <div className="App App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Schedule a Message</h2>
                </div>
                <div>
                    <Grid container gutter={24}>
                        <Grid item xs={12}>
                            <Paper className="Paper">
                                <div id="loading">
                                    Loading form...
                                </div>
                                <div id="mask" className="hidden">
                                    <div id="schedulerForm" className="contentSchedulerForm">
                                        <div id="selectContent" className="searchContentPane">
                                            <div className="contentSearchContainer">
                                                <Input
                                                    placeholder="Search for messages..."
                                                    value={this.state.contentSearchText}
                                                    onChange={this.contentSearchTextChanged}
                                                    style={{ width: '100%' }} />
                                            </div>
                                            <ul className="contentPreviewList">
                                                {
                                                    this.state.displayedContent.map(item => (
                                                        <li id={item.id} className="contentPreviewBox" dense button key={item.id} onClick={event => this.selectContent(item.id)}>
                                                            {item.title}
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                        <div id="scheduler">
                                        </div>
                                    </div>
                                </div>
                                <div className="formBottomBar">
                                    <Button raised primary={true}>Schedule</Button>
                                    <Button raised onClick={this.cancelClicked}>Cancel</Button>
                                </div>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default ContentSchedulerComponent;