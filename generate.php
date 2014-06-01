<?php
class MapOptimizer{
	private $used = array();
	
	public function getTile($id){
		if($id == -1) return -1;
		if(!in_array($id, $this->used)) $this->used[] = $id;
		return array_search($id, $this->used);
	}
	
	public function save(){
		//On crée le nouveau tile
		$h = ceil(count($this->used)/8);
		$img = imagecreate(256, $h*32);
		$src = imagecreatefrompng('tileset/tile1.png');

		for($i=0;$i<count($this->used);$i++){
			$x = ($i%8)*32;
			$y = floor($i/8)*32;
			
			$sx = ($this->used[$i]%8)*32;
			$sy = floor($this->used[$i]/8)*32;
			
			imagecopy($img, $src, $x, $y, $sx, $sy, 32, 32);
		}

		imagepng($img, 'test.png');

		imagedestroy($img);
		imagedestroy($src);
	}
}


class BDD{
	
	private $map_id = 1;
	private $map_ids = array();

	private $npc = array();
	private $reply = array();
	private $dialog = array();
	private $maps = array();
	private $templates = array();
	
	private $tile;
	
	public function __construct(){
		$this->tile = new MapOptimizer();
		$this->templates = json_decode(file_get_contents('./files/templates.json'),true);
	}
	
	public function addMapId($sid){
		$this->map_ids[$sid] = $this->map_id;
		$this->map_id++;
	}
	public function addMap($sid, $w, $h, $name, $cells){
		$id = $this->map_ids[$sid];
		
		for($x=0;$x<$w;$x++){
			for($y=0;$y<$h;$y++){
				$c = $cells[$y][$x];
				if($c['l1'] != -1) $cells[$y][$x]['l1'] = $this->tile->getTile($c['l1']);
				if($c['l2'] != -1) $cells[$y][$x]['l2'] = $this->tile->getTile($c['l2']);
				if($c['l3'] != -1) $cells[$y][$x]['l3'] = $this->tile->getTile($c['l3']);
				if(isset($c['ic'])){
					foreach($c['ic']['ges'] as $i=>$ge){
						if(intval($ge[0]) == 5){//Teleport
							$cells[$y][$x]['ic']['ges'][$i][1][0] = $this->map_ids[$ge[1][0]];
						}
					}
				}
			}
		}
		
		$this->maps[]= array(
			'id'=>$id,
			'name'=>$name,
			'w'=>$w,
			'h'=>$h,
			'cells'=>json_encode($cells),
		);
		return $id;
	}
	
	public function addDialog($id, $text, $condition, $replies, $dialog){
		$this->dialog[] = array(
			'id'=>$id,
			'text'=>$text,
			'condition'=>json_encode($condition),
			'replies'=>$replies,
			'dialog'=>$dialog,
		);
	}
	public function addReply($id, $text, $ges){
	
		//Pour remplacer le nom de map par l'id
		foreach($ges as $i=>$ge){
			if(intval($ge[0]) == 5){//Teleport
				$ges[$i][1][0] = $this->map_ids[$ge[1][0]];
			}
		}
		$this->reply[] = array(
			'id'=>$id,
			'text'=>$text,
			'ge'=>json_encode($ges)
		);
	}
	
	public function addNPC($id, $px, $py, $map, $nom, $cells, $mode, $charset, $dialog, $pokemons){
		$this->npc[] = array(
			'id'=>$id,
			'x'=>$px,
			'y'=>$py,
			'map'=>$map,
			'nom'=>$nom,
			'cells'=>$cells,
			'mode'=>$mode,
			'charset'=>$charset,
			'dialog'=>$dialog,
			'pokemons'=>$pokemons
		);
	}
	
	public function save(){
		$this->tile->save();
		return json_encode(array(
			'maps'=>$this->maps,
			'npcs'=>$this->npc,
			'dialog'=>$this->dialog,
			'reply'=>$this->reply,
			'templates'=>$this->templates,
		));
	}
}

$npcs = json_decode(file_get_contents('./files/npc_tmp.json'),true);
$dialog = json_decode(file_get_contents('./files/dialog.json'),true);
$reply = json_decode(file_get_contents('./files/reply.json'),true);
$data = glob('./maps/*');
$n_id = 1;

$b = new BDD();
//Maps
foreach($data as $mapf){
	$map = json_decode(file_get_contents($mapf),true);
	$sid = substr($mapf, 7, -4);
	$b->addMapId($sid);
}
foreach($data as $mapf){
	$map = json_decode(file_get_contents($mapf),true);
	$sid = substr($mapf, 7, -4);
	$map_id = $b->addMap($sid, $map['w'], $map['h'], $map['name'], $map['cells']);
	
	//NPC
	if(isset($map['npc'])){
		foreach($map['npc'] as $data){
			$npc = $npcs[$data['id']];
			$b->addNPC($n_id++, $data['x'], $data['y'], $map_id, $npc['name'], '', 1, $npc['character'], $npc['dialog'], isset($npc['pokemons'])?$npc['pokemons']:'');
		}
	}
}
//Questions
foreach($dialog as $d){
	$b->addDialog($d['id'], $d['text'], $d['condition_array'], $d['replies'], $d['dialog']);
}
//Reponses
foreach($reply as $d){
	$b->addReply($d['id'], $d['text'], $d['ge']);
}
$f = fopen('retour.json','w+');
fwrite($f, $b->save());
fclose($f);