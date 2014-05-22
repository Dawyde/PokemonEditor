<?php
function prepareName($name){
	$retour = "";
	for($i=0;$i<strlen($name);$i++){
		if(strpos('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_', $name[$i]) === false) $retour .= "_";
		else $retour .= $name[$i];
	}
	return $retour;
}
require('class/Map.class.php');
require('class/NPC.class.php');
require('class/Reply.class.php');
require('class/Dialog.class.php');

if(!empty($_POST['action'])){
	$action = $_POST['action'];
	
	if($action == 'npc_tmp_list'){
		$npc = new NPCTemplates();
		echo json_encode($npc->getList());
	}
	elseif($action == 'npc_tmp_save'){
		$npc = new NPCTemplates();
		$id = intval($_POST['id']);
		echo json_encode($npc->updateTmp($_POST));
	}
	elseif($action == 'reply_list'){
		$r = new Reply();
		echo json_encode($r->getList());
	}
	elseif($action == 'reply_save'){
		$r = new Reply();
		$id = intval($_POST['id']);
		echo json_encode($r->updateReply($_POST));
	}
	elseif($action == 'dialog_list'){
		$r = new Dialog();
		echo json_encode($r->getList());
	}
	elseif($action == 'dialog_save'){
		$r = new Dialog();
		$id = intval($_POST['id']);
		echo json_encode($r->updateDialog($_POST));
	}

}
elseif(!empty($_POST['data'])){
	$data = json_decode($_POST['data'],true);
	$map = new Map($data['width'], $data['height'], $data['name'], $data['cells'], $data['npc']);
	Map::saveMap($map, 'maps/'.prepareName($data['name']).'.map');
	echo json_encode(array('success'=>true));
}
elseif(!empty($_POST['name'])){
	$map = Map::openMap('maps/'.prepareName($_POST['name']).'.map');
	if($map !== false) echo json_encode($map->getDatas());
	else echo json_encode(array('error'=>true));
}