import React from 'react';
import ReactDOM from 'react-dom';
import logo from '../logo.svg';
import '../App.css';
import BeaconImage from '../img/generic-beacons.jpg';
import '../font-awesome-4.7.0/css/font-awesome.min.css'
import FontAwesome from 'react-fontawesome';
import axios from 'axios';

import Chip from 'material-ui/Chip';
import Input from 'material-ui/Input/Input';
import Icon from 'material-ui/Icon';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import DateRangeIcon from 'material-ui-icons/DateRange';
import Typography from 'material-ui/Typography';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from './Helpers/Header.js'
import HomeComponent from '../Home.js';
import StickyFooter from './Helpers/StickyFooter.js'
import ContentSchedulerComponent from './ContentScheduler.js';
import NavigationBarComponent from './Helpers/NavigationBar.js';

const ContentSelectorComponent = class ContentSelectorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { content: [] }

        this.contentSearchTextChanged = this.contentSearchTextChanged.bind(this);
        this.displayListItem = this.displayListItem.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
        this.navigateToContentScheduler = this.navigateToContentScheduler.bind(this);

        this.getContent();
    }

    navigateToContentScheduler(event) {
        var buttonData = event.currentTarget.dataset;
        ReactDOM.render(
            <MuiThemeProvider>
                <ContentSchedulerComponent contentId={buttonData.contentid} contentName={buttonData.contenttitle} />
            </MuiThemeProvider>,
            document.getElementById('root'));
    }

    getContent() {
        console.log('requesting content');
        var currentState = this.state;
        axios.get("http://nearbycontentapi.azurewebsites.net/api/Content/All").then(res => {
            console.log('content recieved');
            this.setState({ content: res.data });
        });
    }

    displayListItem(listItem) {
        if (listItem.className.indexOf("hidden") > -1) {
            // reveal
            listItem.className = "contentPreviewBoxContainer";
        }
    }

    contentSearchTextChanged(event) {
        var searchText = event.target.value;
        var listItems = document.getElementsByTagName("li");

        // If search text is "", reveal all
        if (searchText === "") {
            for (var i = 0; i < listItems.length; i++) {
                this.displayListItem(listItems[i]);
            }
        }
        else {
            for (var i = 0; i < listItems.length; i++) {
                // Run search to see if this should be displayed
                var listItem = listItems[i];
                if (listItem.dataset.searchable.toUpperCase().indexOf(searchText.toUpperCase()) > -1) {
                    this.displayListItem(listItem);
                }
                else {
                    // Hide
                    listItem.className = listItem.className + " hidden";
                }
            }
        }
    }

    cancelClicked(event) {
        ReactDOM.render(
            <MuiThemeProvider>
                <HomeComponent />
            </MuiThemeProvider>,
            document.getElementById('root'));
    }

    render() {
        return (
            <div id="scheduleContent">
                <Header subtitle="Manage Message" />
                <NavigationBarComponent backEvent={this.cancelClicked} />
                <div>
                    <div id="schedulerForm" className="contentSchedulerForm page">
                        <div id="selectContent" className="searchContentPane">
                            <div className="contentSearchContainer">
                                <Input
                                    placeholder="Filter messages..."
                                    value={this.state.contentSearchText}
                                    onChange={this.contentSearchTextChanged}
                                    style={{ width: '100%' }} />
                            </div>
                            <ul className="contentPreviewList">
                                {
                                    this.state.content.map(item => (
                                        <li id={item.id} className="contentPreviewBoxContainer" dense button key={item.id} data-searchable={item.title + item.tags}>
                                            <Paper>
                                                {
                                                    item.tags.map(tag => (
                                                        <Chip
                                                            className="modern-chip"
                                                            label={tag}
                                                        />
                                                    ))
                                                }
                                                <div className="contentPreviewBox">
                                                    <div className="contentPreviewBoxActions">
                                                        <IconButton data-contentid={item.id} data-contenttitle={item.title} onClick={this.navigateToContentScheduler} aria-label="Schedule">
                                                            <DateRangeIcon />
                                                        </IconButton>
                                                        <IconButton aria-label="Edit">
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton aria-label="Delete">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>
                                                    <h4>{item.title}</h4>
                                                </div>
                                            </Paper>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <StickyFooter />
            </div>
        );
    }
}

export default ContentSelectorComponent;