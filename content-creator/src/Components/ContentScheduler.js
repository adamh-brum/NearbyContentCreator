import React from 'react';
import ReactDOM from 'react-dom';
import logo from '../logo.svg';
import '../App.css';
import BeaconImage from '../img/generic-beacons.jpg';
import '../font-awesome-4.7.0/css/font-awesome.min.css'
import FontAwesome from 'react-fontawesome';
import axios from 'axios';

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
        this.state = { contentId: props.contentId, contentName: props.contentName, beaconsAndAvailability: [] }

        this.saveClicked = this.saveClicked.bind(this);

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
        var headings = "<tr>" + colStart + "" + colEnd;
        var scope = this;
        var headersRendered = false;

        var tableBody = "";
        this.state.beaconsAndAvailability.forEach(function (beacon) {
            var row = "<tr id='" + beacon.beaconId + "'>" + colStart + beacon.beaconLocation + colEnd;

            // Calculate number of columns to display
            var width = window.innerWidth;
            var numberOfColumnsRaw = width / 90; // Each column needs approx 90px
            var cols = Math.round(numberOfColumnsRaw);

            // Render table
            beacon.timeslots.forEach(function (timeslot, index) {

                // Keep rendering columns up to the limit that can be viewed on screen
                if (index < cols) {
                    if (!headersRendered) {
                        headings = headings + colStart + scope.formatDateAsDay(timeslot.start) + colEnd;
                    }

                    // Is there any bookings for this timeslot?
                    var col = "<td data-beacon='" + beacon.beaconId + "' data-selectable data-timeslot-start='" + timeslot.start + "' data-timeslot-end='" + timeslot.end + "' class='";
                    var colContents = "";
                    if (timeslot.bookings != "undefined" && timeslot.bookings.length > 0) {
                        var booked = false;
                        timeslot.bookings.forEach(function (booking) {
                            if (booking.contentId.toString() == scope.state.contentId) {
                                booked = true;
                            }
                        })

                        if (booked) {
                            col = col + "booked'>"; 
                        }
                    }
                    else {
                        col = col + "unbooked'>";
                    }

                    row = row + col + colContents + colEnd;
                }
            });

            headersRendered = true;

            // End row
            row = row + rowEnd;

            // Add row to table
            tableBody = tableBody + row;
        });

        // End table string
        tableString = tableString + headings + tableBody + tableEnd;

        // Set table
        var table = document.getElementById('scheduler');
        table.innerHTML = tableString;
    }

    formatDateAsDay(date) {
        var m = new Date(date);
        return "W/C " + m.getUTCDate() + "/" + m.getMonth();
    }

    getBeacons() {
        console.log('requesting beacons');
        var currentState = this.state;
        axios.get("http://localhost:5000/api/Schedule").then(res => {
            console.log('beacons recieved');
            this.setState({ beaconsAndAvailability: res.data, bookingHintClass: "" });

            // Now the beacons have joined the party we can load the scheduler
            this.loadScheduler();
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

        var url = "http://localhost:5000/api/Schedule";
        axios.put(url, { bookings: selectedCells }).then(res => {
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
                    <div className='form'>
                        <h3>Choose locations and times to broadcast your message: {this.state.contentName}</h3>
                        <p>Use the table below to select slots you want the message to be broadcast. Simply click one or many dates and times and then click save.</p>
                        <div id="scheduler" onClick={this.selectCell}>
                        </div>
                        <br />
                        <p>When you are happy with your bookings, click save</p>
                        <Button raised primary={true} onClick={this.saveClicked}>Save</Button>
                        <Button raised secondary={true} onClick={this.cancelClicked}>Cancel</Button>
                    </div>
                </div>
                <StickyFooter />
            </div>
        );
    }
}

export default ContentSchedulerComponent;