import React from 'react';
import ExamQuestionEditor from './ExamQuestionEditor.jsx';

export default class ExamQuestion extends React.Component {

    constructor(props) {
        super(props);

        //delay until it saves, cancels previous saves, prevents multiple saves triggered
        this.saveDelay = 500;
        //reference to setTimeout object
        this.saveTimer = null;

        this.state = {
            startTime: Date.now()
        };
    }

    save(answer, callback) {
        if (this.props.saveHandler) {
            if (this.saveTimer) clearTimeout(this.saveTimer);

            this.saveTimer = setTimeout(function(){
                //convert duration to seconds
                console.log(Date.now(), this.state.startTime, Date.now() - this.state.startTime);
                var duration = (Date.now() - this.state.startTime) / 1000;
                console.log(duration);
                this.props.saveHandler(answer, duration, callback);
            }.bind(this), this.saveDelay)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps && prevProps.question.ID !== this.props.question.ID) {
            this.setState({
                startTime: Date.now()
            })
        }
    }

    onSubmit(e) {
        e.preventDefault();

        if (this.props.onSubmit) {
            this.save(this.refs.editor.getValue(), function(){
                this.props.onSubmit();
            }.bind(this));
        }
    }


    render() {
        var getQuestion = function () {
            return {__html:this.props.question.Question};
        }.bind(this);

        return <div className="exam-question">
            <div className="question-text" dangerouslySetInnerHTML={getQuestion()}></div>
            <ExamQuestionEditor ref="editor" key={this.props.question.ID} onChange={this.save.bind(this)} />
            <button onClick={this.onSubmit.bind(this)}>Submit</button>
        </div>;
    }
}