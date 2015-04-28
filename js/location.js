var fileInput = document.getElementById("inputFile"),
	btn       = document.getElementById("btnLoad"),
	resultContainer = document.getElementById("graphic"),
	result,
	fileReader = new FileReader(),
	parser     = new DOMParser(),
	map;


abobrinha = window.setInterval(function(){
	if (fileInput.files.length > 0)
		btn.classList.remove('disabled')
	else 
		btn.classList.add('disabled')

}, 200)

btn.addEventListener('click', function(){
	if (!btn.classList.contains('disabled')){
		var file = fileInput.files[0]
		$('#fileContent').fadeTo('slow', 1, function(){})
		fileReader.readAsText(file)
		fileReader.addEventListener('load', parseFile)
	}
})


function parseFile(evt) {
	console.debug(evt)

	result = parser.parseFromString(evt.target.result, "application/xml")

	loadMap()
	decodeFile(result)
}

function loadMap(){
	var mapOptions = {
		center: new google.maps.LatLng(-27.0989178,-52.6363271),
		zoom:13,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("mapContainer"), mapOptions);

}

function decodeFile(file) {
	var bounds = new google.maps.LatLngBounds(),
		positions = file.getElementsByTagName("Position"),
		distances = file.getElementsByTagName("DistanceMeters"),
		heartRateBpm = file.getElementsByTagName("Value"),
		heartBeats = 0,
		distanceTotal = 0,
		contents = [],
		polyline,
		path = []
		infos = [];

	for (var i=0; i<positions.length; i++){
		auxLat = positions[i].getElementsByTagName("LatitudeDegrees")[0].innerHTML
		auxLng = positions[i].getElementsByTagName("LongitudeDegrees")[0].innerHTML
		path[i] = new google.maps.LatLng(auxLat,auxLng)
		bounds.extend(path[i])
	}

	for (var i=0; i<distances.length; i++){
		distanceTotal += parseInt(distances[i].innerHTML)
	}

	for (var i=0; i<heartRateBpm.length; i++){
		heartBeats += parseInt(heartRateBpm[i].innerHTML)
	}
	heartBeats = heartBeats/heartRateBpm.length

	console.log(heartRateBpm)
	console.log(heartBeats)

	polyline = new google.maps.Polyline({
		map: map,
		path: path,
		strokeColor: 'blue'
	})

	contents[0] = "Inicio da Rota!"
	contents[1] = "Fim da Rota!<br>Distancia total: "+distanceTotal+" metros.<br>Media de batimentos: "+heartBeats+"batimentos/min."

	for (var i=0; i<contents.length; i++){
		infos[i] = new google.maps.InfoWindow({
			content: contents[i],
			position: path[i*(positions.length-1)]
		})
		infos[i].open(map)
	}

	map.fitBounds(bounds)

}
