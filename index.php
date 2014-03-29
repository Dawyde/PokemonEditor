<html>
<head>
	<title>L'éditeur de map !</title>
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
	<script type="text/javascript" src="editor/Tileset.js"></script>
	<script type="text/javascript" src="editor/Map.js"></script>
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
			border:1px solid black;
			float:left;
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
		<button class="btn" title="Nouveau" onClick="new_map();"><i class="icon-pencil"></i></button>
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