<?php
class Reply{
	
	private $datas;
	
	public function __construct(){
		if(file_exists('files/reply.json')) $this->datas = json_decode(file_get_contents('files/reply.json'),true);
		else $this->datas = array();
	}
	
	public function getList(){
		$retour = array();
		foreach($this->datas as $tmp){
			$retour[$tmp['id']] = $tmp;
		}
		return $retour;
	}
	public function getReply($id){
		if(!array_key_exists($id, $this->datas)){
			return false;
		}
		return $this->datas[$id];
	}
	public function updateReply($datas){
		$id = intval($datas['id']);
		if($id == -1){
			if(count($this->datas) == 0) $id = 1;
			else{
				$ids = array_keys($this->datas);
				sort($ids);
				$id = end($ids)+1;
			}
		}
		if($id < 1) return;
		
		$this->datas[$id] = array(
			'id' => $id,
			'text' => trim($datas['text']),
			'ge' => $datas['ge'],
		);
		
		$this->save();
		return $this->datas[$id];
	}
	
	public function save(){
		$f = fopen('files/reply.json', 'w+');
		fwrite($f, json_encode($this->datas));
		fclose($f);
	}
}