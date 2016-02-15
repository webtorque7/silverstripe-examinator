require('../scss/layout.scss');
import React from 'react';
import ReactDOM from 'react-dom';
import Exam from './components/Exam.jsx';

ReactDOM.render(<Exam config={examConfig}/>, document.getElementById('app'));