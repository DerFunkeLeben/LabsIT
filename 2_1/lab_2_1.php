<html>

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>lab 2-1</title>
</head>

<body>

    <?php

    if (empty($_REQUEST['S'])) die('Не задана подстрока поиска населенного пункта');
    if (empty($_REQUEST['N']) || !(($_REQUEST['N'] + 0) >= 0)) die('Не задано минимальное количество жителей');

    $S = $_REQUEST['S'];
    if (!$S) die('Не задана подстрока поиска населенного пункта');
    $N = $_REQUEST['N'] + 0;

    $data = array();
    $f = fopen('data_lab_2_1.csv', 'r');

    while (!feof($f)) {
        $csv_data = fgetcsv($f, 1000, ';');
        $data[$csv_data[0]] = array("settlement" => $csv_data[1], "population" => $csv_data[2]);
    }
    fclose($f);

    // полифил
    if (!function_exists('str_starts_with')) {
        function str_starts_with($haystack, $needle)
        {
            return (string)$needle !== '' && strncmp($haystack, $needle, strlen($needle)) === 0;
        }
    }

    function filter($el)
    {
        global $N, $S;
        $populationF = ($el["population"] > $N);
        $settlementF = str_starts_with($el["settlement"], $S);
        return $populationF && $settlementF;
    }

    function sortPopulation($a, $b)
    {
        return $b['population'] - $a['population'];
    }


    $filteredData = array_filter($data, "filter");
    
    if (!count($filteredData)) {
        echo '<p>Нет подходящих записей</p>';
        exit;
    }

    usort($filteredData, 'sortPopulation');

    echo '<ol>';
    foreach ($filteredData as $id => $el) {
        echo '<li>' . $el["settlement"] . ': ' . $el["population"] . '</li>';
    }
    echo '</ol>';
    ?>
</body>

</html>