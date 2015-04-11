<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: X-Requested-With');

require 'simple_html_dom.php';

$url = "http://chineseradioseattle.com/" . $_GET['topic'] . "/";

class Media
{
    public $id;
    public $title;
    public $detail;
    public $url;
    public $time_stamp;
    public $imageUrl;
};

$medias = array();

$counter = 0;
if('' == $_GET['topic']) {
    $m1 = new Media();
    $m1->id = $counter;
    $m1->title = "实时播放（中文: 美西时间每晚9-12点, 周五晚8-12点)";
    $m1->url= "http://edgev1.den.echo.liquidcompass.net/KKNWAMMP3";
    array_push($medias, $m1);
    $counter ++;
}

$html = file_get_html($url);
foreach ($html->find('a') as $links) {
    if (endsWith($links->href, ".mp3")) {
        if (endsWith($links->innertext, ".mp3")) {
            $links->innertext = parse_url($links->innertext, PHP_URL_PATH);
            
            preg_match('/(\d{4})\/\d{2}\/crs_(\d\d)(\d\d)(_full\d{0,2}.mp3)/i', $links->innertext, $matches);

            if (5 == sizeof($matches)) {
                $links->innertext = $matches[1] . '年'  .  $matches[2]  . '月' . $matches[3] . '日完整版';
            }
        }
        if (strlen(trim($links->innertext)) > 1) {
            $detail = $links->parent()->innertext;
            $b = strrpos($detail, "</a>");
            if ($b > 0) {
                $detail = substr($detail, $b + 4);
            }
            else{
                $detail = null;
            }
            
            //find the image associated with for the audio file
            //search within the parent div
            $imgUrl = "";
            if('' == $_GET['topic']) {
                $div = $links->parent();
                while($div->tag != "div") {
                    $div = $div->parent();
                }
                $imgNode = $div->find("img", 0);
                if ($imgNode != null)
                    $imgUrl = $imgNode->src;
            }

            if (endsWith($links->innertext, ".mp3")) {
                $div = $links->parent();
                while($div->tag != "article" || !$div->find("h1", 0)) {
                    $div = $div->parent();
                }
                $titleNode = $div->find("h1", 0);
                $anode = $titleNode->find("a", 0);
                if ($anode) {
                    $links->innertext = $anode->innertext;
                }
                else {
                    $links->innertext = $titleNode->innertext;
                }
            }
                
            $m1 = new Media();
            $m1->id = $counter;
            $m1->title = $links->innertext;
            $m1->detail = $detail;
            $m1->url= $links->href;
            $m1->imageUrl = strtok($imgUrl, '?');
            array_push($medias, $m1);
            $counter ++;
        }
    }
}

if(strcmp('american_stories', $_GET['topic']) == 0) {
    $extra_stories = '[{"id":0,"title":"\u8bbf\u8c08\u9a7b\u897f\u96c5\u56fe\u53f0\u5317\u7ecf\u6d4e\u6587\u5316\u5904\u5904\u957f\u91d1\u661f\u5148\u751f","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/american_stories_1226_teco_seattle_director_chin.mp3","time_stamp":null,"action":null},{"id":1,"title":"\u5fae\u8f6f\u7814\u7a76\u9662\u9996\u5e2d\u7814\u7a76\u5458\u3001IEEE\u9662\u58eb\u5f20\u6b63\u53cb\u535a\u58eb\u8c08\u4ed6\u7684\u5b66\u4e60\u79d1\u7814\u7ecf\u5386","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/american_stories_1219_dr_zhengyou_zhang_interview.mp3","time_stamp":null,"action":null},{"id":2,"title":"\u4e13\u8bbf\u534e\u97f3\u827a\u672f\u56e2\u56e2\u957f\u5434\u6653\u660e\u4ee5\u53ca\u884c\u653f\u56e2\u957f\u7a0b\u5a55","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/american_stories_1128_huayin_interview.mp3","time_stamp":null,"action":null},{"id":3,"title":"ALike\u516c\u53f8Founder&amp; CEO Maria Zhang\u8bb2\u8ff0\u5979\u7684\u6545\u4e8b","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/american_stories_1003_maria_zhang_interview.mp3","time_stamp":null,"action":null},{"id":4,"title":"\u4e13\u8bbf\u7259\u79d1\u533b\u751f\u6bdb\u5c14\u52a0\u533b\u751f","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/08\/american_stories_0808_mao_interview.mp3","time_stamp":null,"action":null},{"id":5,"title":"\u66f9\u9704\u9e64\u5f8b\u5e08\u8c08\u6295\u8d44\u79fb\u6c11\u7684\u8bdd\u9898","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/food_life_1221_cao_xiaohe_law_talk.mp3","time_stamp":null,"action":null},{"id":6,"title":"\u810a\u9aa8\u795e\u7ecf\u79d1\u4e13\u5bb6\u5f90\u533b\u751f\u8c08\u9aa8\u79d1\u810a\u9aa8\u795e\u7ecf\u7684\u4fdd\u5065\u4e0e\u6cbb\u7597","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/food_life_1207_jigu_dr_hsu.mp3","time_stamp":null,"action":null},{"id":7,"title":"\u66f9\u9704\u9e64\u5f8b\u5e08\u8c08\u5b66\u751f\u62a4\u7167\u3001\u7b7e\u8bc1\u4ee5\u53ca\u600e\u4e48\u7ef4\u62a4\u81ea\u5df1\u7684\u6743\u76ca\u7b49\u8bdd\u9898","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/food_life_1116_cao_xiaohe_law_talk.mp3","time_stamp":null,"action":null},{"id":8,"title":"\u534e\u7f8e\u94f6\u884cBellevue\u5206\u884c\u7ecf\u7406Martin Liang\u8c08\u5f00\u529e\u5168\u7403\u94f6\u884c\u5361\u3001\u7f8e\u5143\u5e10\u53f7\u3001\u5168\u7403\u8f6c\u8d26\u62c5\u4fdd\u7b49\u94f6\u884c\u4e1a\u52a1","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/food_life_1108_eastwestbank_martin_liang_talk.mp3","time_stamp":null,"action":null},{"id":9,"title":"\u810a\u9aa8\u795e\u7ecf\u79d1\u4e13\u5bb6\u5f90\u533b\u751f\u8c08\u9aa8\u79d1\u810a\u9aa8\u795e\u7ecf\u7684\u4fdd\u5065\u4e0e\u6cbb\u7597","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/food_life_1102_jigu_dr_hsu.mp3","time_stamp":null,"action":null},{"id":10,"title":"\u8d44\u6df1\u623f\u5730\u4ea7\u4e13\u5bb6\u9648\u7ef4\u5b89\u8c08\u5927\u897f\u96c5\u56fe\u5730\u533a\u623f\u5730\u4ea7\u6295\u8d44\u7684\u65f6\u673a\u4e0e\u70ed\u70b9","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/food_life_1026_victor_chen_real_estate_talk.mp3","time_stamp":null,"action":null},{"id":11,"title":"\u66f9\u5f8b\u5e08\u79fb\u6c11\u4e13\u9898\uff1a\u6761\u4ef6\u7eff\u5361\u7684\u89e3\u9664\u95ee\u9898","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/food_life_1019_cao_xiaohe_law_talk.mp3","time_stamp":null,"action":null},{"id":12,"title":"\u810a\u9aa8\u795e\u7ecf\u79d1\u4e13\u5bb6\u5f90\u533b\u751f\u6765\u8c08\u9aa8\u79d1\u810a\u9aa8\u795e\u7ecf\u7684\u4fdd\u5065\u4e0e\u6cbb\u7597","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/food_life_1005_jigu_dr_hsu.mp3","time_stamp":null,"action":null},{"id":13,"title":"\u66f9\u5f8b\u5e08\u8c08\u5a5a\u59fb\u5728\u79fb\u6c11\u6cd5\u5f8b\u4e2d\u7684\u754c\u5b9a","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/food_life_0920_cao_xiaohe_law_talk.mp3","time_stamp":null,"action":null},{"id":14,"title":"\u810a\u9aa8\u795e\u7ecf\u79d1\u4e13\u5bb6\u5f90\u533b\u751f\u6765\u8c08\u9aa8\u79d1\u810a\u690e\u795e\u7ecf\u7684\u4fdd\u5065\u4e0e\u6cbb\u7597","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/food_life_0907_jigu_dr_hsu.mp3","time_stamp":null,"action":null},{"id":15,"title":"\u66f9\u5f8b\u5e08\u79fb\u6c11\u4e13\u9898\uff1a\u6295\u8d44\u79fb\u6c11\u7684\u8bdd\u9898","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/05\/food_life_0824_caoxiaohe.mp3","time_stamp":null,"action":null},{"id":16,"title":"\u6bdb\u6e1d\u533b\u751f\u8c08\u53e3\u8154\u4fdd\u5065","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/08\/food_life_0818_maoyu.mp3","time_stamp":null,"action":null},{"id":17,"title":"\u66f9\u5f8b\u5e08\u8c08\u5965\u5df4\u9a6c\u7684\u79fb\u6c11\u653f\u7b56\u5bf9\u534e\u4eba\u7684\u5f71\u54cd","url":"http:\/\/chineseradioseattle.files.wordpress.com\/2012\/08\/food_life_0712_cao_xiaohe.mp3","time_stamp":null,"action":null}]';
    $extra_items = json_decode($extra_stories);
    foreach ($extra_items as $links) {
        $m1 = new Media();
        $m1->id = $counter;
        $m1->title = $links->title;
        $m1->url= $links->url;
        array_push($medias, $m1);
        $counter ++;
    }
}

echo json_encode($medias);

function startsWith($haystack, $needle) {
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }
    return (substr($haystack, -$length) === $needle);
}  
?>
