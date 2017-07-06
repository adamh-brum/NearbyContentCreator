import React from 'react';
import ReactDOM from 'react-dom';

import FontAwesome from 'react-fontawesome';
import axios from 'axios';

import Input from 'material-ui/Input/Input';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import '../App.css';
import '../font-awesome-4.7.0/css/font-awesome.min.css'
import Header from './Helpers/Header.js'
import HomeComponent from '../Home.js'
import StickyFooter from './Helpers/StickyFooter.js'
import NavigationBar from './Helpers/NavigationBar.js'

const AddBeaconComponent = class AddBeacon extends React.Component {
    constructor(props) {
        super(props);
        this.state = { uuid: '', beaconId: '', minor: '', major: '', friendlyName: '', location: '' };

        this.uuidChanged = this.uuidChanged.bind(this);
        this.beaconIdChanged = this.beaconIdChanged.bind(this);
        this.friendlyNameChanged = this.friendlyNameChanged.bind(this);
        this.locationChanged = this.locationChanged.bind(this);
        this.minorChanged = this.minorChanged.bind(this);
        this.majorChanged = this.majorChanged.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
    }

    minorChanged(event) {
        this.setState({ minor: event.target.value });
    }

    majorChanged(event) {
        this.setState({ major: event.target.value });
    }

    uuidChanged(event) {
        this.setState({ uuid: event.target.value });
    }

    beaconIdChanged(event) {
        this.setState({ beaconId: event.target.value });
    }

    friendlyNameChanged(event) {
        this.setState({ friendlyName: event.target.value });
    }

    locationChanged(event) {
        this.setState({ location: event.target.value });
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

        axios.post(
            "http://localhost:5000/api/Beacon", {
                uuid: this.state.uuid,
                beaconId: this.state.beaconId,
                minorVersion: this.state.minor,
                majorVersion: this.state.major,
                friendlyName: this.state.friendlyName,
                location: this.state.location
            })
            .then(res => {
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
            <div id="addBeacon">
                <Header subtitle="Add Beacon" />
                <NavigationBar backEvent={this.cancelClicked} />
                <div>
                    <Grid container gutter={24}>
                        <Grid item xs={12}>
                            <Paper className="Paper">
                                <form id="addBeaconForm" onSubmit={this.handleSubmit} className="Form">
                                    <br />
                                    <div className="Paper">
                                        <p>To add a beacon to the system, use the below form. The details you need to enter are simple but crucial. Get these wrong and messages will not be delivered to these beacons!</p>
                                        <p>To ensure you collect this information accurately, follow manufacturer instructions. The manufacturer will normally provide an app which reads beacon details. Read the values from that app which correspond to the values required below </p>
                                    </div>

                                    <Input
                                        placeholder="Unique Identifier (UUID)"
                                        value={this.state.uuid}
                                        onChange={this.uuidChanged}
                                        fullWidth={true} />
                                    <br />
                                    <Input
                                        value={this.state.beaconId}
                                        onChange={this.beaconIdChanged}
                                        placeholder="Beacon Identifier"
                                        fullWidth={true} />
                                    <br />
                                    <Input
                                        value={this.state.minor}
                                        onChange={this.minorChanged}
                                        placeholder="Minor"
                                        fullWidth={true} />
                                    <br />
                                    <Input
                                        value={this.state.major}
                                        onChange={this.majorChanged}
                                        placeholder="Major"
                                        fullWidth={true} />
                                    <br />
                                    <Input
                                        value={this.state.friendlyName}
                                        onChange={this.friendlyNameChanged}
                                        placeholder="Friendly Name"
                                        fullWidth={true} />
                                    <br />
                                    <Input
                                        value={this.state.location}
                                        onChange={this.locationChanged}
                                        placeholder="Location"
                                        fullWidth={true} />
                                    <br />
                                    <Button raised primary={true}>Add Beacon</Button>
                                    <Button raised secondary={true} onClick={this.cancelClicked}>Cancel</Button>
                                </form>
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
                <StickyFooter />
            </div>
        );
    }
}
export default AddBeaconComponent;