<?PHP?><?

// 
// Simple PHP JSON/P Echo - "Cowboy" Ben Alman - http://benalman.com/
// v1.0 - 2/20/2009
// 

// Show script source if no params are passed
if (count($_GET) == 0) {
  highlight_file($_SERVER['SCRIPT_FILENAME']);
  die;
}

// Get request params
$obj = array();
foreach ($_GET as $key => $value) {
  $obj[$key] = $value;
}
foreach ($_POST as $key => $value) {
  $obj[$key] = $value;
}

$json_string = isset($obj['JSON']) ? $obj['JSON'] : null;
$jsonp_callback = isset($obj['callback']) ? $obj['callback'] : null;

// remove misc unneeded params
unset($obj['_']);
unset($obj['callback']);
unset($obj['JSON']);

$json = $json_string ? $json_string : json_encode($obj);
$jsonp = $jsonp_callback ? $jsonp_callback . "($json)" : $json;


sleep(1); // simulate slow connection :D


$is_xhr = isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';

$is_referer = isset($_SERVER["HTTP_REFERER"]);

if ($is_xhr) {
  
  header( 'Content-type: application/json' );
  print $jsonp;
  
} else if ($is_referer) {
  
  $params = array();
  foreach ($obj as $key => $value) {
    $params[] = urlencode($key) . '=' . urlencode($value);
  }
  
  $url = preg_replace('/\?.*$/', '', $_SERVER["HTTP_REFERER"]);
  $url .= '?' . implode('&', $params);
  
  header( "Location: $url");
  
} else {
  
  header( 'Content-type: text/plain' );
  
  print $jsonp;
  
}

?>
