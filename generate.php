<?php
class BDD{
	
	private $map_id = 1;
	private $map_ids = array();

	private $npc = array();
	private $reply = array();
	private $dialog = array();
	private $maps = array();
	
	public function addMap($sid, $w, $h, $name, $cells){
		$id = $this->map_id;
		$this->map_id++;
		$this->map_ids[$sid] = $id;
		
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
				$ges[$i][1] = $this->map_ids[$ge[1]];
			}
		}
		$this->reply[] = array(
			'id'=>$id,
			'text'=>$text,
			'ge'=>json_encode($ges)
		);
	}
	
	public function addNPC($id, $px, $py, $map, $nom, $cells, $mode, $charset, $dialog){
		$this->npc[] = array(
			'id'=>$id,
			'x'=>$px,
			'y'=>$py,
			'map'=>$map,
			'nom'=>$nom,
			'cells'=>$cells,
			'mode'=>$mode,
			'charset'=>$charset,
			'dialog'=>$dialog
		);
	}
	
	public function save(){
		return json_encode(array(
			'maps'=>$this->maps,
			'npcs'=>$this->npc,
			'dialog'=>$this->dialog,
			'reply'=>$this->reply,
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
	$map_id = $b->addMap($sid, $map['w'], $map['h'], $map['name'], $map['cells']);
	
	//NPC
	if(isset($map['npc'])){
		foreach($map['npc'] as $data){
			$npc = $npcs[$data['id']];
			$b->addNPC($n_id++, $data['x'], $data['y'], $map_id, $npc['name'], '', 1, $npc['character'], $npc['dialog']);
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