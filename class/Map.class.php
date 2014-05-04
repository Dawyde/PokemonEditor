<?php
class Map{
	private $width;
	private $height;
	private $name;
	
	private $cells;
	
	public function __construct($w, $h, $name, $cells){
		$this->cells = $cells;
		$this->width = $w;
		$this->height = $h;
		$this->name = $name;
	}
	
	
	public function getDatas(){
		return array(
			'w'=>$this->width,
			'h'=>$this->height,
			'name'=>$this->name,
			'cells'=>$this->cells
		);
	}
	
	public static function saveMap($map, $filename){
		$f = fopen($filename, 'w+');
		fwrite($f, json_encode($map->getDatas()));
		fclose($f);
	}
	public static function openMap($filename){
		if(!file_exists($filename)) return false;
		$data = json_decode(file_get_contents($filename), true);
		
		return new Map(intval($data['w']), intval($data['h']), $data['name'], $data['cells']);
	}

}