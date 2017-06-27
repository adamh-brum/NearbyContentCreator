import React from 'react';
import ReactDOM from 'react-dom';

import Button from 'material-ui/Button';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import FontAwesome from 'react-fontawesome';

import ContentScheduler from './ContentScheduler.js';
import ContentDesigner from './ContentDesigner.js';
import AddBeaconComponent from './AddBeacon.js';
import ContentSelectorComponent from './Components/ContentSelector.js';

import BeaconImage from './img/generic-beacons.jpg';
import NewBeaconImage from './img/new-beacons.jpg';
import ContentImage from './img/contentcreation.jpg';
import BusyBeaconImage from './img/beacon-in-use.png';
import MarketingCampaignImage from './img/marketing-campaign-strategy.jpg';
import logo from './logo.svg';
import './App.css';
import './font-awesome-4.7.0/css/font-awesome.min.css'

const HomeComponent = class HomeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };
        this.navigateToAddBeacon = this.navigateToAddBeacon.bind(this);
        this.navigateToContentManager = this.navigateToContentManager.bind(this);
        this.navigateToContentDesigner = this.navigateToContentDesigner.bind(this);
    }

    navigateToAddBeacon(event) {
        ReactDOM.render(
            <MuiThemeProvider>
                <AddBeaconComponent />
            </MuiThemeProvider>,
            document.getElementById('root'));
    }

    navigateToContentDesigner(event) {
        ReactDOM.render(
            <MuiThemeProvider>
                <ContentDesigner />
            </MuiThemeProvider>,
            document.getElementById('root'));
    }

    navigateToContentManager(event) {
        ReactDOM.render(
            <MuiThemeProvider>
                <ContentSelectorComponent />
            </MuiThemeProvider>,
            document.getElementById('root'));
    }

    render() {
        return (
            <div id="home">
                <div className="App App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Welcome to the Design Studio</h2>
                </div>
                <div id="cardContainer" className="TilesContainer">
                    <Card className="Tile">
                        <CardMedia className="TileMedia">
                            <img src={NewBeaconImage} alt="Beacons" />
                        </CardMedia>
                        <CardContent>
                            <Typography type="headline" component="h2">
                                Add a Beacon
                            </Typography>
                            <Typography component="p">
                                Register a new beacon to use in campaigns and events.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button compact primary onClick={this.navigateToAddBeacon}>Add Beacon</Button>
                        </CardActions>
                    </Card>
                    <Card className="Tile">
                        <CardMedia className="TileMedia">
                            <img src={BusyBeaconImage} alt="Beacons" />
                        </CardMedia>
                        <CardContent>
                            <Typography type="headline" component="h2">
                                View Deployed Beacons
                            </Typography>
                            <Typography component="p">
                                View and make amendments to the list of beacons currently on the estate
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button compact primary onClick={this.navigateToAddBeacon}>View Beacons</Button>
                        </CardActions>
                    </Card>
                    <Card className="Tile">
                        <CardMedia className="TileMedia">
                            <img src={ContentImage} alt="Content Creator" />
                        </CardMedia>
                        <CardContent>
                            <Typography type="headline" component="h2">
                                Create Messages
                            </Typography>
                            <Typography component="p">
                                Design and publish messages for marketing and communications. 
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button compact primary onClick={this.navigateToContentDesigner}>Create Messages</Button>
                        </CardActions>
                    </Card>
                </div>
                <div id="cardContainerRow2" className="TilesContainer">
                    <Card className="Tile">
                        <CardMedia className="TileMedia">
                            <img src={BusyBeaconImage} alt="Schedule Content" />
                        </CardMedia>
                        <CardContent>
                            <Typography type="headline" component="h2">
                                Manage Messages
                            </Typography>
                            <Typography component="p">
                                View all messages stored by the system. Choose when and where messages should be broadcast, make changes to messages or delete them entirely.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button compact primary onClick={this.navigateToContentManager}>Manage Messages</Button>
                        </CardActions>
                    </Card>
                    <Card className="Tile">
                        <CardMedia className="TileMedia">
                            <img src={MarketingCampaignImage} alt="Marketing Campaign Image" />
                        </CardMedia>
                        <CardContent>
                            <Typography type="headline" component="h2">
                                Create Campaign
                            </Typography>
                            <Typography component="p">
                                Create a campaign to automatically run multiple pieces of content across the beacon network at chosen times.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button compact primary onClick={this.navigateToContentCreator}>Create Campaign</Button>
                        </CardActions>
                    </Card>
                    <Card className="Tile">
                        <CardMedia className="TileMedia">
                            <img src={MarketingCampaignImage} alt="Marketing Campaign Image" />
                        </CardMedia>
                        <CardContent>
                            <Typography type="headline" component="h2">
                                View Campaigns
                            </Typography>
                            <Typography component="p">
                                View completed and in-flight campaigns. Run reports to analyse campaign impact. This feature allows you to make changes to in-flight campaigns.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button compact primary onClick={this.navigateToContentCreator}>View Campaign</Button>
                        </CardActions>
                    </Card>
                </div>
            </div >);
    }
}

export default HomeComponent;