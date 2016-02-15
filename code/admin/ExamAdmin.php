<?php
/**
 * Created by PhpStorm.
 * User: Conrad
 * Date: 10/02/2016
 * Time: 3:50 PM
 */

namespace WebTorque\Examinator\Admin;


class ExamAdmin extends \ModelAdmin
{
    private static $url_segment = 'exams';
    private static $menu_title = 'Exams';
    private static $managed_models = array(
        'WebTorque\Examinator\Model\Exam',
        'WebTorque\Examinator\Model\ExamSubmission',
        'WebTorque\Examinator\Model\ExamQuestion',
    );
}