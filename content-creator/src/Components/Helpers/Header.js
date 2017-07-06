import React from 'react';
import ReactDOM from 'react-dom';
import logo from '../../logo.svg';
import '../../App.css';

const NavigationBarComponent = class NavigationBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = { subtitle: props.subtitle }
    }

    render() {
        return (
            <div className="App App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>Welcome to the Capgemini Messages Creator</h2>
                <p><i>{this.state.subtitle}</i></p>
            </div>
        );
    }
};

export default NavigationBarComponent;