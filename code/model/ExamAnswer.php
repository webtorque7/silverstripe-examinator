<?php
/**
 * Created by PhpStorm.
 * User: Conrad
 * Date: 11/02/2016
 * Time: 3:30 PM
 */

namespace WebTorque\Examinator\Model;


class ExamAnswer extends \DataObject
{
    private static $singular_name = 'Answer';
    private static $plural_name = 'Answers';

    private static $db = array(
        'Answer' => 'HTMLText',
        'Duration' => 'Decimal', //seconds
        'DodgyActivity' => 'Int'
    );

    private static $has_one = array(
        'Question' => 'WebTorque\Examinator\Model\ExamQuestion',
        'Submission' => 'WebTorque\Examinator\Model\ExamSubmission'
    );

    private static $summary_fields = array(
        'Question.Question',
        'Duration',
        'DodgyActivity'
    );

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();

        $fields->removeByName('Root.MainAnswer');

        $fields->addFieldToTab('Root.Main',
            \LiteralField::create('Answer', '<code class="prettyprint linenums lang-php exam-answer">' . $this->Answer . '</code>')
        );
        $fields->addFieldToTab(
            'Root.Main',
            \LiteralField::create('Question', '<div class="exam-question">' . $this->Question()->Question . '</div>'),
            'Answer'
        );

        \Requirements::css('examinator/css/exam-admin.css');

        \Requirements::css('examinator/js/prettify/prettify.css');
        \Requirements::javascript('examinator/js/prettify/prettify.js');
        \Requirements::javascript('examinator/js/SubmissionAdmin.js');

        return $fields;
    }
}