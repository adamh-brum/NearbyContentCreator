import React from 'react';
import ReactDOM from 'react-dom';

import Button from 'material-ui/Button';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import FontAwesome from 'react-fontawesome';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import ContentDesigner from './Components/ContentDesigner.js';
import AddBeaconComponent from './Components/AddBeacon.js';
import ContentSelectorComponent from './Components/ContentSelector.js';
import StickyFooter from './Components/Helpers/StickyFooter.js'
import Header from './Components/Helpers/Header.js'

import BeaconImage from './img/generic-beacons.jpg';
import NewBeaconImage from './img/new-beacons.jpg';
import ContentImage from './img/contentcreation.jpg';
import BusyBeaconImage from './img/beacon-in-use.png';
import MarketingCampaignImage from './img/marketing-campaign-strategy.jpg';
import EventImage from './img/capgemini_event.jpg';
import MaintenanceImage from './img/Maintenance-Icon.png';
import ReportImage from './img/report2.jpg';
import './font-awesome-4.7.0/css/font-awesome.min.css'

const HomeComponent = class HomeComponent extends React.Component {
    constructor(props) {
        super(props);

        this.navigateToAddBeacon = this.navigateToAddBeacon.bind(this);
        this.navigateToContentManager = this.navigateToContentManager.bind(this);
        this.navigateToContentDesigner = this.navigateToContentDesigner.bind(this);
        this.handleSystemWarningClose = this.handleSystemWarningClose.bind(this);
        this.shouldWarningBeDisplayed = this.shouldWarningBeDisplayed.bind(this);

        var show = this.shouldWarningBeDisplayed();
        this.state = { value: '', warningOpen: show };
    }

    shouldWarningBeDisplayed(){
        var date = localStorage.getItem("WarningDate");
        var lastWarned = new Date();
        if(date != "undefined"){
            lastWarned = new Date(date);
        }
        
        var show = false;

        // If they haven't seen a warning for 30 minutes, show it
        var nextWarnTime = new Date(lastWarned.getTime() + 30*60000);
        var now = new Date();
        if(now.getTime() > nextWarnTime){
            date = now;
            show = true;
        }

        localStorage.setItem("WarningDate", date);
        return show;
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

    handleSystemWarningClose(event) {
        this.setState({ warningOpen: false });
    }

    render() {
        return (
            <div id="home">
                <Dialog open={this.state.warningOpen} onRequestClose={this.handleSystemWarningClose}>
                    <DialogTitle>
                        {"Welcome to the Alpha Release"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            The service you are about to use, The Capgemini Messages Creator, is currently in Pre-Beta. This means you might have a bumpy ride through the system, and can expect a few issues. Here are a few known "gotcha's" to watch out for:
                            <ul>
                                <li>Do not use browser navigation! This will take you out of the site. Use on screen buttons only</li>
                                <li>When you make a change or save a record, you will stay on your current page. Just click cancel to get back to the home page</li>
                            </ul>

                            That's all you need to know for now! Let's get going <FontAwesome name='rocket' />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSystemWarningClose} color="primary">
                            Understood!
                        </Button>
                    </DialogActions>
                </Dialog>
                <Header/>
                <div className="homeBody">
                    <h3>Features available now</h3>
                    <p> Check out the features below! These are live and ready to use now</p>
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
                    </div>
                    <h3>Coming soon....</h3>
                    <p>These features are getting their finishing touches, but will be ready shortly! Keep an eye out for them going live.</p>
                    <div id="cardContainerRow2" className="TilesContainer">
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
                                <Button compact disabled primary onClick={this.navigateToAddBeacon}>View Beacons</Button>
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
                                <Button compact disabled primary onClick={this.navigateToContentCreator}>Create Campaign</Button>
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
                                <Button compact disabled primary onClick={this.navigateToContentCreator}>View Campaign</Button>
                            </CardActions>
                        </Card>
                    </div>
                    <h3>In the pipeline....</h3>
                    <p>There are even more great features on the way! These are a little further down the line, but it still won't be too long until you can play with them!</p>
                    <div id="cardContainerRow3" className="TilesContainer">
                        <Card className="Tile">
                            <CardMedia className="TileMedia">
                                <img src={EventImage} alt="Beacons" />
                            </CardMedia>
                            <CardContent>
                                <Typography type="headline" component="h2">
                                    Setup an Event
                            </Typography>
                                <Typography component="p">
                                    Events run a little differently to a normal campaign, giving you enhanced control to tailor message delivery. Normally, messages are sent out on a timed schedule. Events allow you to book beacons exclusively for an entire day, and then have an event owner queue up and fire out messages based on your agenda. An event could be a meeting, conference or teambuilding exercise.
                            </Typography>
                            </CardContent>
                            <CardActions>
                                <Button compact disabled primary onClick={this.navigateToAddBeacon}>Create Event</Button>
                            </CardActions>
                        </Card>
                        <Card className="Tile">
                            <CardMedia className="TileMedia">
                                <img src={ReportImage} alt="Report Image" />
                            </CardMedia>
                            <CardContent>
                                <Typography type="headline" component="h2">
                                    Report on Messages
                            </Typography>
                                <Typography component="p">
                                    Check how sucessful your messages are. User engagement is tracked in a variety of ways - number of views, thumbs up and down for different messages can be viewed here.
                            </Typography>
                            </CardContent>
                            <CardActions>
                                <Button compact disabled primary onClick={this.navigateToContentCreator}>View Reports</Button>
                            </CardActions>
                        </Card>
                        <Card className="Tile">
                            <CardMedia className="TileMedia">
                                <img src={MaintenanceImage} alt="Report Image" />
                            </CardMedia>
                            <CardContent>
                                <Typography type="headline" component="h2">
                                    Beacon Maintenance
                            </Typography>
                                <Typography component="p">
                                    Check when beacons need their battery changing, and make sure none of them have gone missing!
                            </Typography>
                            </CardContent>
                            <CardActions>
                                <Button compact disabled primary onClick={this.navigateToContentCreator}>Beacon Maintenance</Button>
                            </CardActions>
                        </Card>
                    </div>
                </div>
                <StickyFooter/>
            </div >);
    }
}

export default HomeComponent;