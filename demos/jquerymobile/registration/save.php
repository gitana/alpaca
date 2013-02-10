<?php

    //
    // Photo File comes in as "photoFile" part
    // Here we just print out details about the upload
    //
    if ($_FILES["photoFile"]["error"] > 0)
    {
        echo "Error: " . $_FILES["photoFile"]["error"] . "<br>";
    }
    else
    {
        echo "Upload: " . $_FILES["photoFile"]["name"] . "<br>";
        echo "Type: " . $_FILES["photoFile"]["type"] . "<br>";
        echo "Size: " . ($_FILES["photoFile"]["size"] / 1024) . " kB<br>";
        echo "Stored in: " . $_FILES["photoFile"]["tmp_name"];
    }

    echo "<br/>";
    echo "<br/>";

    //
    // JSON properties from the form
    //
    $name = $_POST['name'];
    $email = $_POST['email'];
    $organization = $_POST['organization'];
    $workPhone = $_POST['workPhone'];
    $cellPhone = $_POST['cellPhone'];
    $address1 = $_POST['address1'];
    $address2 = $_POST['address2'];
    $city = $_POST['city'];
    $state = $_POST['state'];
    $workPhone = $_POST['workPhone'];
    $zipcode = $_POST['zipcode'];
    $country = $_POST['country'];
    $emergencyContact = $_POST['emergencyContact'];
    $vegetarian = $_POST['vegetarian'];
    $dietaryComments = $_POST['dietaryComments'];
    $roomJune3 = $_POST['roomJune3'];
    $roomJune4 = $_POST['roomJune4'];
    $roomJune5 = $_POST['roomJune5'];
    $smoking = $_POST['smoking'];
    $dinnerJune3 = $_POST['dinnerJune3'];
    $dinnerJune4 = $_POST['dinnerJune4'];
    $cambridgeTour = $_POST['cambridgeTour'];
    $travel = $_POST['travel'];
    $labWebsite = $_POST['labWebsite'];
    $photoFile = $_POST['photoFile'];
    $researchDescription = $_POST['researchDescription'];


    //
    // Print out all of the properties
    //

    echo "name: " . $name . "<br/>";
    echo "email: " . $email . "<br/>";
    echo "organization: " . $organization . "<br/>";
    echo "workPhone: " . $workPhone . "<br/>";
    echo "cellPhone: " . $cellPhone . "<br/>";
    echo "address1: " . $address1 . "<br/>";
    echo "address2: " . $address2 . "<br/>";
    echo "city: " . $city . "<br/>";
    echo "state: " . $state . "<br/>";
    echo "workPhone: " . $workPhone . "<br/>";
    echo "zipcode: " . $zipcode . "<br/>";
    echo "country: " . $country . "<br/>";
    echo "emergencyContact: " . $emergencyContact . "<br/>";
    echo "vegetarian: " . $vegetarian . "<br/>";
    echo "dietaryComments: " . $dietaryComments . "<br/>";
    echo "roomJune3: " . $roomJune3 . "<br/>";
    echo "roomJune4: " . $roomJune4 . "<br/>";
    echo "roomJune5: " . $roomJune5 . "<br/>";
    echo "smoking: " . $smoking . "<br/>";
    echo "dinnerJune3: " . $dinnerJune3 . "<br/>";
    echo "dinnerJune4: " . $dinnerJune4 . "<br/>";
    echo "cambridgeTour: " . $cambridgeTour . "<br/>";
    echo "travel: " . $travel . "<br/>";
    echo "labWebsite: " . $labWebsite . "<br/>";
    echo "researchDescription: " . $researchDescription . "<br/>";

    //
    // TODO: Database code
    // Insert JSON properties into MySQL database
    // Read uploaded temp file from disk, move it or write it as blob to MySQL
    //
?>