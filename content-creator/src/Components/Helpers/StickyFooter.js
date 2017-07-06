import React from 'react';
import ReactDOM from 'react-dom';

var style = {
    backgroundColor: "#F8F8F8",
    borderTop: "2px solid #222",
    textAlign: "center",
    padding: "20px",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%",
};

var phantom = {
  display: 'block',
  padding: '20px',
  height: '60px',
  width: '100%',
}

const StickyFooter = React.createClass({
    render: function() {
        return (
            <div>
                <div style={phantom} />
                <div style={style}>
                    Have any feedback? Questions? Want to have a chat about the weather? <a href="mailto:adam.haycock@capgemini.com">Click here and ping the developer a (nice) message</a>
                </div>
            </div>
        );
    }
});

export default StickyFooter;