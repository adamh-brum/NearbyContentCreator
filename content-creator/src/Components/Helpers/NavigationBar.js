import React from 'react';
import ReactDOM from 'react-dom';
import '../../font-awesome-4.7.0/css/font-awesome.min.css'
import FontAwesome from 'react-fontawesome';

const NavigationBarComponent = class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        
        this.backClicked = props.backEvent;
    }

    render() {
        return (
            <div>
                <div className="navigationBar">
                    <a href='#' onClick={this.backClicked}><FontAwesome name='arrow-left' /> Back</a>
                </div>
            </div>
        );
    }
};

export default NavigationBarComponent;