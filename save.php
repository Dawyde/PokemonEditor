<?php

if(empty($_POST['map'])) die;


/*
function addTile(&$used, $value){
	if($value == -1 || $value == null || in_array($value, $used)) return;
	$used[] = $value;
}
function writeCell($f, $cell, $used_tiles, $layer){
	$value = 0;
	if(isset($cell[$layer]) && $cell[$layer] != -1) $value = array_search($used_tiles,$cell[$layer])+1;
	fwrite($f, pack('c', $value));
}

$map = $_POST['map'];
$used_tiles = array();
for($y=0;$y<count($map);$y++){
	for($x=0;$x<count($map[$y]);$x++){
		$cell = $map[$y][$x];
		if(is_array($cell)){
		addTile($used_tiles, $cell['l1']);
		addTile($used_tiles, $cell['l2']);
		addTile($used_tiles, $cell['l3']);
		}
	}
}
sort($used_tiles);

//On enregistre la map
$f = fopen("map.txt","w+");
for($y=0;$y<count($map);$y++){
	for($x=0;$x<count($map[$y]);$x++){
		$cell = $map[$y][$x];
		writeCell($f, $cell, $used_tiles, 'l1');
		writeCell($f, $cell, $used_tiles, 'l2');
		writeCell($f, $cell, $used_tiles, 'l3');
	}
}
fwrite($f, pack('ccc', 3, 4, 4));
fclose($f);

//On crée le nouveau tile
$h = ceil(count($used_tiles)/8);
$img = imagecreate(256, $h*32);
$src = imagecreatefrompng('tileset/tile1.png');

for($i=0;$i<count($used_tiles);$i++){
	$x = ($i%8)*32;
	$y = floor($i/8)*32;
	
	$sx = ($used_tiles[$i]%8)*32;
	$sy = floor($used_tiles[$i]/8)*32;
	
	imagecopy($img, $src, $x, $y, $sx, $sy, 32, 32);
}

imagepng($img, 'test.png');

imagedestroy($img);
imagedestroy($src);


$f = fopen("fi.txt","w+");
fwrite($f, json_encode($used_tiles));
fclose($f);*/