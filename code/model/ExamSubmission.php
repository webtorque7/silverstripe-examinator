<?php
/**
 * Created by PhpStorm.
 * User: Conrad
 * Date: 11/02/2016
 * Time: 3:28 PM
 */

namespace WebTorque\Examinator\Model;


class ExamSubmission extends \DataObject
{
    private static $singular_name = 'Submission';
    private static $plural_name = 'Submissions';

    private static $db = array(
        'Name' => 'Varchar(255)',
        'StartTime' => 'SS_Datetime',
        'FinishTime' => 'SS_Datetime',
    );

    private static $has_one = array(
        'Exam' => 'WebTorque\Examinator\Model\Exam'
    );

    private static $has_many = array(
        'Answers' => 'WebTorque\Examinator\Model\ExamAnswer'
    );

    private static $summary_fields = array(
        'Name',
        'StartTime',
        'FinishTime',
        'Duration'
    );

    public function Duration()
    {
        $minutes = (strtotime($this->FinishTime) - strtotime($this->StartTime))/60;
        return  number_format($minutes, 2) . ' minutes';
    }
}