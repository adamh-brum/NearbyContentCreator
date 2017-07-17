import React from 'react';
import ReactDOM from 'react-dom';
import logo from '../logo.svg';
import '../App.css';
import BeaconImage from '../img/generic-beacons.jpg';
import '../font-awesome-4.7.0/css/font-awesome.min.css'
import FontAwesome from 'react-fontawesome';
import axios from 'axios';
import DateTime from 'react-datetime';
import Checkbox from 'material-ui/Checkbox';
import Moment from 'moment';

import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Input from 'material-ui/Input/Input';
import Icon from 'material-ui/Icon';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import DeleteIcon from 'material-ui-icons/Delete';
import Typography from 'material-ui/Typography';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from './Helpers/Header.js'
import StickyFooter from './Helpers/StickyFooter.js'
import NavigationBarComponent from './Helpers/NavigationBar.js';
import ContentSelector from './ContentSelector.js'

const ContentSchedulerFormComponent = class ContentSchedulerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectBeaconDialogOpen: false, checkedBeacon: 0, newBooking: {}, contentId: props.contentId, contentName: props.contentName, beacons: [], beaconBookings: [] };

        this.saveClicked = this.saveClicked.bind(this);
        this.openBeaconSelect = this.openBeaconSelect.bind(this);
        this.handleStartTimeChanged = this.handleStartTimeChanged.bind(this);
        this.handleEndTimeChanged = this.handleEndTimeChanged.bind(this);
        this.addBooking = this.addBooking.bind(this);
        this.deleteBooking = this.deleteBooking.bind(this);
        this.getBeacons();
    }

    openBeaconSelect() {
        this.setState({ selectBeaconDialogOpen: true });
    }

    handleBeaconChanged(event, value) {
        var newBookingObject = this.state.newBooking;
        newBookingObject.beaconId = "";
        newBookingObject.beaconLocation = "";
        newBookingObject.beaconFriendlyName = "";

        var updatedBeacons = this.state.beacons;
        this.state.beacons.forEach(function (beacon) {
            if (beacon.beaconId === value.beaconId) {
                beacon.checked = !beacon.checked;
                if (beacon.checked) {
                    newBookingObject.beaconId = value.beaconId;
                    newBookingObject.beaconLocation = value.beaconLocation;
                    newBookingObject.beaconFriendlyName = value.beaconFriendlyName;
                }
            }
            else {
                beacon.checked = false;
            }
        }, this);
        this.setState({ newBooking: newBookingObject, selectedBeaconName: value.beaconFriendlyName, beacons: updatedBeacons });
    }

    handleStartTimeChanged(event) {
        var newBookingObject = this.state.newBooking;
        newBookingObject.startTime = event.target.value;
        this.setState({ newBooking: newBookingObject });
    }

    handleEndTimeChanged(event) {
        var newBookingObject = this.state.newBooking;
        newBookingObject.endTime = event.target.value;
        this.setState({ newBooking: newBookingObject });
    }

    addBooking() {
        var updatedBookings = this.state.beaconBookings;
        updatedBookings.push({
            beaconId: this.state.newBooking.beaconId,
            beaconFriendlyName: this.state.newBooking.beaconFriendlyName,
            beaconLocation: this.state.newBooking.beaconLocation,
            start: new Moment(this.state.newBooking.startTime, "DD/MM/YYYY HH:mm"),
            end: new Moment(this.state.newBooking.endTime, "DD/MM/YYYY HH:mm")
        });

        this.setState({ selectBeaconDialogOpen: false, beaconBookings: updatedBookings });
    }

    getBeacons() {
        console.log('requesting beacons');
        var currentState = this.state;
        axios.get("http://nearbycontentapi.azurewebsites.net/api/Schedule/Raw").then(res => {
            console.log('beacons recieved');

            var beacons = [];
            var beaconBookings = [];
            res.data.forEach(function (beacon) {
                beacons.push({
                    beaconId: beacon.beaconId,
                    beaconFriendlyName: beacon.friendlyName,
                    beaconLocation: beacon.location,
                    checked: false
                });

                beacon.bookings.forEach(function (booking) {
                    if (booking.contentId == this.state.contentId) {
                        var startTime = new Moment(booking.start);
                        var endTime = new Moment(booking.end);
                        beaconBookings.push(
                            {
                                beaconId: beacon.beaconId,
                                beaconFriendlyName: beacon.friendlyName,
                                beaconLocation: beacon.location,
                                start: startTime,
                                end: endTime,
                            }
                        )
                    }
                }, this);
            }, this);

            this.setState({ beacons: beacons, beaconBookings: beaconBookings });
        });
    }

    deleteBooking(booking) {
        var updatedBookings = [];
        this.state.beaconBookings.forEach(function (existingBooking) {
            if (existingBooking.beaconId != booking.beaconId
                && existingBooking.start.format("DDMMYYYYHHmm") != booking.start.format("DDMMYYYYHHmm")
                && existingBooking.end.format("DDMMYYYYHHmm") != booking.end.format("DDMMYYYYHHmm")) {
                updatedBookings.push(existingBooking);
            }
            else {
                console.log("Deleting booking " + existingBooking.beaconId);
            }
        });

        this.setState({ beaconBookings: updatedBookings });
    }

    cancelClicked(event) {
        ReactDOM.render(
            <MuiThemeProvider>
                <ContentSelector />
            </MuiThemeProvider>,
            document.getElementById('root'));
    }

    saveClicked(event) {
        // 2017-10-23T00:00:00+00:00
        var bookings = [];
        var currentState = this.state;
        this.state.beaconBookings.forEach(function (booking) {
            bookings.push({
                contentId: currentState.contentId,
                beaconId: booking.beaconId,
                start: booking.start.format('YYYY-MM-DDTHH:mm:SS+00:00'),
                end: booking.end.format('YYYY-MM-DDTHH:mm+00:00')
            })
        }, this);

        var url = "http://nearbycontentapi.azurewebsites.net/api/Schedule";
        axios.put(url, { bookings: bookings }).then(res => {
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
            <div id="scheduleContent">
                <Header subtitle="Schedule Message" />
                <NavigationBarComponent backEvent={this.cancelClicked} />
                <div className='page'>
                    <Dialog open={this.state.selectBeaconDialogOpen}>
                        <DialogTitle>
                            {"Create Booking"}
                        </DialogTitle>
                        <DialogContent>
                            <h3>Select a Beacon</h3>
                            <p>Select one beacon. To schedule message broadcast across multiple beacons, you can create another booking after</p>
                            <List>
                                {this.state.beacons.map(index => (
                                    <ListItem button onClick={event => this.handleBeaconChanged(event, index)}>
                                        <Checkbox
                                            checked={index.checked}
                                            tabIndex="-1"
                                            disableRipple
                                        />
                                        <ListItemText primary={index.beaconLocation} secondary={index.beaconFriendlyName} />
                                    </ListItem>
                                ))}
                            </List>
                            <h3>Start Date</h3>
                            <p>Enter the start date and time for your broadcast.</p>
                            <Input label="Start Date and Time" value={this.state.startTime} placeholder="DD/MM/YYYY HH:MM" onChange={this.handleStartTimeChanged} /><br />
                            <h3>End Date</h3>
                            <p>Enter the end date and time for your broadcast.</p>
                            <Input label="End Date and Time" value={this.state.endTime} placeholder="DD/MM/YYYY HH:MM" onChange={this.handleEndTimeChanged} /><br /><br />
                            <Button raised primary={true} color="primary" onClick={this.addBooking}>Add Booking</Button>
                        </DialogContent>
                    </Dialog>
                    <div className='form'>
                        <h3>Choose locations and times to broadcast your message: {this.state.contentName}</h3>
                        <p>When you are happy with your bookings, click save</p>
                        <div id="newBookingForm" className="addBookingContainer">
                            <Paper>
                                <div className="addBookingForm">
                                    <h4>Add a booking</h4>
                                    <p>You can make as many beacon bookings for a message as you like. Just click the button below</p>
                                    <Button raised primary={true} color="primary" onClick={this.openBeaconSelect}>Add Booking</Button>
                                </div>
                            </Paper>
                        </div>
                        <h3>Bookings</h3>
                        <p>When you click save, your message will broadcast from the following messages at the following times</p>
                        <ul className="contentPreviewList">
                            {
                                this.state.beaconBookings.map(item => (
                                    <li className="contentPreviewBoxContainer">
                                        <Paper>
                                            <div className="contentPreviewBox">
                                                <div className="contentPreviewBoxActions">
                                                    <IconButton aria-label="Delete" onClick={() => this.deleteBooking(item)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </div>
                                                <h4>Beacon {item.beaconFriendlyName} booked (Location: {item.beaconLocation})</h4>
                                                <h4>Start: {item.start == undefined ? "" : item.start.format('DD MMM YYYY HH:mm')}</h4>
                                                <h4>End: {item.end == undefined ? "" : item.end.format('DD MMM YYYY HH:mm')}</h4>
                                            </div>
                                        </Paper>
                                    </li>
                                ))
                            }
                        </ul>
                        <Button raised primary={true} color="primary" onClick={this.saveClicked}>Save</Button>
                        <Button raised onClick={this.cancelClicked}>Cancel</Button>
                    </div>
                </div>
                <StickyFooter />
            </div>
        );
    }
}

export default ContentSchedulerFormComponent;