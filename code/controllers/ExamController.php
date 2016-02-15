<?php
/**
 * Created by PhpStorm.
 * User: Conrad
 * Date: 10/02/2016
 * Time: 4:38 PM
 */

namespace WebTorque\Examinator\Controllers;

use WebTorque\Examinator\Model\Exam;
use WebTorque\Examinator\Model\ExamAnswer;
use WebTorque\Examinator\Model\ExamSubmission;

class ExamController extends \Controller
{
    private static $allowed_actions = array(
        'start',
        'loadexam',
        'startexam',
        'finishexam',
        'savequestion'
    );

    public function start()
    {
        if ($code = $this->request->param('ID')) {
            if ($exam = Exam::byCode($this->request->param('ID'))) {
                return $this->customise(['Exam' => $exam])->renderWith('Exam');
            } else {
                die('Couldn\'t find exam');
            }
        } else {
            die('Please specify an exam');
        }
    }

    /**
     * Loads exam and returns json with exam and questions
     *
     * @return \SS_HTTPResponse
     */
    public function loadexam()
    {
        if ($code = $this->request->param('ID')) {
            if ($exam = Exam::byCode($this->request->param('ID'))) {
                $return = [
                    'Code' => $exam->Code,
                    'Duration' => $exam->Duration,
                    'Instructions' => $exam->dbObject('Instructions')->forTemplate(),
                    'Questions' => [],
                    'SaveURL' => '/exam/savequestion',
                    'StartURL' => '/exam/startexam/' . $exam->Code,
                    'FinishURL' => '/exam/finishexam/' . $exam->Code
                ];

                foreach ($exam->Questions() as $question) {
                    $return['Questions'][] = [
                        'ID' => $question->ID,
                        'Question' => $question->Question
                    ];
                }

                return $this->respond($return);
            }
        }
    }

    /**
     * Started the exam, returns the submission id
     *
     * @return \SS_HTTPResponse
     */
    public function startexam()
    {
        if ($code = $this->request->param('ID')) {
            if ($exam = Exam::byCode($this->request->param('ID'))) {
                $submission = ExamSubmission::create();
                $submission->Name = $this->getRequest()->postVar('Name');
                $submission->StartTime = \SS_Datetime::now()->getValue();
                $submission->ExamID = $exam->ID;
                $submission->write();


                return $this->respond([
                    'SubmissionID' => $submission->ID
                ]);
            }
        }
    }

    /**
     * Marks the subbmission for the exam as finished
     *
     * @return \SS_HTTPResponse
     */
    public function finishexam()
    {
        if ($submission = ExamSubmission::get()->byID($this->getRequest()->postVar('SubmissionID'))) {
            $submission->FinishTime = \SS_Datetime::now()->getValue();
            $submission->write();

            return $this->respond([
                'Finished' => true
            ]);
        }
    }

    /**
     * Saves the answer to a question
     *
     * @return \SS_HTTPResponse
     * @throws \ValidationException
     * @throws null
     */
    public function savequestion()
    {
        $submissionID = $this->getRequest()->postVar('SubmissionID');
        $questionID = $this->getRequest()->postVar('QuestionID');
        $answerText = $this->getRequest()->postVar('Answer');
        $duration = $this->getRequest()->postVar('Duration');
        $activity = $this->getRequest()->postVar('DodgyActivity');

        if ($submissionID && $questionID) {
            $answer = ExamAnswer::get()->filter([
                'SubmissionID' => $submissionID,
                'QuestionID' => $questionID
            ])->first();

            if (!$answer) {
                $answer = new ExamAnswer();
                $answer->SubmissionID = $submissionID;
                $answer->QuestionID = $questionID;
                $answer->Duration = $duration;
                $answer->DodgyActivity = $activity;
            }

            $answer->Answer = $answerText;
            $answer->write();

            return $this->respond([
                'Status' => 1,
            ]);
        }

        return $this->respond([
            'Status' => 0,
            'Message' => 'An error has occurred saving your answer'
        ]);
    }

    /**
     * Returns JSON response
     *
     * @param $response
     * @return \SS_HTTPResponse
     */
    private function respond($response)
    {
        $json = \Convert::raw2json($response);

        $response = new \SS_HTTPResponse($json, 200);
        $response->addHeader('Content-Type', 'application/json');

        return $response;
    }
}