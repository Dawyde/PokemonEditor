<html>
<head>
	<title>L'éditeur de map !</title>
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
	<script type="text/javascript" src="editor/jquery-1.11.0.min.js"></script>
	<script type="text/javascript" src="bootstrap/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="editor/Tileset.js"></script>
	<script type="text/javascript" src="editor/Map.js"></script>
	<script type="text/javascript" src="editor/EditorManager.js"></script>
	<script type="text/javascript" src="editor/EventDispatcher.js"></script>
	<script type="text/javascript" src="editor/UI.js"></script>
	<script type="text/javascript" src="editor/main.js"></script>
	<style>
		body{
			width:1150px;
			margin:auto;
		}
		#box_toolbar{
			width:1100px;
			height:30px;
		}
		#box_map{
			width:802px;
			height:600px;
			border:1px solid black;
			float:left;
			overflow:auto;
		}
		#box_tile{
			width:300px;
			border:1px solid black;
			margin-left:804px;
			height:600px;
			overflow:auto;
		}
	</style>
</head>
<body>
	<div id="box_toolbar" class="btn-toolbar">
	  <div class="btn-group">
		<span class="btn btn-medium" title="Nouveau" onClick="new_map();"><i class="icon-pencil"></i></span>
	  </div>
	  <!-- Calques -->
	  <div class="btn-group" id="active_calque">
		<button class="btn" id="c1" title="Calque 1" onClick="setCalque(1);">C1</button>
		<button class="btn" id="c2" title="Calque 2" onClick="setCalque(2);">C2</button>
		<button class="btn" id="c3" title="Calque 3" onClick="setCalque(3);">C3</button>
	  </div>
	  
	  <!-- Options -->
		<div class="btn-group">
			<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
			Options
			<span class="caret"></span>
			</a>
			<ul class="dropdown-menu">
				<li><a onClick="toogleOption('layer_opacity')" id="op_layer_opacity">Calques transparents</a></li>
			</ul>
		</div>
	</div>
	<div id="box_toolbar" class="btn-toolbar">
	  <!-- Affichage des Calques -->
	  <div class="btn-group" id="hidden_layout">
		<button class="btn btn-info active" id="layout_h1" title="Afficher/Masquer Calque 1" onClick="toogleHiddenLayout(1);">C1</button>
		<button class="btn btn-info active" id="layout_h2" title="Afficher/Masquer Calque 2" onClick="toogleHiddenLayout(2);">C2</button>
		<button class="btn btn-info active" id="layout_h3" title="Afficher/Masquer Calque 3" onClick="toogleHiddenLayout(3);">C3</button>
	  </div>
	</div>
	<div id="box_map">
		<canvas width="800" height="600" id="map"></canvas>
	</div>
	<div id="box_tile">
		<canvas width="275" height="600" id="tiles"></canvas>
	</div>
</body>
</html>