
import React from 'react';

export default class ExamClock extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        return <div className="clock">
            Time Left:
            <span className="minutes">{this.props.minutes}</span>:
            <span className="seconds">{this.props.seconds}</span>
        </div>;
    }
}
