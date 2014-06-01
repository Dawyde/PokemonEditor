<html>
<head>
	<title>L'éditeur de map !</title>
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link href="style.css" rel="stylesheet" media="screen">
	<script type="text/javascript" src="editor/jquery-1.11.0.min.js"></script>
	<script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="editor/Tileset.js"></script>
	<script type="text/javascript" src="editor/Map.js"></script>
	<script type="text/javascript" src="editor/EditorManager.js"></script>
	<script type="text/javascript" src="editor/EventDispatcher.js"></script>
	<script type="text/javascript" src="editor/UI.js"></script>
	<script type="text/javascript" src="editor/History.js"></script>
	<script type="text/javascript" src="editor/Charset.js"></script>
	<script type="text/javascript" src="editor/ConditionManager.js"></script>
	<script type="text/javascript" src="editor/NPCTemplates.js"></script>
	<script type="text/javascript" src="editor/Reply.js"></script>
	<script type="text/javascript" src="editor/Dialog.js"></script>
	<script type="text/javascript" src="editor/InteractiveCell.js"></script>
	<script type="text/javascript" src="editor/main.js"></script>
	<style>

	</style>
</head>
<body>
<ul class="nav nav-tabs" id="editorTab">
  <li class="active"><a href="#mapeditor" data-toggle="tab">Map</a></li>
  <li><a href="#npc" data-toggle="tab">NPC</a></li>
  <li><a href="#dialog" data-toggle="tab">Dialog</a></li>
  <li><a href="#reply" data-toggle="tab">Réponses</a></li>
</ul>


<div class="tab-content">
	<div class="tab-pane active" id="mapeditor">
		<div id="box_toolbar" class="btn-toolbar">
		  <div class="btn-group">
			<span class="btn btn-medium" title="Nouveau" onClick="new_map();">New</span>
			<span class="btn btn-medium" title="Nouveau" onClick="editor.cancel();">Cancel</span>
			<span class="btn btn-medium" title="Nouveau" onClick="editor.restore();">Restore</span>
		  </div>
		  <!-- Calques -->
		  <div class="btn-group" id="active_calque">
			<button class="btn active" id="c1" title="Calque 1" onClick="setCalque(1);">C1</button>
			<button class="btn" id="c2" title="Calque 2" onClick="setCalque(2);">C2</button>
			<button class="btn" id="c3" title="Calque 3" onClick="setCalque(3);">C3</button>
			<button class="btn" id="c4" title="Calque Type" onClick="setCalque(4);">T</button>
		  </div>
		  <!-- Calques -->
		  <div class="btn-group" id="active_calque">
			<select class="btn" id="cell_type">
				<option value="0">Normale</option>
				<option value="1" style="color:red;" >Non marchable</option>
				<option value="2" style="color:blue;">Eau</option>
				<option value="3" style="color:green;">Herbe</option>
			</select>
		  </div>
		  <!-- Outils -->
		  <div class="btn-group" id="tools">
			<button class="btn active" id="tool_1" title="Outil Crayon" onClick="setTool(1);"><i class="icon icon-pencil"></i></button>
			<button class="btn" id="tool_2" title="Outil Pipette" onClick="setTool(2);"><i class="icon icon-pipette"> </i></button>
			<button class="btn" id="tool_3" title="Outil Peinture" onClick="setTool(3);"><i class="icon icon-peinture"> </i></button>
		  </div>
		  
		  <!-- Options -->
			<div class="btn-group">
				<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
				Options
				<span class="caret"></span>
				</a>
				<ul class="dropdown-menu">
					<li><a onClick="npc_manager.openDialog();" id="op_layer_opacity">Liste de NPC</a></li>
					<li><a onClick="reply_manager.openDialog();" id="op_layer_opacity">Liste de Reply</a></li>
				</ul>
			</div>
			
			<div class="btn-group">
				<input type="text" id="map_name" class="input-large" placeholder="Nom de la map"/>
			</div>
		</div>
		<div id="box_toolbar" class="btn-toolbar">
		  <!-- Affichage des Calques -->
		  <div class="btn-group" id="hidden_layout">
			<button class="btn btn-info active" id="layout_h1" title="Afficher/Masquer Calque 1" onClick="toogleHiddenLayout(1);">C1</button>
			<button class="btn btn-info active" id="layout_h2" title="Afficher/Masquer Calque 2" onClick="toogleHiddenLayout(2);">C2</button>
			<button class="btn btn-info active" id="layout_h3" title="Afficher/Masquer Calque 3" onClick="toogleHiddenLayout(3);">C3</button>
			<button class="btn btn-info active" id="layout_h4" title="Afficher/Masquer Calque Type" onClick="toogleHiddenLayout(4);">T</button>
		  </div>
		</div>
		<div id="box_map">
			<canvas width="800" height="600" id="map"></canvas>
		</div>
		<div id="box_tile">
			<canvas width="275" height="600" id="tiles"></canvas>
		</div>
		<div id="map_npc">
			<div class="row">
				<div class="span3">
					<span class="titlespan">PNJ de la Map</span>
					<select id="map_npc_list" multiple="true" class='npclist'>
					
					</select>
					<button class="btn btn-info" style="width:100%;" id="map_add_npc">Ajouter PNJ</button>
					<button class="btn btn-danger" style="width:100%;" id="map_remove_npc">Supprimer</button>
				</div>
				<div class="offset1 span10">
					<span class="titlespan">Interactive Cells</span>
					<div id="ics"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="tab-pane" id="npc">
		<div id="npc_left">
			Liste des PNJ :
			<select multiple="true" id="npc_list">
			
			</select>
			<button class="btn" id="npc_new">Nouveau PNJ</button>
		</div>
		<div id="npc_central">
			<canvas id="npc_charset" width="100" height="150"></canvas>
			<label for="npc_id">Id : </label><input type="number" id="npc_id" class="input-medium"><br/>
			<label for="npc_name">Nom du PNJ : </label><input type="text" id="npc_name" class="input-xlarge"><br/>
			<label for="npc_pokemons">PokemonBag : </label><input type="text" id="npc_pokemonbag" class="input-xlarge"><br/>
			<label for="npc_dialog">Dialog : </label>
			<div class="input-append" style="margin:0px;padding:0px;">
				<span class="input-medium uneditable-input" id="npc_dialog_view">Aucun</span>
				<button class="btn" id="npc_dialog" type="button">Parcourir</button>
			</div>
			<br/>
			<br/>
			<br/>
			<p>
				<button class="btn btn-success" id="npc_save">Enregistrer</button>
			</p>
		</div>
	</div>
	<div class="tab-pane" id="dialog">
		<div id="dialog_left">
			Liste des Dialog :
			<select multiple="true" id="dialog_list">
			
			</select>
			<button class="btn" id="dialog_new">Nouveau Dialog</button>
		</div>
		<div id="dialog_central">
			<label for="dialog_id">Id : </label><input type="number" id="dialog_id" class="input-medium"><br/>
			
			<label for="dialog_text">Texte : </label><textarea id="dialog_text" class="input-xxlarge"></textarea><br/>
			
			<div class="control-group" id="dialog_condition_control">
				<label for="dialog_condition">Condition : </label>
				<input type="text" id="dialog_condition" class="input-xlarge error"><span class="help-inline" id="dialog_condition_help"></span><br/>
			</div>
			
			<label for="dialog_dialog">Dialog : </label>
			<div class="input-append" style="margin:0px;padding:0px;">
				<span class="input-medium uneditable-input" id="dialog_dialog_view">Aucun</span>
				<button class="btn" id="dialog_dialog" type="button">Parcourir</button>
			</div><br/>
			<input type="button" class="btn btn-success" id="dialog_save" value="Enregistrer"/>
			<hr/>
			<b>Réponses :</b>
			<div id="dialog_replies">
			
			</div>
			<div>
				<input type="button" id="dialog_add_reply" class="btn" value="Ajouter une réponse"/>
			</div>
		</div>
	</div>
	<div class="tab-pane" id="reply">
		<div id="reply_left">
			Liste des Reply :
			<select multiple="true" id="reply_list">
			
			</select>
			<button class="btn" id="reply_new">Nouvelle réponse</button>
		</div>
		<div id="reply_central">
			<label for="reply_id">Id : </label><input type="number" id="reply_id" class="input-medium"><br/>
			
			<label for="reply_text">Texte : </label><input type="text" id="reply_text" class="input-xlarge"><br/>
			<input type="button" class="btn btn-success" id="reply_save" value="Enregistrer"/>
			<hr/>
			<b>Effets :</b>
			<div id="reply_effects">
			
			</div>
			<div>
				<select id="reply_effect_types">
				</select>
				<input type="button" id="reply_effect_add" class="btn" value="Ajouter"/>
			</div>
		</div>
	</div>
</div>
	
	<div id="CharsetModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="CharsetModalLabel" aria-hidden="true">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			<h3 id="CharsetModalLabel">Liste de Charset</h3>
		</div>
		<div class="modal-body">
			<p>
				<canvas id="CharsetCanvas" width="800" height="600"></canvas>
			</p>
		</div>
		<div class="modal-footer">
			<p class="pull-left">Cliquez sur le charset que vous voulez</p>
			<button class="btn" data-dismiss="modal" aria-hidden="true">Annuler</button>
		</div>
	</div>
	<div id="NPCModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="NPCModalLabel" aria-hidden="true">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			<h3 id="NPCModalLabel">Liste de NPC</h3>
		</div>
		<div class="modal-body">
			Choisissez le NPC à ajouter :
			<select id="npc_c_list"></select>
		</div>
		<div class="modal-footer">
			<button class="btn" data-dismiss="modal" aria-hidden="true">Annuler</button>
			<button class="btn btn-info" id="npc_c_valider">Ajouter</button>
		</div>
	</div>
	<div id="DialogModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="DialogModalLabel" aria-hidden="true">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			<h3 id="DialogModalLabel">Liste des Dialogs</h3>
		</div>
		<div class="modal-body">
			Choisissez une question :
			<select id="dialog_c_list"></select>
		</div>
		<div class="modal-footer">
			<button class="btn" data-dismiss="modal" aria-hidden="true">Annuler</button>
			<button class="btn btn-info" id="dialog_c_valider">Valider</button>
		</div>
	</div>
	<div id="ReplyModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="ReplyModalLabel" aria-hidden="true">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			<h3 id="ReplyModalLabel">Liste de Réponses</h3>
		</div>
		<div class="modal-body">
			Choisissez une réponse :
			<select id="reply_c_list"></select>
		</div>
		<div class="modal-footer">
			<button class="btn" data-dismiss="modal" aria-hidden="true">Annuler</button>
			<button class="btn btn-info" id="reply_c_valider">Valider</button>
		</div>
	</div>
	<div id="NewMapModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="NewMapModalLabel" aria-hidden="true">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			<h3 id="NewMapModalLabel">Nouvelle Carte</h3>
		</div>
		<div class="modal-body">
			Largeur : <input type='number' value='50' id='new_map_w'/><br/>
			Longueur : <input type='number' value='50' id='new_map_h'/><br/>
		</div>
		<div class="modal-footer">
			<button class="btn" data-dismiss="modal" aria-hidden="true">Annuler</button>
			<button class="btn btn-info" onClick='newMapConfirm();'>Valider</button>
		</div>
	</div>
</body>
</html>