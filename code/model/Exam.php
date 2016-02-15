<?php
/**
 * Created by PhpStorm.
 * User: Conrad
 * Date: 10/02/2016
 * Time: 3:46 PM
 */

namespace WebTorque\Examinator\Model;


class Exam extends \DataObject
{
    private static $singular_name = 'Exam';
    private static $plural_name = 'Exams';

    private static $db = array(
        'Title' => 'Varchar(150)',
        'Code' => 'Varchar(20)',
        'Duration' => 'Int',
        'Instructions' => 'HTMLText'
    );

    private static $has_many = array(
        'Submissions' => 'WebTorque\Examinator\Model\ExamSubmission'
    );

    private static $many_many = array(
        'Questions' => 'WebTorque\Examinator\Model\ExamQuestion'
    );

    public static function byCode($code) {
        return self::get()->filter('Code', $code)->first();
    }
}