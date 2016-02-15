import React from 'react';
import Fetch from 'whatwg-fetch';
import ExamQuestion from './ExamQuestion.jsx';
import ExamClock from './ExamClock.jsx';

export default class Exam extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            submissionID: 0,
            started: false,
            startTime: null,
            activeQuestion: null,
            questions: [],
            instructions: '',
            startURL: '',
            saveURL: '',
            finishURL: '',
            finished: false
        };

        //load questions
        fetch(props.config.examURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                this.setState({
                    questions: json.Questions,
                    instructions: {__html: json.Instructions},
                    duration: json.Duration,
                    startURL: json.StartURL,
                    saveURL: json.SaveURL,
                    finishURL: json.FinishURL,
                    error: ''
                });
            }.bind(this));
    }

    start(e) {
        e.preventDefault();

        var name = this.refs.username.value;

        if (!name) {
            this.setState({
                error: 'Please enter your name'
            });

            return;
        }

        var data = new FormData();
        data.append('Name', name);

        fetch(this.state.startURL, {method: 'POST', body: data})
            .then(function (response) {
                try {
                    return response.json();
                } catch (e) {
                    return '';
                }
            }.bind(this))
            .then(function (json) {
                if (json && json.SubmissionID) {
                    var now = Date.now();
                    this.setState({
                        submissionID: json.SubmissionID,
                        started: true,
                        startTime: now,
                        secondsLeft: this.calculateTimeLeft(now),
                        activeQuestion: 0,
                        error: ''
                    });

                    setInterval(this.timer.bind(this), 1000);

                } else {
                    this.state.error = 'There has been an error starting the exam';
                }
            }.bind(this));

        var eventKey, keys = {
            hidden: "visibilitychange",
            webkitHidden: "webkitvisibilitychange",
            mozHidden: "mozvisibilitychange",
            msHidden: "msvisibilitychange"
        };

        for (var stateKey in keys) {
            if (stateKey in document) {
                eventKey = keys[stateKey];
                break;
            }
        }

        document.addEventListener(eventKey, this.logDodgyActivity.bind(this));
    }

    timer() {
        var timeLeft = this.calculateTimeLeft();
        this.setState({
            secondsLeft: timeLeft
        });

        if (timeLeft <= 0) {
            this.finish();
        }
    }

    submitQuestion() {
        var next = this.state.activeQuestion + 1;

        //make sure there is a next question
        if (next <= this.state.questions.length - 1) {
            this.setState({
                activeQuestion: next
            });
        } else {
            this.finish();
        }
    }

    finish() {
        var data = new FormData();
        data.append('SubmissionID', this.state.submissionID);

        fetch(this.state.finishURL, {method: 'POST', body: data})
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                if (json.Finished) {
                    this.setState({finished: true});
                }
            }.bind(this));
    }

    saveQuestion(answer, duration, callback) {
        if (this.state.saveURL) {
            var activeQuestion = this.state.questions[this.state.activeQuestion],
                payload = new FormData();

            payload.append('SubmissionID', this.state.submissionID);
            payload.append('QuestionID', activeQuestion.ID);
            payload.append('Answer', answer);
            payload.append('Duration', duration);
            payload.append('DodgyActivity', activeQuestion.DodgyActivity);

            fetch(this.state.saveURL, {method: 'POST', body: payload})
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    if (callback) {
                        callback();
                    }
                    //handle errors
                });
        }
    }

    calculateTimeLeft(start) {
        //convert duration to seconds, subtract time passed since exam started
        var startTime = start ? start : this.state.startTime;
        return (this.state.duration * 60) - ((Date.now() - startTime) / 1000);
    }

    currentQuestionNumber() {
        return this.state.activeQuestion + 1;
    }

    logDodgyActivity() {
        console.log('logging');
        var question = this.state.questions[this.state.activeQuestion];

        this.state.questions[this.state.activeQuestion].DodgyActivity = question.DodgyActivity ? question.DodgyActivity + 1 : 1;
    }

    render() {
        var minutes = Math.floor(this.state.secondsLeft / 60).toPrecision(2),
            seconds = Math.ceil(this.state.secondsLeft - (minutes * 60)).toPrecision(2);

        return <div className="exam">
            <div className="centered">
                {function () {
                    if (this.state.finished) {
                        return <div className="finished"><p style={{color:'green'}}>Congratulations, you have finished</p></div>
                    }
                    else if (this.state.started) {
                        return <div>
                            <div className="info">
                                <ExamClock minutes={minutes} seconds={seconds}/>
                                <div className="questions">
                                    Question {this.currentQuestionNumber()} of {this.state.questions.length}
                                </div>

                            </div>
                            <ExamQuestion
                                question={this.state.questions[this.state.activeQuestion]}
                                saveHandler={this.saveQuestion.bind(this)}
                                submissionID={this.state.submissionID}
                                onSubmit={this.submitQuestion.bind(this)}
                            />
                        </div>;
                    } else {
                        return <div className="start">
                            {function () {
                                if (this.state.error) {
                                    return <p style={{color:'red'}}>{this.state.error}</p>;
                                }
                            }.call(this)}

                            {function () {
                                if (this.state.instructions) {
                                    return <div dangerouslySetInnerHTML={this.state.instructions}/>;
                                }
                            }.call(this)}

                            <form ref="startForm" name="frmStartForm" encType="application/x-www-form-urlencoded">
                                <div className="fields">
                                    <input type="text" className="form-control" name="Name" ref="username" placeholder="Enter Your Name"/>
                                </div>
                                <div className="actions">
                                    <button className="btn btn-lg" onClick={this.start.bind(this)}>Start</button>
                                </div>
                            </form>
                        </div>;
                    }
                }.call(this)}
            </div>
        </div>;
    }
}