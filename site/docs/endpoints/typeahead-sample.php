<?php

	function startsWith($haystack, $needle) {
    	return substr($haystack, 0, strlen($needle)) === $needle;
	}
	
	$q = $_REQUEST['q'];
    $arr = array("Cloud CMS", "Twitter", "Facebook", "Salesforce", "Amazon", "Microsoft", "HubSpot", "Eloqua", "Oracle");

    $list = array();

    foreach ($arr as $key => $value)
    {
        array_push($list, $value);
    }

	$count = 0;
	echo "[";
    foreach ($list as $key => $value)
    {
		$valid = 1;

		if (strlen($q) > 0) 
		{
			if (!startsWith(strtolower($value), strtolower($q)))
			{
				$valid = 0;
			}
		}
		
		if ($valid)
		{
			if ($count > 0) {
				echo ",";
			}
			echo "{\"name\":\"".$value."\", \"value\":\"".$value."\"}";
			$count++;			
		}
    }
	echo "]";
?>