<!doctype html>
<html lang="en">
<head>
    <% base_tag %>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" >
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <title>Examiner</title>
</head>

<body>

<div id="app">
</div>
<script type="text/javascript">
    var examConfig = {
        code: '$Exam.Code',
        examURL: '/exam/loadexam/$Exam.Code'
    };
</script>
<script type="text/javascript" src="examinator/build/bundle.js"></script>
</body>
</html>
