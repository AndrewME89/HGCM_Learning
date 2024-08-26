$search = $_POST['findMe'];
//$search = "example";

if (stripos($home, $search) !== false) {
    echo '<a href="general.html">'.$homePageName.'</a>';
}