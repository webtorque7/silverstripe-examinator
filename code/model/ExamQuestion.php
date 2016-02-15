<?php
/**
 * Created by PhpStorm.
 * User: Conrad
 * Date: 10/02/2016
 * Time: 3:49 PM
 */

namespace WebTorque\Examinator\Model;


class ExamQuestion extends \DataObject
{
    private static $singular_name = 'Question';
    private static $plural_name = 'Questions';

    private static $db = array(
        'Question' => 'HTMLText'
    );

    private static $summary_fields = array(
        'Question'
    );
}