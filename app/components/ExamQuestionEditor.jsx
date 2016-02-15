import React from 'react';

export default class ExamQuestionEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            html: ''
        };

        this.styles = [
            {regex: /(^='.*?')/gm, className: 'string'},
            {regex: /(^=".*?")/gm, className: 'string'},
            {regex: /(\$\w)/gm, className: 'variable'}
        ];

        this.formatTimer = null;
        this.formatDelay = 100;

        if (this.refs.editor) this.refs.editor.innerHTML = '';
    }

    onChange(e) {
        if (this.props.onChange) {
            this.props.onChange(this.refs.editor.innerHTML);
        }
    }

    componentDidMount(){
        this.refs.editor.focus();
    }

    componentDidUpdate(prevProps, prevState) {
        //if key changed we have a new editor
        if (prevProps && prevProps.key !== this.props.key) {
            this.refs.editor.innerHTML = '';
        }
    }

    onKeyDown(e) {
        if (e.keyCode === 9 && e.shiftKey) {
            document.execCommand("outdent", true, null);
        } else if (e.keyCode === 9) {
            e.preventDefault();
            document.execCommand('indent', false, null);
        }

        this.onChange(e);
    }

    getValue() {
        return this.refs.editor.innerHTML;
    }

    render() {
        return <div>
            <code
                className="editor"
                ref="editor"
                onKeyDown={this.onKeyDown.bind(this)}
                onChange={this.onChange.bind(this)}
                contentEditable
                spellCheck="false"
            />
            <p>Use Tab to indent, Shift+Tab to remove indent</p>
        </div>;
    }
}