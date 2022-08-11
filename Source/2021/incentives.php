




<?php

$date = new DateTime();

$incentivesInfo = json_decode(file_get_contents("incentives.json"));
$secondsElapsed = $date->getTimestamp() - $incentivesInfo[0]->time;

if($secondsElapsed < 30)
{

    echo 'Success';

} else{

    $incentivesInfo = array();

    $response = json_decode(file_get_contents('https://extralife.donordrive.com/api/participants/448764/incentives'));
    
    foreach($response as $incentive) {
        $incentivesInfo[] = array(
            'Name' => $incentive->description,
            'Price' => "$" . strval($incentive->amount),
            'Active' => $incentive->isActive,
            'time' => $date->getTimestamp()
        );
    }

    file_put_contents("incentives.json", json_encode($incentivesInfo), LOCK_EX);

    echo 'Success';


}




