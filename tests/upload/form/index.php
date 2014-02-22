<?php

    // caption
    $caption = $_POST['caption'];
    echo "caption: " . $caption;
    echo "<br/>";

    // files
    files = $_POST['files'];
    echo "files: " . files;
    echo "<br/>";

/*
    // single file upload
    echo "Single File";
    echo "<br/>";
    if ($_FILES["file"]["error"] > 0)
    {
        echo "Error: " . $_FILES["file"]["error"] . "<br>";
    }
    else
    {
        echo "Upload: " . $_FILES["file"]["name"] . "<br>";
        echo "Type: " . $_FILES["file"]["type"] . "<br>";
        echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
        echo "Stored in: " . $_FILES["file"]["tmp_name"];
    }
    echo "<br/>";

    // multiple files
    echo "Multiple Files";
    echo "<br/>";
*/
/*
    if ($_FILES["files"]["error"] > 0)
    {
        echo "Error: " . $_FILES["files"]["error"] . "<br>";
    }
    else
    {
        echo "Upload: " . $_FILES["files"]["name"] . "<br>";
        echo "Type: " . $_FILES["files"]["type"] . "<br>";
        echo "Size: " . ($_FILES["files"]["size"] / 1024) . " kB<br>";
        echo "Stored in: " . $_FILES["files"]["tmp_name"];
    }
*/
/*
    foreach($_FILES as $idx=>$file)
    {
        echo "File Count: " . idx;

        echo "Upload: " . $file["name"] . "<br>";
        echo "Type: " . $file["type"] . "<br>";
        echo "Size: " . ($file["size"] / 1024) . " kB<br>";
        echo "Stored in: " . $file["tmp_name"];
    }
    echo "<br/>";
*/
?>