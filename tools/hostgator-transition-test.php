<?php
define('ZOMEDIA_TRANSITION_TEST', true);
require $argv[1];
$base = ['HTTP_HOST'=>'zomediaproductions.com', 'REQUEST_METHOD'=>'GET', 'REQUEST_URI'=>'/books/?source=launch'];
function expect($actual, $expected) { if ($actual !== $expected) { throw new RuntimeException(json_encode([$actual, $expected])); } }
expect(zomedia_transition_plan($base), ['status'=>200,'url'=>'https://zomediaproductions.com/books/?source=launch','method'=>'GET']);
expect(zomedia_transition_plan(array_replace($base,['HTTP_HOST'=>'www.zomediaproductions.com']))['status'],200);
foreach (['shop.zomediaproductions.com','evil.example','zomediaproductions.com.evil.example','zomediaproductions.com:443'] as $host) {
    expect(zomedia_transition_plan(array_replace($base,['HTTP_HOST'=>$host])),['status'=>404]);
}
foreach (['//evil.example/path',"/bad\nheader",'https://evil.example/'] as $path) {
    expect(zomedia_transition_plan(array_replace($base,['REQUEST_URI'=>$path])),['status'=>400]);
}
expect(zomedia_transition_plan(array_replace($base,['REQUEST_METHOD'=>'PUT'])),['status'=>405]);
expect(zomedia_transition_plan(array_replace($base,['CONTENT_LENGTH'=>1048577])),['status'=>413]);
expect(zomedia_transition_plan(array_replace($base,['REQUEST_METHOD'=>'POST','REQUEST_URI'=>'/thanks/?form=contact']))['method'],'POST');
echo "Transition routing: 12 checks passed\n";
