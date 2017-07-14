import React from 'react';
import ReactDOM from 'react-dom';
import logo from '../logo.svg';
import '../App.css';
import BeaconImage from '../img/generic-beacons.jpg';
import '../font-awesome-4.7.0/css/font-awesome.min.css'
import FontAwesome from 'react-fontawesome';
import axios from 'axios';

import Menu, { MenuItem } from 'material-ui/Menu';
import Input from 'material-ui/Input/Input';
import Icon from 'material-ui/Icon';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import DateRangeIcon from 'material-ui-icons/DateRange';
import Typography from 'material-ui/Typography';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from './Helpers/Header.js'
import StickyFooter from './Helpers/StickyFooter.js'
import NavigationBarComponent from './Helpers/NavigationBar.js';
import ContentSelector from './ContentSelector.js'

const ContentSchedulerComponent = class ContentScheduler extends React.Component {
    constructor(props) {
        super(props);
        this.state = { menuOpen: false, selectedIndex: 0, contentId: props.contentId, contentName: props.contentName, beaconsAndAvailability: [ { timeslots: []} ], bookingOptions: ['Weekly', 'Daily', 'Hourly'] };

        this.saveClicked = this.saveClicked.bind(this);
        this.getClass = this.getClass.bind(this);
        this.handleClickListItem = this.handleClickListItem.bind(this);
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        this.formatDateAsDay = this.formatDateAsDay.bind(this);

        this.getBeacons();
    }

    handleClickListItem = event => {
        this.setState({ menuOpen: true });
    };

    handleMenuItemClick = (event, index) => {
        this.setState({ selectedIndex: index, open: false });
    };

    handleRequestClose = () => {
        this.setState({ menuOpen: false });
    };

    formatDateAsDay(date) {
        var m = new Date(date);
        return "W/C " + m.getUTCDate() + "/" + m.getMonth();
    }

    getBeacons() {
        console.log('requesting beacons');
        var currentState = this.state;
        axios.get("http://nearbycontentapi.azurewebsites.net/api/Schedule").then(res => {
            console.log('beacons recieved');
            this.setState({ beaconsAndAvailability: res.data, bookingHintClass: "" });
        });
    }

    selectCell(event) {
        var element = event.target;

        // Proceed only if element is selectable
        if (element.dataset.selectable != undefined) {
            if (element.className === "booked") {
                element.className = "unbooked";
            }
            else if (element.className === "clashedBooking") {
                element.className = "clashed";
            }
            else if (element.className === "clashed") {
                element.className = "clashedBooking";
            }
            else {
                // Add all these to state
                element.className = "booked";
            }
        }
    }

    closeBookingHint(event) {
        this.setState({ bookingHintClass: "hidden" })
    }

    cancelClicked(event) {
        ReactDOM.render(
            <MuiThemeProvider>
                <ContentSelector />
            </MuiThemeProvider>,
            document.getElementById('root'));
    }

    saveClicked(event) {
        // Display confirmation
        var table = document.getElementById('scheduler');
        var cells = table.getElementsByTagName("td");
        var selectedCells = [];
        var currentState = this.state;
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            // get all booked cells (do not get any clashed cells as they are already saved)
            if (cell.className.indexOf("booked") === 0) {
                selectedCells.push({
                    contentId: currentState.contentId,
                    beaconId: cell.dataset.beacon,
                    start: cell.dataset.timeslotStart,
                    end: cell.dataset.timeslotEnd
                });
            }
        }

        console.log("Ready to submit selected beacon timeslots to the API");
        console.log(JSON.stringify(selectedCells));

        var url = "http://nearbycontentapi.azurewebsites.net/api/Schedule";
        axios.put(url, { bookings: selectedCells }).then(res => {
            if (res.data.statusCode === 1) {
                alert("Save was successful. You may now return to home by pressing cancel.");
            }
            else {
                alert("Save failed");
            }
        });
    }

    getClass(timeslot) {
        var scope = this;
        var className = null;
        timeslot.bookings.forEach(function (booking) {
            if (booking.contentId.toString() == scope.state.contentId) {
                className = "booked";
            }
        })

        return className;
    }

    render() {
        return (
            <div id="scheduleContent">
                <Header subtitle="Schedule Message" />
                <NavigationBarComponent backEvent={this.cancelClicked} />
                <div className='page'>
                    <div className='form'>
                        <h3>Choose locations and times to broadcast your message: {this.state.contentName}</h3>
                        <p>You can make bookings for by selecting timeslots on the table below. Simply click the cell that corresponds to the location and time you want to book</p>
                        <p>By default, a booking is a week long, you can reduce this down to days or hours if you prefer</p>
                        <Menu
                            id="booking-menu"
                            open={this.state.menuOpen}
                            onRequestClose={this.handleRequestClose}>
                            {
                                this.state.bookingOptions.map((option, index) =>
                                    <MenuItem
                                        key={option}
                                        selected={index === this.state.selectedIndex}
                                        onClick={event => this.handleMenuItemClick(event, index)}>
                                        {option}
                                    </MenuItem>
                                )}
                        </Menu>
                        <div id="scheduler" onClick={this.selectCell}>
                            {
                                <table className='schedulerTable'>
                                    <tr id="header">
                                        <td>Beacon Location</td>
                                        {
                                            this.state.beaconsAndAvailability[0].timeslots.map(timeslot => (
                                                <td>{this.formatDateAsDay(timeslot.start)}</td>
                                            ))
                                        }
                                    </tr>
                                    {
                                        this.state.beaconsAndAvailability.map(beacon => (
                                            <tr id={beacon.beaconId}>
                                                <td>
                                                    {beacon.beaconLocation}
                                                </td>
                                                {
                                                    beacon.timeslots.map(timeslot => (
                                                        <td
                                                            data-beacon={beacon.beaconId}
                                                            data-selectable data-timeslot-start={timeslot.start}
                                                            data-timeslot-end={timeslot.end}
                                                            className={this.getClass(timeslot)}>
                                                        </td>
                                                    ))
                                                }
                                            </tr>
                                        ))
                                    }
                                </table>
                            }
                        </div>
                        <br />
                        <p>When you are happy with your bookings, click save</p>
                        <Button raised primary={true} onClick={this.saveClicked}>Save</Button>
                        <Button raised onClick={this.cancelClicked}>Cancel</Button>
                    </div>
                </div>
                <StickyFooter />
            </div>
        );
    }
}

export default ContentSchedulerComponent;