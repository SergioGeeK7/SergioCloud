<?php

function orderMultiDimensionalArray($toOrderArray, $field, $inverse = true) {
    $position = array();
    $newRow = array();
    foreach ($toOrderArray as $key => $row) {
        $position[$key] = $row[$field];
        $newRow[$key] = $row;
    }
    if ($inverse) {
        arsort($position);
    } else {
        asort($position);
    }
    $returnArray = array();
    foreach ($position as $key => $pos) {
        $returnArray[] = $newRow[$key];
    }
    return $returnArray;
}

function readConfig ($relativePath){
  $string = file_get_contents($relativePath);
  return json_decode($string, true);  
}

function dateToUTC($arr) {

    foreach ($arr as $child => $key) {
        // $child['modified'] = strtotime($child['modified']);
        $arr[$child]['modified'] = strtotime($arr[$child]['modified']);
        // $key['modified']
    }
    // order by modified
    for ($i = 0; $i < count($arr) - 1; $i++) {
        for ($j = $i + 1; $j < count($arr); $j++) {

            if ($arr[$i]['modified'] < $arr[$j]['modified']) {
                $k = $arr[$i];
                $arr[$i] = $arr[$j];
                $arr[$j] = $k;
            }
        }
    }
    //return orderMultiDimensionalArray($arr, 'modified');
    return $arr;
}

?>
