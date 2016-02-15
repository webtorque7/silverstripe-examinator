(function($){
    $.entwine('ss', function($){
        $('code.exam-answer').entwine({
            onadd:function() {
                prettyPrint();
            }
        });
    });
})(jQuery);