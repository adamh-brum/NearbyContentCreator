import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import BeaconImage from './img/generic-beacons.jpg';
import './font-awesome-4.7.0/css/font-awesome.min.css'
import FontAwesome from 'react-fontawesome';
import Input from 'material-ui/Input/Input';
import axios from 'axios';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import HomeComponent from './Home.js'

const AddBeaconComponent = class AddBeacon extends React.Component {
    constructor(props) {
        super(props);
        this.state = { uuid: '', beaconId: '', friendlyName: '', location: '' };

        this.uuidChanged = this.uuidChanged.bind(this);
        this.beaconIdChanged = this.beaconIdChanged.bind(this);
        this.friendlyNameChanged = this.friendlyNameChanged.bind(this);
        this.locationChanged = this.locationChanged.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
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

        // Submit to API
        var url = "http://localhost:5000/api/Beacon?id=" + this.state.uuid + "&Name=" + this.state.id + "&FriendlyName=" + this.state.friendlyName + "&Location=" + this.state.location;
        axios.post(url).then(res => {
            //const posts = res.data.data.children.map(obj => obj.data);
            //this.setState({ posts });

        });

    }

    render() {
        return (
            <div id="addBeacon">
                <div className="App App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Register a Beacon</h2>
                </div>
                <div>
                    <Grid container gutter={24}>
                        <Grid item xs={12}>
                            <Paper className="Paper">
                                <form id="addBeaconForm" onSubmit={this.handleSubmit} className="Form">
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
            </div>
        );
    }
}
export default AddBeaconComponent;