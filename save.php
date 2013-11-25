<?php
$status = true;
header('Content-Type: application/json');
try {
    $request = json_decode(file_get_contents('php://input'));
    $filename = $request->filename;
    if(isset($request->markdown)){
        $markdown = $request->markdown;
        $mdFile = fopen('output/'.$filename.'.md', 'w');
        $status = $status && fwrite($mdFile, $markdown);
        fclose($mdFile);
    }
    if(isset($request->html)){
        $html = urldecode($request->html);
        $html = preg_replace('/%u([a-fA-F0-9]{4})/', '&#x\\1;', $html);
        $header = "<html><head><link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.2/js/bootstrap.min.js'></head><body>";
        $footer = "</body></html>";
        $html = $header . $html . $footer;
        $htmlFile = fopen('output/'.$filename.'.html', 'w');
        $status = $status && fwrite($htmlFile, $html);
        fclose($htmlFile);
    }
    echo '{"status":'.$status.'}';
}catch(Exception $e){
    echo '{"status": "Exception"}';
}

?>
