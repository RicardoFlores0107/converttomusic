/* OPEN LAYERS VERSION 7.5.1 */ 

/* MOSTRAR VENTANAS */ 
  const vectorSource = new ol.source.Vector({});
  const vectorLayer = new ol.layer.Vector({source: vectorSource,});

  const urlActual = window.location.href;
  //console.log(urlActual);

  const busquedaNormal = 'Search';
  const busquedaNormal_filent = 'filent';

  const buscarCortev = 'Corte';
  const punto = 'longitud';

  const dwn = 'Descarga';
  const desc = 'DescargaInfo';
  

 // console.log(urlActual);
  var div = document.getElementById('busquedadiv');
  
  if (urlActual.includes(busquedaNormal)){
  if (div) {
      div.style.display = 'block';
    } else {
        //console.error("El div con id 'busquedadiv' no se encontró en el documento.");
    }
  }

  if(urlActual.includes('descargas')){
    document.getElementById("download_div").style.display = 'block';
  }
    
  if (dwn !== undefined && urlActual.includes(dwn) || desc !== undefined && urlActual.includes(desc)) {
    const down = document.getElementById('download_div');
    down.style.display = 'block';
  }
                
    // Contenido de botones
    /*  function mostrarContenido(buttonValue) {
        if (buttonValue === 'buscar') {
        alert("buscar");
          document.getElementById('busquedadiv').style.display = 'block !important';
          document.getElementById('busquedaCorte').style.display = 'none !important';
          console.log('buscar');
        } else if (buttonValue === 'buscarCorte') {
          document.getElementById('busquedadiv').style.display = 'none';
          document.getElementById('busquedaCorte').style.display = 'block';
          console.log('corte');
        }
      }
    */ 
    function versiones_show(){
      document.getElementById('versiones').style.display = 'block';
    }

    function consultar_show(){
      document.getElementById('consultar').style.display = 'block';
    }

    if(urlActual.includes("report")){
      document.getElementById('consultar').style.display = 'block';
    }
  
/* PROXY */
  //var proxy = '/cgi-bin/proxy.cgi?url=';
  
  	//var proxy = historico.ProxyServlet(url);

/* MAPA */ 
  var bounds = ol.proj.transformExtent(
    [-13459673.0276619, 1232095.46159631, -9281930.46183394, 4109451.87806631],
      'EPSG:900913',
      'EPSG:3857'
  );

  var restric = "-13459673.0276619,1232095.46159631,-9281930.46183394,4109451.87806631";
  var res1 = restric.split(",");
  var bounds = ol.extent.applyTransform(
    [parseFloat(res1[0]), parseFloat(res1[1]), parseFloat(res1[2]), parseFloat(res1[3])],
      ol.proj.getTransform('EPSG:900913', 'EPSG:3857')
  );  

  const resolutions = [];
  for (let z = 0; z <= 22; ++z) {
    resolutions[z] = 156543.03392804097 / Math.pow(2, z);
  }
  
  var view = new ol.View({
    projection: 'EPSG:3857',
    center: ol.proj.fromLonLat([-102.552784, 23.634501]),
    zoom: 5,
   /* minZoom: 5,
    maxZoom: 22,*/
	resolutions: resolutions,
    extent: bounds
  });
  
  var map = new ol.Map({
    target: 'map',
    controls: [
      new ol.control.Zoom(),
      new ol.control.Rotate(),
      new ol.control.Attribution(),
      new ol.control.ZoomSlider(),
      new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(5),
        projection: 'EPSG:4326',
        className: 'coordinates',
        target: document.getElementById('coordinates'),
      }),
    ],
    view: view,
    
  });
  

  const scaleLineMetric = new ol.control.ScaleLine({
    units: 'metric',
    //className: 'scale-line-1',
    target: document.getElementById("scaleline-metric"),
    //projection: 'EPSG:3857'
  });

  const scaleLineImperial = new ol.control.ScaleLine({
    units: 'imperial',
    //className: 'scale-line-2',
    target: document.getElementById("scaleline-imperial"),
    //projection: 'EPSG:3857'
  });

  map.addControl(scaleLineMetric);
  map.addControl(scaleLineImperial);

  map.once('postrender', function() {
    //var scaleLineMetricElement = scaleLineMetric.getElement();
    var scaleLineMetricElement = scaleLineMetric.element;
    scaleLineMetricElement.style.bottom = '30px';
    scaleLineMetricElement.style.left = '10px';
  });

/* CODIGO DE CUANDO SE INICIA LA PLATAFORMA, ZOOM CON SHIFT Y MOUSE, CAMBIAR PUNTERO CUANDO SE MUEVE EL MAPA  */
  // Crear el contenedor del mapa
  const mapContainer = document.getElementById('map');
  // Variable para almacenar el estado de la tecla Shift
  let isShiftKeyDown = false;

  // Event listener para detectar cuando se presiona la tecla Shift
  map.on('keydown', function(event) {
    if (event.originalEvent.shiftKey) {
      isShiftKeyDown = true;
    }
  });

  // Event listener para detectar cuando se suelta la tecla Shift
  map.on('keyup', function(event) {
    if (!event.shiftKey) {
      isShiftKeyDown = false;
      mapContainer.style.cursor = 'default'; // Restablece el cursor predeterminado
    }
  });

  // Event listener para el clic en el mapa
  map.on('click', function(event) {
    if (isShiftKeyDown) {
      map.getView().setZoom(map.getView().getZoom() + 1);
      mapContainer.style.cursor = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 64 64\' width=\'32\' height=\'32\'%3E%3Cpath stroke=\'%23000\' stroke-width=\'4\' d=\'M32 0 v64 M0 32 h64\'/%3E%3C/svg%3E"), auto';
    } else {
      mapContainer.style.cursor = 'default';
    }
  });

  // Event listener para mover el puntero en el mapa
  map.on('pointermove', function(event) {
    if (map.getView().getInteracting()) {
      // Si el usuario está interactuando con el mapa (por ejemplo, arrastrando), establece el cursor de movimiento
      mapContainer.style.cursor = 'move';
    } else {
      // De lo contrario, establece el cursor predeterminado
      mapContainer.style.cursor = 'default';
    }
  });

/* CAPAS BASE */ 
  // BING 
    /*const bingimg = new ol.layer.Tile({
      source: new ol.source.BingMaps({.
        key: 'AmX1FVgGILJ-v3nO2tttFP5-CrYrAIip7w0Uzd9T_UfQqZz6ZoDrmgyv2rnhxO9z',
        imagerySet: 'Aerial'
      }),
      visible: false,
      title: '12-BING'
    });*/

  // Añadir capas base link https://www.faneci.com/url-para-anadir-mapas-base-en-qgis/
  // GOOGLE MAPS 
    const googleSatelliteLayer = new ol.layer.Tile({
      title: 'Google Satellite',
      visible: false,
      source: new ol.source.XYZ({
        url: 'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
      })
    }); 

  // DG-DGGMA
    /*var projectionExtentMosDG = view.getProjection().getExtent();
    var size = view.getResolution();

    var resolutions = [
      156543.03392804097, 78271.51696402048, 39135.75848201024,
      19567.87924100512, 9783.93962050256, 4891.96981025128,
      2445.98490512564, 1222.99245256282, 611.49622628141,
      305.748113140705, 152.8740565703525, 76.43702828517625,
      38.21851414258813, 19.109257071294063, 9.554628535647032,
      4.777314267823516, 2.388657133911758, 1.194328566955879,
      0.5971642834779395, 0.29858214173896974, 0.14929107086948487
    ];

    var matrixIds = resolutions.map((_, i) => `EPSG:900913:${i}`);

    var tileGrid = new ol.tilegrid.WMTS({
      origin: [-20037508.342789, 20037508.342789],
      resolutions: resolutions,
      matrixIds: matrixIds
    });

    const diglob2 = new ol.layer.Tile({
      source: new ol.source.WMTS({
        url: "https://ce2024.inegi.org.mx/mdmCacheSatCE24/service/wmts",
        layer: "Mapa imagenes CE2024",
        matrixSet: "EPSG:900913",
        format: "image/jpeg",
        projection: 'EPSG:900913',
        tileGrid: tileGrid,
        style: "_null",
        wrapX: true
      }),
    });*/
	
	// SIDAISAR
		// Definir la extensión de la proyección
		const projectionExtentMosSI = [
		    -13957190.6058352272957563 - 10,       // minX (sin cambios)
		    518952.7851991038769484 + 290,     // minY + 40
		    -3069854.1762334350496531 + 480,        // maxX (sin cambios)
		    4062572.0000000000000000 + 18     // maxY + 40
		];

			
		/*const projectionExtentMosSI = [
		    -13967260.605835227, // minX - 10000
		    518952.7851991039,   // minY (se mantiene igual)
		    -2879984.176233435,  // maxX - 10000
		    4062560.0000000000   // maxY (se mantiene igual)
		];*/

	
	
		// Definir el tamaño base
		const size2 = 9935.99;
	
		// Definir las resoluciones y los matrixIds
		const resolutionsMosSI = [];
		const matrixIdsMosSI = [];
		for (let z = 0; z < 17; ++z) {
		    resolutionsMosSI[z] = size2 / Math.pow(2, z);
		    matrixIdsMosSI[z] = "EPSG:3857:" + z;
		}
	
		// Crear la capa WMTS en OpenLayers v7
		const geoeye1 = new ol.layer.Tile({
			visible: false,
		    source: new ol.source.WMTS({
		        url: 'http://10.153.3.20:85/geowebcache/service/wmts?crs=EPSG:3857',
		        layer: 'SIDAISAR',
		        matrixSet: 'EPSG:3857',
		        matrixIds: matrixIdsMosSI,
		        format: 'image/png',
		        style: '_null',
		        tileGrid: new ol.tilegrid.WMTS({
		            origin: ol.extent.getTopLeft(projectionExtentMosSI),
		            resolutions: resolutionsMosSI,
		            matrixIds: matrixIdsMosSI
		        }),
		        tileSize: [200, 200],
		    }),
		    title: '9-GEOEYE',
		    type: 'base',
		});
		
	// ONE ATLAS
	
/*
	const spot6 = new ol.layer.Tile({
	    title: "3-SPOT-6", // Nombre de la capa
	    name: "3-SPOT-6",
	    source: new ol.source.TileWMS({
			url: "",
			params: {

				LAYERS: "layer_0",
				FORMAT: "image/png",
				TRANSPARENT: true,
				VERSION: "1.1.1",
				SRS: "EPSG:3857",
			}, 
	    }),
	    visible: true, // Hacer visible la capa por defecto
	});




	const spot6a = new ol.layer.Tile({
	    title: "3-SPOT-6a",
	    source: new ol.source.TileWMS({
	        url: "https://access.foundation.api.oneatlas.airbus.com/api/v1/items/6f490654-49ec-477a-aa9f-7f91e967c05d/wms",
	        params: {
	            LAYERS: "layer_0",
	            FORMAT: "image/png",
	            TRANSPARENT: true,
	            VERSION: "1.1.1",
	            SRS: "EPSG:3857",
	        },
	    }),
	    visible: false, // Oculto inicialmente
	});
	
	const activeLayerNames = map.getLayers().getArray()
	  .filter(layer => layer.getVisible()) // Filtra solo las capas visibles
	  .map(layer => layer.get('title')) // Obtiene el nombre de la capa

	function cargaatlas(){
		const oneAtlas = document.getElementById("oneatlas");

		if (localStorage.getItem('OneAtlasCB')==='true') {
			logueoAtlas();
		} else {
			alertmsg("Seleccione la imagen de One Atlas");
		}
	}
	
	var accestoken='';
	let a_geom = ""; 
	let a_date = "";
	let a_cons = "";
	function logueoAtlas() {
		    const url = 'https://authenticate.foundation.api.oneatlas.airbus.com/auth/realms/IDP/protocol/openid-connect/token';
		    const data = new URLSearchParams({
		      grant_type: 'api_key',
		      apikey: 'MR5HgAOug-KXxmDS5kzwrW85HIuKqDAgY2vWmthZQWuUDcYfPTsrPCXr2P93-w-pJQVA014f7wLvohn9cqlEpw==',
		      client_id: 'IDP'
		    });

		    fetch(url, {
		      method: 'POST',
		      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		      body: data.toString()
		    })
		    .then(response => response.json())
		    .then(data => {
		      accessToken = data.access_token;
		      //console.log('Token obtenido:', accessToken);
		     			ejecutaAtlas();
		    })
		    .catch(error => console.error('Error en autenticación:', error));
		}
		
		// Definir highlight a nivel global (fuera de cualquier función)
		var highlight = new ol.layer.Vector({
		    source: new ol.source.Vector(),
		    properties: {
		        name: "INFORMACION"
		    }
		});

		// Asegúrate de agregar la capa highlight al mapa solo una vez, fuera del bucle
		map.addLayer(highlight);

		function ejecutaAtlas() {
		    var baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
		    
		    var view = parent.map.getView();
		    var centerCoord = view.getCenter();
		    var center = ol.proj.transform(centerCoord, 'EPSG:3857', 'EPSG:4326');
		    
		    var ajax = nuevoAjax();
		    ajax.open("GET", 'obt_atlas.jsp?filtro=calidad&x=' + center[0] + '&y=' + center[1] + '&box=' + squareCenter() + '&boxtotal=' + squareCentertotal(), true);
		    ajax.onreadystatechange = function() {
		        if (ajax.readyState == 4) {
		            var val = ajax.responseText;
		            if (val == '1' || val == 1) {
						alertmsg("No existen coordenadas con ese punto " + center[0].toString().substring(0,8) + " , " + center[1].toString().substring(0,6));
		                //console.log("No existen coordenadas en este punto " + center[0].toString().substring(0,8) + " , " + center[1].toString().substring(0,6));
		            } else {
		                val = val.replace(/\n/g, '');
		                val = val.replace(/\r/g, '');
		                var array = val.split('#');
		                
		                // Limpiar la capa highlight y ocultar las imágenes
		                highlight.getSource().clear();
		                spot6.setVisible(false);
		                spot6a.setVisible(false);
		                
		                for (let n = 0; n < array.length; n++) {
		                    let array2 = array[n].split('&');
		                    let a_id = array2[0];
		                    a_date = array2[1];
		                    a_geom = array2[2];
		                    a_cons = array2[3];
		                    let a_cloud = array2[4];
		                    let a_angle = array2[5];
		                    
		                    //console.log("a_date:", a_date);
		                   // console.log("a_cons:", a_cons);
		                   // console.log("a_geom:", a_geom);
		                    
		                    // Establecer la URL y visibilidad de las capas WMS
		                    switch (n) {
		                        case 0:
		                            //spot6.getSource().setUrl(`${baseUrl}/proxywms?token=${accessToken}&a_id=${a_id}`);
									spot6.getSource().setUrl(`https://9f01e6b3-3d35-42b3-b67a-992acac2cc84-00-2apen5fw24aip.picard.replit.dev/proxyWMS?token=${accessToken}&a_id=${a_id}`);
									spot6.setVisible(true);
									//console.log("se lanzo la capa spot6");
									//console.log("se lanzo con la url de node");
		                            break;
		                        case 1:
		                            //spot6a.getSource().setUrl(`${baseUrl}/proxywms?token=${accessToken}&a_id=${a_id}`);
									spot6a.getSource().setUrl(`https://9f01e6b3-3d35-42b3-b67a-992acac2cc84-00-2apen5fw24aip.picard.replit.dev/proxyWMS?token=${accessToken}&a_id=${a_id}`);
									spot6a.setVisible(true);
									//console.log("se lanzo con la url de node");
								//	console.log("se lanzo la capa spot6 A");
		                            break;
		                    }
							
							procesarGeometria(a_geom, a_date, a_cons);
		                }
		            }
		        }
		    };
		    ajax.send(null);
		}
		
		function convertirMultipolygon(multipolygonString) {
		    // Eliminar el prefijo "MULTIPOLYGON(((" y el sufijo ")))"
		    const coordinatesString = multipolygonString.replace("MULTIPOLYGON(((", "").replace(")))", "");

		    // Separar los anillos del polígono (aunque en este caso solo hay uno)
		    const polygons = coordinatesString.split("),(");

		    // Convertir cada anillo en una estructura válida para OpenLayers
		    const result = polygons.map(polygon => [
		        polygon.split(",").map(coord => {
		            const [lon, lat] = coord.trim().split(" ").map(parseFloat);
		            return [lon, lat];
		        })
		    ]);

		    return result;
		}
		
		function procesarGeometria(a_geom) {
		    if (!a_geom) {
		        //console.error("No hay geometría válida.");
				alertmsg("No hay geometria valida.");
		        return;
		    }

		    const coordinates = convertirMultipolygon(a_geom);

		   // console.log("Coordenadas convertidas:", coordinates);

		    const multiPolygon = new ol.geom.MultiPolygon(coordinates);

		    const style = new ol.style.Style({
		        stroke: new ol.style.Stroke({
		            color: '#FFFF00',
		            width: 2
		        }),
				text: new ol.style.Text({
				        font: '14px Arial', // Tamaño y tipo de fuente
				        fill: new ol.style.Fill({ color: '#FFFFFF' }), // Color del texto
				        stroke: new ol.style.Stroke({ color: '#000000', width: 2 }), // Borde del texto
				        text: a_date+" / "+a_cons, // Texto que se mostrará
				        offsetY: -10, // Desplazamiento en Y para que no se solape con la línea
				    })

		    });

		    const vectorSource12 = new ol.source.Vector({
		        features: [new ol.Feature(multiPolygon)]
		    });

		    const vectorLayer12 = new ol.layer.Vector({
		        source: vectorSource12,
		        style: style
		    });

		    map.addLayer(vectorLayer12);
		}

		
		function squareCenter(){
				var maxExtent = map.getView().calculateExtent(map.getSize());

				// Obtener la extensión actual del mapa
				var maxExtent = map.getView().calculateExtent(map.getSize());

				// Calcular ancho y alto total
				var anchoTotal = maxExtent[2] - maxExtent[0]; // maxX - minX
				var altoTotal = maxExtent[3] - maxExtent[1]; // maxY - minY

				// Calcular el 10% del tamaño
				var ancho30 = anchoTotal * 0.1;
				var alto30 = altoTotal * 0.1;

				// Calcular el centro de la extensión
				var centroX = (maxExtent[0] + maxExtent[2]) / 2;
				var centroY = (maxExtent[1] + maxExtent[3]) / 2;

				// Calcular nuevos límites
				var minX = centroX - ancho30 / 2;
				var maxX = centroX + ancho30 / 2;
				var minY = centroY - alto30 / 2;
				var maxY = centroY + alto30 / 2;
			
				return (minX+" "+minY+","+maxX+" "+minY+","+minX+" "+maxY+","+maxX+" "+maxY+","+minX+" "+minY);
		}

		function squareCentertotal() {
		    var maxExtent = map.getView().calculateExtent(map.getSize());

		    var minX = maxExtent[0]; // Límite izquierdo
		    var minY = maxExtent[1]; // Límite inferior
		    var maxX = maxExtent[2]; // Límite derecho
		    var maxY = maxExtent[3]; // Límite superior

		    return `${minX} ${minY},${maxX} ${minY},${maxX} ${maxY},${minX} ${maxY},${minX} ${minY}`;
		}
*/

		
	
	

/* MOSTRAR CAPAS BASE */ 
 // var bing = document.getElementById("bing");
 // bing.addEventListener("change", comprobarCapasBase);

  var google = document.getElementById("google");
  google.addEventListener("change", comprobarCapasBase);

  //var diglob22 = document.getElementById("dg_dggmaradio");
  //diglob22.addEventListener("change", comprobarCapasBase);
  
  var sidaisar1 = document.getElementById("sidaisar");
    sidaisar1.addEventListener("change", comprobarCapasBase);
	
  //var oneatlas1 = document.getElementById("oneatlas");
 // oneatlas1.addEventListener("change", comprobarCapasBase);

  var capaBlanca = document.getElementById("blanck");
  capaBlanca.addEventListener("change", comprobarCapasBase);

  function comprobarCapasBase(e) {
    /*if ($('#bing').is(':checked')) {
      bingimg.setVisible(true);
      localStorage.setItem('BingCBM', true);
	  //spot6.setVisible(false);
	  //spot6a.setVisible(false);
    } else {
      bingimg.setVisible(false);
      localStorage.setItem('BingCBM', false);
    }*/

    if ($('#google').is(':checked')) {
      googleSatelliteLayer.setVisible(true);
      localStorage.setItem('GoogleCBM', true);
	  
	  //spot6.setVisible(false);
	  //spot6a.setVisible(false);
    } else {
      googleSatelliteLayer.setVisible(false);
      localStorage.setItem('GoogleCBM', false);
    }

    /*if ($('#dg_dggmaradio').is(':checked')) {
      diglob2.setVisible(true);
      localStorage.setItem('DigLob2CB', true);
	  spot6.setVisible(false);
	  spot6a.setVisible(false);
    } else {
      diglob2.setVisible(false);
      localStorage.setItem('DigLob2CB', false);
    }*/
	
	if ($('#sidaisar').is(':checked')) {
		geoeye1.setVisible(true);
	    localStorage.setItem('SidaisarCB', true);
		//spot6.setVisible(false);
		//spot6a.setVisible(false);
	} else {
	  	geoeye1.setVisible(false);
	    localStorage.setItem('SidaisarCB', false);
	}
	
	/*if ($('#oneatlas').is(':checked')) {
			logueoAtlas();
			localStorage.setItem('OneAtlasCB', true);
		} */

    if ($('#blanck').is(':checked')) {
      googleSatelliteLayer.setVisible(false);
     // bingimg.setVisible(false);
      //diglob2.setVisible(false);
	  geoeye1.setVisible(false);
	 // spot6.setVisible(false);
	  //spot6a.setVisible(false);
	  
      localStorage.setItem('BingCBM', false);
      localStorage.setItem('GoogleCBM', false);
      //localStorage.setItem('DigLob2CB', false);
	  localStorage.setItem('SidaisarCB', false);
	  
    } 
  }

  const layers = map.getLayers().getArray(); // Obtiene todas las capas del mapa
  const activeLayers = layers.filter(layer => layer.getVisible()); // Filtra las capas visibles

  //console.log("Capas activas:", activeLayers);
  
/* AGREGAR CAPAS BASE */
//  map.addLayer(bingimg);
  map.addLayer(googleSatelliteLayer);
  //map.addLayer(diglob2);
  map.addLayer(vectorLayer);
  map.addLayer(geoeye1);
  //map.addLayer(spot6);
  //map.addLayer(spot6a);

/* GUARDAR CAPAS BASE */ 
  if(localStorage.getItem('GoogleCBM')==='true'){
    googleSatelliteLayer.setVisible(true);
    document.getElementById('google').checked = true;
  } else {
    googleSatelliteLayer.setVisible(false);
    document.getElementById('google').checked = false;
  }

 /* if(localStorage.getItem('BingCBM')==='true'){
    bingimg.setVisible(true);
    document.getElementById('bing').checked = true;
  } else {	
    bingimg.setVisible(false);
    document.getElementById('bing').checked = false;
  }*/

 /* if(localStorage.getItem('DigLob2CB')==='true'){
    diglob2.setVisible(true);
    document.getElementById('dg_dggmaradio').checked = true;
  } else {
    diglob2.setVisible(false);
    document.getElementById('dg_dggmaradio').checked = false;
  }*/
  
  if(localStorage.getItem('SidaisarCB')==='true'){
      geoeye1.setVisible(true);
      document.getElementById('sidaisar').checked = true;
    } else {
      geoeye1.setVisible(false);
      document.getElementById('sidaisar').checked = false;
    }

/* OPACIDAD */ 
  function menos() {
    var layer = map.getLayers().item(0); // obtener la primera capa en el mapa
    var currentOpacity = layer.getOpacity(); // obtener la opacidad actual
    var newOpacity = currentOpacity - 0.1; // reducir la opacidad en 10%
    layer.setOpacity(newOpacity); // establecer la nueva opacidad


    var currentOpacityGoogle = googleSatelliteLayer.getOpacity();
    googleSatelliteLayer.setOpacity(currentOpacityGoogle - 0.1);

    
	var sidaisarop = geoeye1.getOpacity();
	    geoeye1.setOpacity(sidaisarop - 0.1);
  }

  function mas() {
    var layer = map.getLayers().item(0); // obtener la primera capa en el mapa
    var currentOpacity = layer.getOpacity(); // obtener la opacidad actual
    var newOpacity = currentOpacity + 0.1; // aumentar la opacidad en 10%
    layer.setOpacity(newOpacity); // establecer la nueva opacidad

    var currentOpacityGoogle = googleSatelliteLayer.getOpacity();
    googleSatelliteLayer.setOpacity(currentOpacityGoogle + 0.1);

    
	var sidaisarop1 = geoeye1.getOpacity();
		geoeye1.setOpacity(sidaisarop1 + 0.1);

  } 

/* LAYERS */

 var mxestados =  new ol.layer.Tile({
    title: 'Estados',
    name: 'Estados',
    visible: true,
    source: new ol.source.TileWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:entidad_2024', TRANSPARENT: true, STYLES: 'estados',}, 
      serverType: 'geoserver',
    })
  }); 


  var estadoset = new ol.layer.Image({
    title: 'EstadoSet',
    name: 'estadoset',
    visible: true,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:entidad_2024', STYLES: 'estadoset', TRANSPARENT: true},
      serverType: 'geoserver',
    })
  });

  var municipios =  new ol.layer.Tile({
    title: 'Municipios',
    name: 'Municipios',
    visible: false,
    /*minZoom: 8,
    maxScale: 0,
    minScale: 3000000,*/
	maxResolution: 611.496226,
    source: new ol.source.TileWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:municipio_2024', STYLES: 'mun_hist', TRANSPARENT: true,}, /// duda
      serverType: 'geoserver',
    })
  });
 

  var municipioset =  new ol.layer.Image({
    title: 'Nombre Municipios',
    name: 'municipioset',
    visible: false,
    /*minZoom: 9,
    maxScale: 0,
    minScale: 1000000,*/
	maxResolution:305.748113,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:municipio_2024', STYLES: 'municipioset', TRANSPARENT: true}, /// duda
      serverType: 'geoserver'
    })
  });

  var agebrural =  new ol.layer.Tile({
    title: 'Ageb Rural',
    name: 'agebrural',
    visible: false,
    /*maxScale: 0,
    minZoom: 10,
    minScale: 1000000,*/
	maxResolution: 152.874057,
    source: new ol.source.TileWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:ageb_2024', TRANSPARENT: true, STYLES: 'agebs', TILED: true}, /// duda
      serverType: 'geoserver',
    })
  });
  var agebruralset =  new ol.layer.Image({
    title: 'Agebrural set',
    name: 'agebruralset',
    visible: false,
    /*maxScale: 0,
    minZoom: 10,
    minScale: 600000,*/
	maxResolution: 152.874057,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:ageb_2024', TRANSPARENT: true, STYLES: 'agebset_hist', TILED:true,}, /// duda
      serverType: 'geoserver',
    })
  });

  var locurbana =  new ol.layer.Tile({
    title: 'Loc Urbana',
    name: 'locurbana',
    visible: false,
    /*maxScale: 0,
    minZoom: 9,
    minScale: 500000,*/
	maxResolution: 305.748113,
    source: new ol.source.TileWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      //params: {'LAYERS': 'HISTORICO:l_2024', TRANSPARENT: true, STYLES: 'urbanas', CQL_FILTER: 'ambito=\'Urbana\' or ambito=\'U\'', TILED:true,}, /// duda
	  params: {
	        'LAYERS': 'HISTORICO:l_2024',
	        'TRANSPARENT': true,
	        'STYLES': 'urbanas',
	        'CQL_FILTER': "ambito='Urbana' OR ambito='U'", 
	        'TILED': true
	      },
	  serverType: 'geoserver',
    })
  });

  var locurbanatxt =  new ol.layer.Image({
    title: 'Loc Urbana',
    name: 'locurbanatxt',
    visible: false,
    /*maxScale: 0,
    minZoom: 9,
    minScale: 100000,*/
	maxResolution: 305.748113,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      //params: {'LAYERS': 'HISTORICO:l_2024', TRANSPARENT: true, STYLES: 'urbanaset_hist', CQL_FILTER: 'ambito=\'Urbana\' or ambito=\'U\'', TILED:true,}, /// duda
	  params: {
	        'LAYERS': 'HISTORICO:l_2024',
	        'TRANSPARENT': true,
	        'STYLES': 'urbanaset_hist',
	        'CQL_FILTER': "ambito='Urbana' OR ambito='U'", // Usa comillas dobles para evitar errores de parseo
	        'TILED': true
	      },
	  serverType: 'geoserver',
    })
  });


  var ageburbana =  new ol.layer.Tile({
    title: 'Ageb Urbana',
    name: 'ageburbana',
    visible: false,
    /*maxScale: 0,
    minZoom: 12,
    minScale: 600000,*/
	maxResolution: 38.218514, 
    source: new ol.source.TileWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:agebu_2024', TRANSPARENT: true, STYLES: 'agebs', TILED:true,}, /// duda
      serverType: 'geoserver',
    })
  });

  var ageburbanatxt =  new ol.layer.Image({
    title: 'Ageb Urbana txt',
    name: 'ageburbanatxt',
    /*visible: false,
    maxScale: 0,
    minZoom: 13,
    minScale: 100000,*/
	maxResolution: 19.109257,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:agebu_2024', TRANSPARENT: true, STYLES: 'agebset_hist',TILED:true,}, /// duda
      serverType: 'geoserver',
    })
  });

  var locrural =  new ol.layer.Tile({
    title: 'Loc Rural',
    name: 'locrural',
    visible: false,
    /*maxScale: 0,
    minZoom: 10,
    minScale: 300000,*/
	maxResolution: 152.874057,
    source: new ol.source.TileWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      //params: {'LAYERS': 'HISTORICO:l_2024', TRANSPARENT: true, STYLES: 'porur', CQL_FILTER: 'ambito=\'Rural\'  or ambito=\'R\'',TILED:true,}, /// duda
	  params: {
	        'LAYERS': 'HISTORICO:l_2024',
	        'TRANSPARENT': true,
	        'STYLES': 'porur',
	        'CQL_FILTER': "ambito='Rural' OR ambito='R'", 
	        'TILED': true
	      },
	  serverType: 'geoserver',
    })
  });

   var locruraltxt =  new ol.layer.Image({
    title: 'Loc Rural txt',
    name: 'locruraltxt',
    visible: false,
    /*maxScale: 0,
    minZoom: 11,
    minScale: 100000,*/
	maxResolution: 76.437028,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      //params: {'LAYERS': 'HISTORICO:l_2024', TRANSPARENT: true, STYLES: 'poruret_hist', CQL_FILTER: 'ambito=\'Rural\'  or ambito=\'R\'',TILED:true,}, /// duda
	  params: {
	        'LAYERS': 'HISTORICO:l_2024',
	        'TRANSPARENT': true,
	        'STYLES': 'poruret_hist',
	        'CQL_FILTER': "ambito='Rural' OR ambito='R'", 
	        'TILED': true
	      },
	  serverType: 'geoserver',
    })
  });

  var locrur_ext =  new ol.layer.Tile({
    title: 'Loc Rural Ext',
    name: 'locruralext',
    visible: false,
    /*maxScale: 0,
    minZoom: 10,
    minScale: 300000,*/
	maxResolution: 152.874057,
    source: new ol.source.TileWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:pe_2024', TRANSPARENT: true, STYLES: 'pol_rur_ext',TILED:true,}, /// duda
      serverType: 'geoserver',
    })
  });

  var mza =  new ol.layer.Tile({
    title: 'Manzana',
    name: 'mza',
    visible: false,
    /*maxScale: 0,
    minZoom: 12,
    minScale: 600000,*/
	maxResolution: 38.218514,
    source: new ol.source.TileWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:manzana_2024', TRANSPARENT: true, STYLES: 'mza',TILED:true,}, /// duda
      serverType: 'geoserver',
    })
  });

  var mzatxt =  new ol.layer.Image({
    title: 'Mza txt',
    name: 'mzatxt',
    visible: false,
    /*maxScale: 0,
    minZoom: 13,
    minScale: 200000,*/
	maxResolution: 19.109257,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:manzana_2024', TRANSPARENT: true, STYLES: 'mzaet_hist',TILED:true,}, /// duda
      serverType: 'geoserver',
    })
  });

  var caserio =  new ol.layer.Image({
    title: 'Caserio',
    name:'caserio',
    visible: false,
    /*maxScale: 0,
    minZoom: 12,
    minScale: 600000,*/
	maxResolution: 38.218514,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:caserio_2024', TRANSPARENT: true, STYLES: 'caserio_hist',TILED:true,}, /// duda
      serverType: 'geoserver',
    })
  });

  var locvig =  new ol.layer.Tile({
    title: 'Locs Vig',
    name: 'locsvig',
    visible: false,
    /*maxScale: 0,
    minZoom: 12,
    minScale: 200000,*/
	maxResolution: 38.218514,
    source: new ol.source.TileWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:lpr_2024', TRANSPARENT: true, STYLES: 'locsrur1_hist',TILED:true,}, /// duda
      serverType: 'geoserver',
    })
  });

  var txtlocvig =  new ol.layer.Image({
    title: 'Loc Vig txt',
    name: 'locsvigtxt',
    visible: false,
    /*maxScale: 0,
    minZoom: 12,
    minScale: 100000,*/
	maxResolution: 38.218514,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms',
      params: {'LAYERS': 'HISTORICO:lpr_2024', TRANSPARENT: true, STYLES: 'locsruret1_hist',TILED:true,}, /// duda
      serverType: 'geoserver',
    })
  });


  var actlayer = new ol.layer.Image({
    title: 'Actualizaciones',
    name: 'actualizaciones',
    visible: false,
    /*minScale: 500000,
    minZoom: 9,
    maxScale: 0,*/
	maxResolution: 	305.748113,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms', 
      params: {'LAYERS': 'HISTORICO:nuevo_2024', TRANSPARENT: true, TILED:true,}, 
      serverType: 'geoserver',
    })
  });

  var vialidad = new ol.layer.Image({
    title: 'Vialidad',
    name: 'vialiad',
    visible: false,
    /*minScale: 500000,
    minZoom: 9,
    maxScale: 0,*/
	maxResolution: 	305.748113,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms', 
      params: {'LAYERS': 'HISTORICO:vial_2024', TRANSPARENT: true, TILED:true,}, 
      serverType: 'geoserver',
    })
  });

  var nu_ext = new ol.layer.Image({
    title: 'nu_ext',
    name: 'nu_ext',
    visible: false,
    /*minScale: 200000,
    maxScale: 0,
    minZoom: 15,*/
	maxResolution: 4.777314,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms', 
      params: {'LAYERS': 'HISTORICO:ne_ne', TRANSPARENT: true, 'TILED':true,}, 
      serverType: 'geoserver',
    })
  });

  var nu_ext_txt = new ol.layer.Image({
    title: 'nu_ext_txt',
    name: 'nu_ext_txt',
    visible: false,
    /*minScale: 100000,
    maxScale: 0,
    minZoom: 15,*/
	maxResolution: 4.777314,
    source: new ol.source.ImageWMS({
      url: 'http://w-webintratslic.inegi.gob.mx:8086/geoserver/HISTORICO/wms', 
      params: {'LAYERS': 'HISTORICO:ne_ne', STYLES: 'neet', TRANSPARENT: true, TILED:true,}, 
      serverType: 'geoserver',
    })
  });
  
  var streetview = new ol.layer.Tile({
      title: 'GoogleStreetView',
    minZoom:8,
      source: new ol.source.XYZ({
          url: 'https://mts2.google.com/mapslt?lyrs=svv&w=256&h=256&hl=en&style=40,18&x={x}&y={y}&z={z}',
          maxZoom: 21
      }),
      opacity: 0.5,
      visible: false
  });

/* ADD LAYERS */ 
  map.addLayer(vialidad);

  map.addLayer(agebrural);
  map.addLayer(agebruralset);

  map.addLayer(locurbana);
  map.addLayer(locurbanatxt);

  map.addLayer(mza);
  map.addLayer(mzatxt);

  map.addLayer(locrur_ext);

  map.addLayer(locrural);
  map.addLayer(locruraltxt);

  map.addLayer(ageburbana);
  map.addLayer(ageburbanatxt);

  map.addLayer(caserio);

  map.addLayer(locvig);
  map.addLayer(txtlocvig);

  map.addLayer(municipios);
  map.addLayer(municipioset);

  map.addLayer(mxestados);
  map.addLayer(estadoset);

  map.addLayer(actlayer);

  map.addLayer(nu_ext);
  map.addLayer(nu_ext_txt);
  
  map.addLayer(streetview);

/* CARGAR CAPAS */ 
  window.onload = function() {
    var checkboxes = document.querySelectorAll('.check');

    checkboxes.forEach(function(checkbox) {
      checkbox.onchange = function() {
          if(checkbox.id === 'txtEstados') {
            if(!checkbox.checked) {
              estadoset.setVisible(false);
            } else 
              {
                estadoset.setVisible(true);
              }
          }

          if(checkbox.id === 'agebrural'){
            if(checkbox.checked){
              agebrural.setVisible(true);
              document.getElementById("btnAgebRural").style.background = "#81D4FA";
              localStorage.setItem("AgebRuralCB", true);
            } else {
              agebrural.setVisible(false);
              document.getElementById("btnAgebRural").style.background = "#F5F5F5";
              localStorage.setItem("AgebRuralCB", false);
            }
          }

          if(checkbox.id === 'txtAgebRural'){
            if(checkbox.checked){
              agebruralset.setVisible(true);
              localStorage.setItem("AgebRuralCBTxt", true);
            } else {
              agebruralset.setVisible(false);
              localStorage.setItem("AgebRuralCBTxt", false);
            }
          }

          if(checkbox.id === 'locurbana'){
            if(checkbox.checked){
              locurbana.setVisible(true);
              document.getElementById("btnLocUrbana").style.background = "#F0F4C3";
              localStorage.setItem("LocUrbanaCB", true);
            } else {
              locurbana.setVisible(false);
              document.getElementById("btnLocUrbana").style.background = "#F5F5F5";
              localStorage.setItem("LocUrbanaCB", false);
            }
          }

          if(checkbox.id === 'txtLocUrbana'){
            if(checkbox.checked){
              locurbanatxt.setVisible(true);
              localStorage.setItem("LocUrbanaCBTxt", true);
            } else {
              locurbanatxt.setVisible(false);
              localStorage.setItem("LocUrbanaCBTxt", false);
            }
          }

          if(checkbox.id === 'chbxageburbana'){
            if(checkbox.checked){
              ageburbana.setVisible(true);
              document.getElementById("btnAgebUrbana").style.background = "#E1F5FE";
              localStorage.setItem("AgebUrbanaCB", true);
            } else {
              ageburbana.setVisible(false);
              document.getElementById("btnAgebUrbana").style.background = "#F5F5F5";
              localStorage.setItem("AgebUrbanaCB", false);
            }
          }

          if(checkbox.id === 'txtageburbana'){
            if(checkbox.checked){
              ageburbanatxt.setVisible(true);
              localStorage.setItem("AgebUrbanaCBTxt", true);
            } else {
              ageburbanatxt.setVisible(false);
              localStorage.setItem("AgebUrbanaCBTxt", false);
            }
          }


          if(checkbox.id === 'muni'){
              if(checkbox.checked){
                municipios.setVisible(true);
                document.getElementById("btnMunicipios").style.background = "#A1887F";
                localStorage.setItem("municipiosCB", true);
              } else {
                municipios.setVisible(false);
                document.getElementById("btnMunicipios").style.background = "#F5F5F5";
                localStorage.setItem("municipiosCB", false);
              }
            }

            if(checkbox.id === 'txtMunicipios'){
              if(checkbox.checked){
                municipioset.setVisible(true);
                localStorage.setItem("municipiosCBTxt", true);
              } else {
                municipioset.setVisible(false);
                localStorage.setItem("municipiosCBTxt", false);
              }
            }

            if (checkbox.id === 'chbxlocrural') {
              if (checkbox.checked) {
                document.getElementById("btnLocRural").style.background = "#D7CCC8";
                locrural.setVisible(true);
                localStorage.setItem("LocRuralCB", true);
              } else {
                document.getElementById("btnLocRural").style.background = "#F5F5F5";
                locrural.setVisible(false);
                localStorage.setItem("LocRuralCB", false);
              }
            }

            if (checkbox.id === 'chbxtxtlocrural') {
              if (checkbox.checked) {
                locruraltxt.setVisible(true);
                localStorage.setItem("LocRuralCBTxt", true);
              } else {
                locruraltxt.setVisible(false);
                localStorage.setItem("LocRuralCBTxt", false);
              } 
            }

            if(checkbox.id==='chbxlocrur_ext'){
              if(checkbox.checked){
                document.getElementById("btnLocRur_Ext").style.background = "#D7CCC8";
                locrur_ext.setVisible(true);
                localStorage.setItem("LocExternoCB", true);
              } else {
                document.getElementById("btnLocRur_Ext").style.background = "#F5F5F5";
                locrur_ext.setVisible(false);
                localStorage.setItem("LocExternoCB", false);
              }
            }

            if (checkbox.id === 'chbxcaserio') {
              if (checkbox.checked) {
                document.getElementById("btnCaserio").style.background = "#B0BEC5";
                caserio.setVisible(true);
                localStorage.setItem("caserioCB", true);
              } else {
                document.getElementById("btnCaserio").style.background = "#F5F5F5";
                caserio.setVisible(false);
                localStorage.setItem("caserioCB", false);
              }
            }

            if(checkbox.id === 'chbxmanzana'){
              if(checkbox.checked){
                mza.setVisible(true);
                document.getElementById("btnMza").style.background = "#BCAAA4";
                localStorage.setItem("manzanasCB", true);
              } else {
                mza.setVisible(false);
                document.getElementById("btnMza").style.background = "#F5F5F5";
                localStorage.setItem("manzanasCB", false);
              }
            }

            if (checkbox.id === 'chbxtxtmanzana') {
              if (checkbox.checked) {
                mzatxt.setVisible(true);
                localStorage.setItem("manzanasCBTxt", true);
              } else {
                mzatxt.setVisible(false);
                localStorage.setItem("manzanasCBTxt", false);
              } 
            } 

            if(checkbox.id === 'chbxlocvig'){
              if(checkbox.checked){
                locvig.setVisible(true);
                document.getElementById("btnLocVig").style.background = "#BDBDBD";
                localStorage.setItem("LocVigCB", true);
              } else {
                locvig.setVisible(false);
                document.getElementById("btnLocVig").style.background = "#F5F5F5";
                localStorage.setItem("LocVigCB", false);
              }
            }

            if (checkbox.id === 'chbxtxtlocvig') {
              if (checkbox.checked) {
                txtlocvig.setVisible(true);
                localStorage.setItem("LocVigCBTxt", true);
              } else {
                txtlocvig.setVisible(false);
                localStorage.setItem("LocVigCBTxt", false);
              } 
            } 

            if(checkbox.id === 'chbxact'){
              if(checkbox.checked){
                actlayer.setVisible(true);
                document.getElementById("btnAct").style.background = "#B9F6CA";
                localStorage.setItem("ActCB", true);
              } else {
                actlayer.setVisible(false);
                document.getElementById("btnAct").style.background = "#F5F5F5";
                localStorage.setItem("ActCB", false);
              }
            }

            if(checkbox.id === 'chbxvialidades'){
              if(checkbox.checked){
                vialidad.setVisible(true);
                document.getElementById("btnVia").style.background = "#90A4AE";
                localStorage.setItem("ViaCB", true);
              } else {
                vialidad.setVisible(false);
                document.getElementById("btnVia").style.background = "#F5F5F5";
                localStorage.setItem("ViaCB", false);
              }
            }

            if(checkbox.id === 'chbxnuext'){
              if(checkbox.checked){
                nu_ext.setVisible(true);
                document.getElementById("btnNuExt").style.background = "#FFE0B2";
                localStorage.setItem("NuExtCB", true);
              } else {
                nu_ext.setVisible(false);
                document.getElementById("btnNuExt").style.background = "#F5F5F5";
                localStorage.setItem("NuExtCB", false);
              }
            }

            if (checkbox.id === 'txtnuext') {
              if (checkbox.checked) {
                nu_ext_txt.setVisible(true);
                localStorage.setItem("NuExtCBTxt", true);
              } else {
                nu_ext_txt.setVisible(false);
                localStorage.setItem("NuExtCBTxt", false);
              } 
            } 
        }
      });

      document.getElementById('btnAgebRural').addEventListener('click', function(event) {
        var checkbox = document.getElementById('agebrural');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });

      document.getElementById('btnAgebUrbana').addEventListener('click', function(event) {
        var checkbox = document.getElementById('chbxageburbana');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });

      document.getElementById('btnLocUrbana').addEventListener('click', function(event) {
        var checkbox = document.getElementById('locurbana');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });

      document.getElementById('btnMunicipios').addEventListener('click', function(event) {
        var checkbox = document.getElementById('muni');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });

      document.getElementById('btnLocRural').addEventListener('click', function(event) {
        var checkbox = document.getElementById('chbxlocrural');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });

      document.getElementById('btnLocRur_Ext').addEventListener('click', function(event) {
        var checkbox = document.getElementById('chbxlocrur_ext');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });

      document.getElementById('btnCaserio').addEventListener('click', function(event) {
        var checkbox = document.getElementById('chbxcaserio');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });

      document.getElementById('btnMza').addEventListener('click', function(event) {
        var checkbox = document.getElementById('chbxmanzana');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });

      document.getElementById('btnLocVig').addEventListener('click', function(event) {
        var checkbox = document.getElementById('chbxlocvig');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });

      document.getElementById('btnAct').addEventListener('click', function(event) {
        var checkbox = document.getElementById('chbxact');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });

      document.getElementById('btnVia').addEventListener('click', function(event) {
        var checkbox = document.getElementById('chbxvialidades');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });

      document.getElementById('btnNuExt').addEventListener('click', function(event) {
        var checkbox = document.getElementById('chbxnuext');
        checkbox.checked = !checkbox.checked;
        checkbox.onchange(); // Trigger the onchange event
      });
  }

/* GUARDAR EL ESTADO DE LAS CAPAS */ 

  if(localStorage.getItem('AgebRuralCB')==='true'){
    agebrural.setVisible(true);
    document.getElementById("btnAgebRural").style.background = "#81D4FA";
  } else {
    agebrural.setVisible(false);
    document.getElementById("btnAgebRural").style.background = "#F5F5F5";
  }  

  if(localStorage.getItem('AgebRuralCBTxt')==='true'){
    agebruralset.setVisible(true);
    document.getElementById('txtAgebRural').checked = true;
  }
          

  if(localStorage.getItem('LocUrbanaCB')==='true'){
    locurbana.setVisible(true);
    document.getElementById("btnLocUrbana").style.background = "#F0F4C3";
  } else {
    locurbana.setVisible(false);
    document.getElementById("btnLocUrbana").style.background = "#F5F5F5";
  }

  if(localStorage.getItem('LocUrbanaCBTxt')==='true'){
    locurbanatxt.setVisible(true);
    document.getElementById("txtLocUrbana").checked = true;
  } else {
    locurbanatxt.setVisible(false);
  }

  if(localStorage.getItem('municipiosCB')==='true'){
    municipios.setVisible(true);
    document.getElementById("btnMunicipios").style.background = "#EFEBE9";
  } else {
    municipios.setVisible(false);
    document.getElementById("btnMunicipios").style.background = "#F5F5F5";
  }

  if(localStorage.getItem('municipiosCBTxt')==='true'){
    municipioset.setVisible(true);
    document.getElementById("txtMunicipios").checked = true;
  } else {
    municipioset.setVisible(false);
  }

  if(localStorage.getItem('LocRuralCB')==='true'){
    locrural.setVisible(true);
    document.getElementById("btnLocRural").style.background = "#D7CCC8";
  } else {
    locrural.setVisible(false);
    document.getElementById("btnLocRural").style.background = "#F5F5F5";
  }

  if(localStorage.getItem('LocRuralCBTxt')==='true'){
    locruraltxt.setVisible(true);
    document.getElementById("chbxtxtlocrural").checked = true;
  } else {
    locruraltxt.setVisible(false);
  }

  if(localStorage.getItem('LocExternoCB')==='true'){
    locrur_ext.setVisible(true);
    document.getElementById("btnLocRur_Ext").style.background = "#D7CCC8";
  } else {
    locrur_ext.setVisible(false);
    document.getElementById("btnLocRur_Ext").style.background = "#F5F5F5";
  }

  if(localStorage.getItem('manzanasCB')==='true'){
    mza.setVisible(true);
    document.getElementById("btnMza").style.background = "#BCAAA4";
  } else {
    mza.setVisible(false);
    document.getElementById("btnMza").style.background = "#F5F5F5";
  }

  if(localStorage.getItem('manzanasCBTxt')==='true'){
    mzatxt.setVisible(true);
    document.getElementById("chbxtxtmanzana").checked = true;
  } else {
    mzatxt.setVisible(false);
  }

  if(localStorage.getItem('caserioCB')==='true'){
    caserio.setVisible(true);
    document.getElementById("btnCaserio").style.background = "#B0BEC5";
  } else {
    caserio.setVisible(false);
    document.getElementById("btnCaserio").style.background = "#F5F5F5";
  }

  if(localStorage.getItem('AgebUrbanaCB') === 'true'){
    ageburbana.setVisible(true);
    document.getElementById("btnAgebUrbana").style.background = "#E1F5FE";
    document.getElementById("chbxageburbana").checked = true;
  } else {
    ageburbana.setVisible(false);
    document.getElementById("btnAgebUrbana").style.background = "#F5F5F5";
  }

  if(localStorage.getItem('AgebUrbanaCBTxt') === 'true'){
    ageburbanatxt.setVisible(true);
    document.getElementById("txtageburbana").checked = true;
  } else {
    ageburbanatxt.setVisible(false);
  }

  if(localStorage.getItem('LocVigCB') === 'true'){
    locvig.setVisible(true);
    document.getElementById("btnLocVig").style.background = "#BDBDBD";
    document.getElementById("chbxlocvig").checked = true;
  } else {
    locvig.setVisible(false);
    document.getElementById("btnLocVig").style.background = "#F5F5F5";
  }

  if(localStorage.getItem('LocVigCBTxt') === 'true'){
    txtlocvig.setVisible(true);
    document.getElementById("chbxtxtlocvig").checked = true;
  } else {
    txtlocvig.setVisible(false);
  }

  if(localStorage.getItem('ActCB') === 'true'){
    actlayer.setVisible(true);
    document.getElementById("btnAct").style.background = "#B9F6CA";
    document.getElementById("chbxact").checked = true;
  } else {
    actlayer.setVisible(false);
    document.getElementById("btnAct").style.background = "#F5F5F5";
  }

  if(localStorage.getItem('ViaCB') === 'true'){
    vialidad.setVisible(true);
    document.getElementById("btnVia").style.background = "#90A4AE";
    document.getElementById("chbxvialidades").checked = true;
  } else {
    vialidad.setVisible(false);
    document.getElementById("btnVia").style.background = "#F5F5F5";
  }

  if(localStorage.getItem('NuExtCB')==='true'){
    nu_ext.setVisible(true);
    document.getElementById("btnNuExt").style.background = "#FFE0B2";
  } else {
    nu_ext.setVisible(false);
    document.getElementById("btnNuExt").style.background = "#F5F5F5";
  }

  if (localStorage.getItem('NuExtCBTxt')==='true') {
    nu_ext_txt.setVisible(true);
    document.getElementById('txtnuext').checked = true;
  } else {
    nu_ext_txt.setVisible(false);
  } 

/* GUARDAR EL ZOOM Y COORDENADAS DEL MAPA */
  function saveMapState() {
      // Obtener el estado del mapa
      var mapState = {
        zoom: map.getView().getZoom(),
        center: ol.proj.toLonLat(map.getView().getCenter()),
        layers: []
      };
      
      // Guardar el estado del mapa en el almacenamiento local
      localStorage.setItem('mapState', JSON.stringify(mapState));
    }

  // Restaurar el estado del mapa
    function restoreMapState() {
      // Obtener el estado del mapa del almacenamiento local
      var mapState = JSON.parse(localStorage.getItem('mapState'));
      
      // Restaurar el estado del mapa
      if (mapState) {
        map.getView().setZoom(mapState.zoom);
        map.getView().setCenter(ol.proj.fromLonLat(mapState.center));
      }
    }

  // Agregar un controlador de eventos para el evento moveend del mapa
    map.on('moveend', function() {
      saveMapState();
      Actualiza_Extent();
    });

  // Restaurar el estado del mapa al cargar la página
    restoreMapState();

/* HISTORICO INPUT RANGE */ 

// PLAY
  function playHistorico() {
      const rangeInput = document.getElementById('rangeInput');
      const playButton = document.getElementById('play');
      let isPlaying = false;
      let intervalId = null;
      const intervalTime = 4000;
      let increment = 10; // Variable de incremento fuera de las funciones internas

      function updateYear() {
          let currentValue = parseInt(rangeInput.value);
          if (currentValue >= 120) {
              stopPlaying();
              return;
          }
          rangeInput.value = currentValue + increment;
          rangeInput.dispatchEvent(new CustomEvent('update'));
          updateBackground();
      }

      function startPlaying() {
          if (!isPlaying) {
              isPlaying = true;
              playButton.disabled = true;
              if (parseInt(rangeInput.value) >= 120) {
                  rangeInput.value = 0;
                  increment = 10; // Reinicia el incremento cada vez que llega al final
              }
              intervalId = setInterval(updateYear, intervalTime);
          }
      }

      function stopPlaying() {
		
          if (isPlaying) {
              isPlaying = false;
              clearInterval(intervalId);
              playButton.disabled = false;
          }
      }

      // Eliminar event listeners antiguos para evitar duplicados
      playButton.replaceWith(playButton.cloneNode(true)); 
      const newPlayButton = document.getElementById('play');
      
      newPlayButton.addEventListener('click', () => {
          if (!isPlaying) {
              startPlaying();
          } else {
              stopPlaying();
          }
      });

      rangeInput.addEventListener('input', () => {
          if (isPlaying) {
              stopPlaying();
          }
          updateBackground();
      });

      rangeInput.addEventListener('update', () => {
          showVal(rangeInput.value);
      });

      function updateBackground() {
          const value = (rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min) * 100;
          rangeInput.style.setProperty('--value', `${value}%`);
      }
  }
  
  
  document.addEventListener('DOMContentLoaded', function() {
      const rangeInput = document.getElementById('rangeInput');
	  const options = document.querySelectorAll('#years option');


      rangeInput.addEventListener('input', (event) => {
          const value = event.target.value;
          //console.log(`Valor seleccionado: ${value}`);
		  options.forEach(option => {
		  	option.style.color = '';
		    option.style.fontWeight = '';
		  });
		             
		  const selectedOption = Array.from(options).find(option => option.value === value);
		  if (selectedOption) {
		  	selectedOption.style.color = '#42A5F5';
			selectedOption.style.fontWeight = 'bold'; // Color que prefieras
		  }
		  
          showVal(value);
      });
      
      function updateBackground() {
          const value = (rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min) * 100;
          rangeInput.style.setProperty('--value', `${value}%`);
      }

      rangeInput.addEventListener('input', updateBackground);
      updateBackground(); // Inicializar el fondo al cargar la página
  });


    function showVal(valor){  
      var year = '';
        switch(valor) {
            case '0':  valor = '1990'; year='1990'; break;
            case '10': valor = '1995'; year = '1995'; break;
            case '20': valor = '2000'; year = '2000'; break;
            case '30': valor = '2005'; year = '2005'; break;
            case '40': valor = '2010'; year = '2010'; break;
            case '50': valor = '2015'; year = '2015'; break;
            case '60': valor = '2018'; year = '2018'; break;
            case '70': valor = '2019'; year = '2019'; break;
            case '80': valor = '2020'; year = '2020'; break;
            case '90': valor = '2021'; year = '2021';break;
            case '100': valor = '2022'; year = '2022'; break;
            case '110': valor = '2023'; year = '2023'; break;  
			case '120': valor = '2024'; year = '2024'; break;        
        }
        //console.log(year);
        
        // CAPAS INPIT */ 
          // ESTADOS 
          var mxestados = map.getLayers().getArray().find(layer => layer.get('name') === 'Estados');var fuenteEstados = mxestados.getSource();
          var NPEstados = {'LAYERS': 'HISTORICO:entidad_'+year, 'STYLES': 'estados'}; fuenteEstados.updateParams(NPEstados); fuenteEstados.refresh();

          var estadoset = map.getLayers().getArray().find(layer => layer.get('name') === 'estadoset');var fuenteestadoset = estadoset.getSource();
          var NPEstadoset = {'LAYERS': 'HISTORICO:entidad_'+year, 'STYLES': 'estadoset'}; fuenteestadoset.updateParams(NPEstadoset); fuenteestadoset.refresh();

          // MUNICIPIOS
          var municipios = map.getLayers().getArray().find(layer => layer.get('name') === 'Municipios');var fuenteMunicipios = municipios.getSource();
          var NPMunicipios = {'LAYERS': 'HISTORICO:municipio_'+year}; fuenteMunicipios.updateParams(NPMunicipios); fuenteMunicipios.refresh();

          var municipioset = map.getLayers().getArray().find(layer => layer.get('name') === 'municipioset');var fuenteMunicipioset = municipioset.getSource();
          var NPMunicipioset = {'LAYERS': 'HISTORICO:municipio_'+year}; fuenteMunicipioset.updateParams(NPMunicipioset); fuenteMunicipioset.refresh();

          // AGEB RURAL 
          var agebrural = map.getLayers().getArray().find(layer => layer.get('name') === 'agebrural');var fuenteagebrural = agebrural.getSource();
          var NPagebrural = {'LAYERS': 'HISTORICO:ageb_'+year}; fuenteagebrural.updateParams(NPagebrural); fuenteagebrural.refresh();

          var agebruralset = map.getLayers().getArray().find(layer => layer.get('name') === 'agebruralset');var fuenteagebruralset = agebruralset.getSource();
          var NPagebruralset = {'LAYERS': 'HISTORICO:ageb_'+year}; fuenteagebruralset.updateParams(NPagebruralset); fuenteagebruralset.refresh();

          // Loc Urbana
          var locurbana = map.getLayers().getArray().find(layer => layer.get('name') === 'locurbana');var fuenteLocUrbana = locurbana.getSource();
          var NPLocUrbana = {'LAYERS': 'HISTORICO:l_'+year}; fuenteLocUrbana.updateParams(NPLocUrbana); fuenteLocUrbana.refresh();

          // Paso 2: Crea una nueva fuente para la capa duplicada

          var locurbanatxt = map.getLayers().getArray().find(layer => layer.get('name') === 'locurbanatxt');var fuenteLocUrbanatxt = locurbanatxt.getSource();
          var NPLocUrbanatxt = {'LAYERS': 'HISTORICO:l_'+year}; fuenteLocUrbanatxt.updateParams(NPLocUrbanatxt); fuenteLocUrbanatxt.refresh();

          // AGEB Urbana
          var ageburbana = map.getLayers().getArray().find(layer => layer.get('name') === 'ageburbana');var fuenteageburbana = ageburbana.getSource();
          var NPageburbana = {'LAYERS': 'HISTORICO:agebu_'+year}; fuenteageburbana.updateParams(NPageburbana); fuenteageburbana.refresh();

          var ageburbanatxt = map.getLayers().getArray().find(layer => layer.get('name') === 'ageburbanatxt');var fuenteageburbanatxt = ageburbanatxt.getSource();
          var NPageburbanatxt = {'LAYERS': 'HISTORICO:agebu_'+year}; fuenteageburbanatxt.updateParams(NPageburbanatxt); fuenteageburbanatxt.refresh();

          // Loc Rural
          var locrural = map.getLayers().getArray().find(layer => layer.get('name') === 'locrural');var fuentelocrural = locrural.getSource();
          var NPlocrural = {'LAYERS': 'HISTORICO:l_'+year}; fuentelocrural.updateParams(NPlocrural); fuentelocrural.refresh();

          var locruraltxt = map.getLayers().getArray().find(layer => layer.get('name') === 'locruraltxt');var fuentelocruraltxt = locruraltxt.getSource();
          var NPlocruraltxt = {'LAYERS': 'HISTORICO:l_'+year}; fuentelocruraltxt.updateParams(NPlocruraltxt); fuentelocruraltxt.refresh();

          // Loc Rural Ext
          var locrurext = map.getLayers().getArray().find(layer => layer.get('name') === 'locruralext');var fuentelocruralext = locrurext.getSource();
          var NPlocruralext = {'LAYERS': 'HISTORICO:pe_'+year}; fuentelocruralext.updateParams(NPlocruralext); fuentelocruralext.refresh();

          // Manzana
          var mza = map.getLayers().getArray().find(layer => layer.get('name') === 'mza');var fuentemza = mza.getSource();
          var NPmza = {'LAYERS': 'HISTORICO:manzana_'+year}; fuentemza.updateParams(NPmza); fuentemza.refresh();

          var mzatxt = map.getLayers().getArray().find(layer => layer.get('name') === 'mzatxt');var fuentemzatxt = mzatxt.getSource();
          var NPmzatxt = {'LAYERS': 'HISTORICO:manzana_'+year}; fuentemzatxt.updateParams(NPmzatxt); fuentemzatxt.refresh();

          // Caserio 
          var caserio = map.getLayers().getArray().find(layer => layer.get('name') === 'caserio');var fuentecaserio = caserio.getSource();
          var NPcaserio = {'LAYERS': 'HISTORICO:caserio_'+year}; fuentecaserio.updateParams(NPcaserio); fuentecaserio.refresh();

          // Locs Vig
          var locsvig = map.getLayers().getArray().find(layer => layer.get('name') === 'locsvig');var fuentelocsvig = locsvig.getSource();
          var NPlocsvig = {'LAYERS': 'HISTORICO:lpr_'+year}; fuentelocsvig.updateParams(NPlocsvig); fuentelocsvig.refresh();

          var locsvigtxt = map.getLayers().getArray().find(layer => layer.get('name') === 'locsvigtxt');var fuentelocsvigtxt = locsvigtxt.getSource();
          var NPlocsvigtxt = {'LAYERS': 'HISTORICO:lpr_'+year}; fuentelocsvigtxt.updateParams(NPlocsvigtxt); fuentelocsvigtxt.refresh();

          // ACTUALIZACION
          var ActCorte = map.getLayers().getArray().find(layer => layer.get('name') === 'actualizaciones');var fuenteAct = actlayer.getSource();
          var NPAct = {'LAYERS': 'HISTORICO:nuevo_'+year}; fuenteAct.updateParams(NPAct); fuenteAct.refresh();

          // VIALIDADES
          var vial = map.getLayers().getArray().find(layer => layer.get('name') === 'vialidad');var fuenteVial = vialidad.getSource();
          var NPVial = {'LAYERS': 'HISTORICO:vial_'+year}; fuenteVial.updateParams(NPVial); fuenteVial.refresh();

        //desactivar casillas

          if(year=='1990' || year=='1995' || year=='2005'){
            document.getElementById("agebrural").disabled=true;
            document.getElementById("txtAgebRural").disabled=true;
          } else {
            document.getElementById("agebrural").disabled=false;
            document.getElementById("txtAgebRural").disabled=false;
          }
          if(year=='1990' || year=='1995'){
            document.getElementById("chbxlocrural").disabled=true;
            document.getElementById("chbxtxtlocrural").disabled=true;

            document.getElementById("chbxlocrur_ext").disabled=true;
            document.getElementById("chbxcaserio").disabled=true;
          } else {
            document.getElementById("chbxlocrural").disabled=false;
            document.getElementById("chbxtxtlocrural").disabled=false;
            
            document.getElementById("chbxlocrur_ext").disabled=false;
            document.getElementById("chbxcaserio").disabled=false;
          } 
          if(year=='2018' || year=='2015' || year=='2010' || year=='2005' || year=='2000' || year=='1995' || year=='1990'){
            document.getElementById("btnAct").setAttribute("style", "pointer-events: none;");
            actlayer.setVisible(false);
            localStorage.setItem("ActCB", false);
            document.getElementById('chbxact').checked = false;
          } else {
            document.getElementById("btnAct").setAttribute("style", "pointer-events: auto;"); 

          }
		  //console.log(typeof year);
		  //console.log(year);
		  
		  const yearsDisabled = ['1990', '1995', '2000'];

		  if (yearsDisabled.includes(year)) {
		    document.getElementById("btnVia").style.pointerEvents = "none";
			document.getElementById("btnVia").style.background = "#F5F5F5";
		    vialidad.setVisible(false);
		    localStorage.setItem("ViaCB", false);
		    document.getElementById('chbxvialidades').checked = false;
		  } else {
		    document.getElementById("btnVia").style.pointerEvents = "auto";
			
		  }

		  
          //console.log(year);
         // console.log(typeof(year));
          if(year=='2023' || year=='2021' || year=='2020' || year=='2019' || year=='2018' || year=='2015' || year=='2010' || year=='2005' || year=='2000' || year=='1995' || year=='1990'){
          //  console.log("Otros datos");
            document.getElementById("btnNuExt").setAttribute("style", "pointer-events: none;");
            document.getElementById("txtnuext").disabled = true;
            nu_ext.setVisible(false);
            nu_ext_txt.setVisible(false);
            document.getElementById('txtnuext').checked = false;
            document.getElementById('txtnuext').checked = false;
          } else {
            document.getElementById("btnNuExt").setAttribute("style", "pointer-events: auto;");
            document.getElementById("txtnuext").disabled = false;
          }
    };

  // DESACTIVAR CAPAS SI ES UN AÑO DIFERENTE
    if(localStorage.getItem('corte')!='100'){
      document.getElementById("btnNuExt").setAttribute("style", "pointer-events: none;");
      document.getElementById("txtnuext").disabled = true;
      nu_ext.setVisible(false);
    } else {
      if(localStorage.getItem("NuExtCB")==='true'){
        nu_ext.setVisible(true);
      }
    }

    actYears = ['0','10','20','30','40','50','60'];
    const corteGuardado1 = localStorage.getItem('corte');

    if(actYears.includes(corteGuardado1)){
      document.getElementById("btnAct").setAttribute("style", "pointer-events: none;");
      actlayer.setVisible(false);
    } else {
      if(localStorage.getItem("ActCB")==='true'){
        actlayer.setVisible(true);
      }
    }
    
/* FUNCION DE RETROCESO Y SIGUIENTE */
  // https://openlayers.org/en/latest/examples/permalink.html#map=5.91/-4129023.32/-316922.83/0
  if (window.location.hash !== '') {
    // try to restore center, zoom-level and rotation from the URL
    const hash = window.location.hash.replace('#map=', '');
    const parts = hash.split('/');
    if (parts.length === 4) {
      zoom = parseFloat(parts[0]);
      center = [parseFloat(parts[1]), parseFloat(parts[2])];
      rotation = parseFloat(parts[3]);
    }
  }

  let shouldUpdate = true;
  view = map.getView();
  const updatePermalink = function () {
    if (!shouldUpdate) {
      // do not update the URL when the view was changed in the 'popstate' handler
      shouldUpdate = true;
      return;
    }

    const center = view.getCenter();
    const hash =
      '#map=' +
      view.getZoom().toFixed(2) +
      '/' +
      center[0].toFixed(2) +
      '/' +
      center[1].toFixed(2) +
      '/' +
      view.getRotation();
    const state = {
      zoom: view.getZoom(),
      center: view.getCenter(),
      rotation: view.getRotation(),
    };

    window.history.pushState(state, 'map', hash);
  };

  map.on('moveend', updatePermalink);

  // restore the view state when navigating through the history, see
  // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
  window.addEventListener('popstate', function (event) {
    if (event.state === null) {
      return;
    }
    map.getView().setCenter(event.state.center);
    map.getView().setZoom(event.state.zoom);
    map.getView().setRotation(event.state.rotation);
    shouldUpdate = false;
  });

/* DEMAS FUNCIONES */
  // ajax
    function nuevoAjax()
    {
      /* Crea el objeto AJAX. Esta funcion es generica para cualquier utilidad de este tipo, por
      lo que se puede copiar tal como esta aqui */
      var xmlhttp=false;
      try {
          // Creacion del objeto AJAX para navegadores no IE
          xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");
      }catch(e){
          try {
              // Creacion del objet AJAX para IE
              xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
          }catch(E){
              if (!xmlhttp && typeof XMLHttpRequest!=undefined) xmlhttp=new XMLHttpRequest();
          }
      }return xmlhttp;
    }

  // alert msj
    function alertmsg(msg){
      document.getElementById('msjs').style.display = 'block';
      document.getElementById('textomsg').innerHTML = msg;
    }

  // ocultar header 
    function ocultar_header() {
        //console.log("Ocultar header llamado");
        document.getElementById('header').style.display = 'none';
        document.getElementById('icon_access').style.display = 'none';
        document.getElementById('navmenu').style.display = 'block';
    }

    function mostrar_header() {
       // console.log("Mostrar header llamado");
        document.getElementById('header').style.display = 'block';
        document.getElementById('icon_access').style.display = 'block';
        document.getElementById('navmenu').style.display = 'none'; // Asegúrate de ocultar el menú aquí si es necesario
    }

    document.addEventListener('DOMContentLoaded', function() {
        //console.log("DOM completamente cargado y parseado");
    });

/* BUSQUEDAS */
  /* ANTERIOR 
    var starStyle = new ol.style.Style({
      image: new ol.style.RegularShape({
        fill: new ol.style.Fill({
          color: '#2196F3'
        }),
        points: 5,
        radius: 10,
        radius2: 4,
        stroke: new ol.style.Stroke({
          color: 'white',
          width: 0.5
        })
      })
    });

    // Funciones de busqueda
    function mun(capa, sal1, sal2, sal3, sal4) {
      // ICONO COMO MARCADOR
      var c1 = (parseFloat(sal1) + parseFloat(sal3)) / 2;
      var c2 = (parseFloat(sal2) + parseFloat(sal4)) / 2;

      var markerFeature = new ol.Feature({
        geometry: new ol.geom.Point([c1, c2])
      });
      markerFeature.setStyle(starStyle);

      var markerLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          features: [markerFeature]
        })
      });

      map.addLayer(markerLayer);

      // ZOOM AL MAPA
      // Definir las cuatro coordenadas de la extensión
      var extent = [sal1, sal2, sal3, sal4];

      // Obtener el centro de la extensión
      var center = ol.extent.getCenter(extent);

      // Calcular el nivel de zoom basado en la resolución del mapa en ese nivel
      var zoom = 0;
      var resolution = map.getView().getResolutionForZoom(zoom);
      if (capa == 11) {
       // console.log("capa 11");
        zoom = 19;
        resolution = map.getView().getResolutionForZoom(zoom);
      } else if (capa == 3) {
      //  console.log("capa 3");
        zoom = 11;
        resolution = map.getView().getResolutionForZoom(zoom);
      } else if (capa == 4) {
        zoom = 13;
        resolution = map.getView().getResolutionForZoom(zoom);
      } else if (capa == 7) {
        zoom = 12;
        resolution = map.getView().getResolutionForZoom(zoom);
      }

      // Establecer la vista del mapa en el centro y el nivel de zoom calculados
      map.getView().setCenter(center);
      map.getView().setZoom(zoom);
    }
  */

 	
	// Definir el estilo para las estrellas
	var starStyle = new ol.style.Style({
	    image: new ol.style.RegularShape({
	        fill: new ol.style.Fill({
	            color: '#2196F3'
	        }),
	        points: 5,
	        radius: 10,
	        radius2: 4,
	        stroke: new ol.style.Stroke({
	            color: 'white',
	            width: 0.5
	        })
	    })
	});

	// Crear una capa vectorial global para almacenar todas las estrellas
	var markerLayer = new ol.layer.Vector({
	    source: new ol.source.Vector()
	});

	// Agregar la capa al mapa
	map.addLayer(markerLayer);

	// Función para agregar una estrella y configurar el mapa
	function mun(capa, sal1, sal2, sal3, sal4) {
	    var c1 = (parseFloat(sal1) + parseFloat(sal3)) / 2;
	    var c2 = (parseFloat(sal2) + parseFloat(sal4)) / 2;

	    var markerFeature = new ol.Feature({
	        geometry: new ol.geom.Point([c1, c2])
	    });
	    markerFeature.setStyle(starStyle);

	    // Agregar el marcador a la capa global
	    markerLayer.getSource().addFeature(markerFeature);

	    // Centrar el mapa
	    var center = ol.extent.getCenter([sal1, sal2, sal3, sal4]);
	    map.getView().setCenter(center);
	    
	    // Establecer el nivel de zoom según la capa
	    var zoom = capa == 11 ? 19 : capa == 3 ? 11 : capa == 4 ? 13 : capa == 7 ? 12 : 0;
	    map.getView().setZoom(zoom);
	    
	    // Mostrar el botón de eliminar si se ha agregado al menos una estrella
	    /*var botonEliminar = document.getElementById('delete_buscar');
	    if (botonEliminar) {
	        botonEliminar.style.display = 'block';
	    }*/

	    // Guardar las coordenadas en localStorage
	    var markerCoordinates = JSON.parse(localStorage.getItem('markerCoordinates')) || [];
	    markerCoordinates.push([c1, c2]);
	    localStorage.setItem('markerCoordinates', JSON.stringify(markerCoordinates));
	}

	// Función para eliminar todas las estrellas del mapa
	function eliminarTodasLasEstrellas() {
		//console.log("eliminar puntos");
	    markerLayer.getSource().clear(); // Eliminar todas las características de la capa

	    // Limpiar las coordenadas de localStorage
	    localStorage.removeItem('markerCoordinates');

	    // Ocultar el botón de eliminar
	    /*var botonEliminar = document.getElementById('delete_buscar');
	    if (botonEliminar) {
	        botonEliminar.style.display = 'none';
	    }*/
	}

	// Función para cargar los marcadores desde localStorage al inicializar el mapa
	function loadMarkers() {
	    var markerCoordinates = JSON.parse(localStorage.getItem('markerCoordinates')) || [];

	    markerCoordinates.forEach(function(coords) {
	        var markerFeature = new ol.Feature({
	            geometry: new ol.geom.Point(coords)
	        });
	        markerFeature.setStyle(starStyle);
	        markerLayer.getSource().addFeature(markerFeature);
	    });

	    // Mostrar el botón de eliminar si hay marcadores
	    /*var botonEliminar = document.getElementById('delete_buscar');
	    if (botonEliminar && markerCoordinates.length > 0) {
	        botonEliminar.style.display = 'block';
	    }*/
	}

	// Inicializar el mapa (asumiendo que ya tienes el mapa inicializado en otra parte del código)
	loadMarkers();

	// Asignar la función de eliminar al botón con ID 'delete_buscar'
	//document.getElementById('delete_buscar').onclick = eliminarTodasLasEstrellas;


/* COORDENADAS */
  var pull = map.getView().getProjection().getCode();
  var projLambert = new ol.proj.Projection({
    code: 'ESRI:102005',
    extent: [-1483000, 149000, -736000, 2833000],
    units: 'm'
  });

  proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs');
  proj4.defs('ESRI:102005', '+proj=lcc +lat_1=17.5 +lat_2=29.5 +lat_0=12 +lon_0=-102 +x_0=2500000 +y_0=0 +datum=NAD83 +units=m +no_defs');
  proj4.defs("EPSG:32800", "+proj=tmerc +lat_0=0 +lon_0=-72 +k=0.9996 +x_0=500000 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
  proj4.defs("EPSG:9802", "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=10 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");

  // Sexagesimal
  function decimalToSexagesimal(coordinate) {
    var degrees = Math.floor(Math.abs(coordinate));
    var minutes = Math.floor((Math.abs(coordinate) - degrees) * 60);
    var seconds = ((Math.abs(coordinate) - degrees - minutes / 60) * 3600).toFixed(2);
    var direction = coordinate >= 0 ? 'N' : 'W';
    return degrees + '° ' + minutes + '\' ' + seconds + '" ' + direction;
  }

  var cor = document.getElementById('coords');

  map.on('pointermove', function(event) {
    /// Sexagesimal
    var ll = ol.proj.toLonLat(event.coordinate);
    var lon = decimalToSexagesimal(ll[0]);
    var lat = decimalToSexagesimal(ll[1]);

    /// CCL
    var coordenadas = event.coordinate;
    var coordenadas102005 = proj4('EPSG:3857', 'ESRI:102005', coordenadas);
    var lonccl = coordenadas102005[0].toFixed(6);
    var latccl = coordenadas102005[1].toFixed(6);

    // Mostrar en el div
    cor.innerHTML = lon + ', ' + lat + '  ' + ' --  CCL(' + lonccl + ', ' + latccl +')';
  });

/* FUNCION PARA LOS RESULTADOS DE LA BUSQUEDA */ 
 /* function submitForm() {
      // Crea un objeto FormData a partir del formulario
      const formData = new FormData(document.getElementById('searchForm'));

      // Convierte FormData a una cadena de consulta (query string)
      const queryString = new URLSearchParams(formData).toString();

      // Envía una solicitud GET con los parámetros de consulta
      fetch('Search?' + queryString, {
        method: 'GET'
      })
      .then(response => response.text())
      .then(result => {
        // Guarda el resultado en localStorage
        //localStorage.setItem('searchResults', result);
        // Actualiza el contenido del div
        document.getElementById('resultsContainer').innerHTML = result;
      })
      .catch(error => console.error('Error:', error));
    }
    
  window.addEventListener('load', function() {
      const savedResults = localStorage.getItem('searchResults');
      if (savedResults) {
          const resultsContainer = document.getElementById('resultsContainer');
          if (resultsContainer) {
              resultsContainer.innerHTML = savedResults;
          }
      }
      DeleteAll();
      
      
  });
  */
/* ELIMINAR PUNTO */ 
  function eliminar(){
  //alert("Delete");
    setTimeout(function() {
      location.reload();
  }, 1000);
  }

/* AGREGAR PUNTO */
  /* ANTERIOR 
    function processInput(){
    var inputValue = document.getElementById('campoCor').value;

    // Dividir el valor por la coma
    var values = inputValue.split(',');
    const lon1 = values[0];
    const lat1 = values[1];

    var lon = lon1.replace(/^\s+|\s+$/g, '');
    var lat = lat1.replace(/^\s+|\s+$/g, '');

    function prueba(){
     // console.log("Primer valor ", lon);
    //  console.log("Segundo valor ", lat);

    // Estrella como marcador en el punto
      var starStyle = new ol.style.Style({
        image: new ol.style.RegularShape({
          fill: new ol.style.Fill({
            color: '#2196F3'
          }),
          points: 5,
          radius: 10,
          radius2: 4,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 0.5
          })
        })
      });

      var geometry1 = new ol.geom.Point(ol.proj.fromLonLat([lon_dec, lat_dec]));

      var markerFeature = new ol.Feature({
        geometry: geometry1
      });
      markerFeature.setStyle(starStyle);

      var markerLayer = new ol.layer.Vector({
        name: 'punto',
        source: new ol.source.Vector({
          features: [markerFeature]
        })
      });

      map.addLayer(markerLayer);

      var viewP = new ol.View({
        center: ol.proj.fromLonLat([lon_dec, lat_dec]),
        zoom: 12
      });
      map.setView(viewP);
    }

    if(lat.length==0 || lon.length==0){
      alertmsg("Proporcione coordenadas");
    } 
    var element = document.getElementById('output');
    if((Math.abs(lat)>13 && Math.abs(lat)<34) || (Math.abs(lon)>84 && Math.abs(lon)<120))
    {
      element.innerHTML='DEC';
      lat_dec = parseFloat(lat);
      lon_dec = parseFloat(lon);
      if(lon_dec>0){
        lon_dec=lon_dec*-1;
      }
    } else if((Math.abs(lat)>140000 && Math.abs(lat)<330000 && Math.abs(lon)>860000 && Math.abs(lon)<1190000)){
      element.innerHTML = 'GEO';
      lon=lon.replace("-","");
      var lat_dec=parseFloat(lat.substr(0,2),10)+parseInt(lat.substr(2,2),10)/60+parseFloat(lat.substr(4,lat.length),10)/3600;
      var lon_dec=(parseInt(lon.substr(0,3),10)+parseInt(lon.substr(3,2),10)/60+parseFloat(lon.substr(5,lon.length),10)/3600)*(-1);
    //  console.log("Latitud: " + lat_dec + " Longitud: " + lon_dec);
    }  else {
      element.innerHTML = 'CCL';
      lat_dec = parseFloat(lat);
      lon_dec = parseFloat(lon);
      coordenadasCCL = [lon_dec, lat_dec];
      var coordenadasTransformadas = proj4('ESRI:102005', "EPSG:4326", coordenadasCCL);
      lon_dec = coordenadasTransformadas[0];
      lat_dec = coordenadasTransformadas[1];
    }
    if (parseInt(Math.abs(lat_dec),10)>parseInt(33,10) || parseInt(Math.abs(lat_dec),10)<parseInt(13,10)){
      alertmsg ("Latitud fuera de rango");
      return false;
    }else{
      if (parseInt(Math.abs(lon_dec),10)>parseInt(120,10) || parseInt(Math.abs(lon_dec),10)<parseInt(84,10)){
        alertmsg ("Longitud fuera de rango");
        return false;
      }
    }

    prueba();
    }
  */

  function processInput() {
    // Obtener el valor del campo de texto
    var inputValue = document.getElementById('campoCor').value;

    // Dividir el valor por la coma
    var values = inputValue.split(',');
    const lon1 = values[0];
    const lat1 = values[1];

    var lon = lon1.replace(/^\s+|\s+$/g, '');
    var lat = lat1.replace(/^\s+|\s+$/g, '');

    if (lat.length == 0 || lon.length == 0) {
        alertmsg("Proporcione coordenadas");
        return;
    }

    var element = document.getElementById('output');
    if ((Math.abs(lat) > 13 && Math.abs(lat) < 34) || (Math.abs(lon) > 84 && Math.abs(lon) < 120)) {
        element.innerHTML = 'DEC';
        lat_dec = parseFloat(lat);
        lon_dec = parseFloat(lon);
        if (lon_dec > 0) {
            lon_dec = lon_dec * -1;
        }
    } else if ((Math.abs(lat) > 140000 && Math.abs(lat) < 330000 && Math.abs(lon) > 860000 && Math.abs(lon) < 1190000)) {
        element.innerHTML = 'GEO';
        lon = lon.replace("-", "");
        var lat_dec = parseFloat(lat.substr(0, 2), 10) + parseInt(lat.substr(2, 2), 10) / 60 + parseFloat(lat.substr(4, lat.length), 10) / 3600;
        var lon_dec = (parseInt(lon.substr(0, 3), 10) + parseInt(lon.substr(3, 2), 10) / 60 + parseFloat(lon.substr(5, lon.length), 10) / 3600) * (-1);
    } else {
        element.innerHTML = 'CCL';
        lat_dec = parseFloat(lat);
        lon_dec = parseFloat(lon);
        coordenadasCCL = [lon_dec, lat_dec];
        var coordenadasTransformadas = proj4('ESRI:102005', "EPSG:4326", coordenadasCCL);
        lon_dec = coordenadasTransformadas[0];
        lat_dec = coordenadasTransformadas[1];
    }

    if (parseInt(Math.abs(lat_dec), 10) > parseInt(33, 10) || parseInt(Math.abs(lat_dec), 10) < parseInt(13, 10)) {
        alertmsg("Latitud fuera de rango");
        return false;
    } else {
        if (parseInt(Math.abs(lon_dec), 10) > parseInt(120, 10) || parseInt(Math.abs(lon_dec), 10) < parseInt(84, 10)) {
            alertmsg("Longitud fuera de rango");
            return false;
        }
    }

    // Guardar las coordenadas en localStorage
    var markerCoordinates = JSON.parse(localStorage.getItem('markerCoordinates')) || [];
    markerCoordinates.push([lon_dec, lat_dec]);
    localStorage.setItem('markerCoordinates', JSON.stringify(markerCoordinates));
  
  if (localStorage.getItem('markerCoordinates')) {
        // Mostrar el botón con ID 'delete_buscar'
        var botonEliminar = document.getElementById('delete_buscar');
        if (botonEliminar) {
            botonEliminar.style.display = 'block';
        }
    }
    // Dibujar el punto en el mapa
    drawPointOnMap(lon_dec, lat_dec);
  }

  function drawPointOnMap(lon, lat) {
      var starStyle = new ol.style.Style({
          image: new ol.style.RegularShape({
              fill: new ol.style.Fill({
                  color: '#2196F3'
              }),
              points: 5,
              radius: 10,
              radius2: 4,
              stroke: new ol.style.Stroke({
                  color: 'white',
                  width: 0.5
              })
          })
      });

      var geometry = new ol.geom.Point(ol.proj.fromLonLat([lon, lat]));

      var markerFeature = new ol.Feature({
          geometry: geometry
      });
      markerFeature.setStyle(starStyle);

      var markerLayer = new ol.layer.Vector({
          name: 'punto',
          source: new ol.source.Vector({
              features: [markerFeature]
          })
      });

      map.addLayer(markerLayer);

     var view = new ol.View({
          center: ol.proj.fromLonLat([lon, lat]),
          zoom: 12
      });
      map.setView(view);
  }

  // Función para cargar los puntos guardados en localStorage al cargar la página
  function loadSavedPoints() {
      var markerCoordinates = JSON.parse(localStorage.getItem('markerCoordinates')) || [];
      markerCoordinates.forEach(function(coords) {
          drawPointOnMap(coords[0], coords[1]);
      });
  }

  // Llamar a la función para cargar los puntos guardados al cargar la página
    
  document.addEventListener('DOMContentLoaded', loadSavedPoints);



/* ALTITUD */ 
  /*
    var sour = new ol.source.Vector();
      var vect = new ol.layer.Vector({
        source: sour
      });
      map.addLayer(vect);

      var drawalt = new ol.interaction.Draw({
        source: sour,
        type: 'Point'
      });

    function addalt(){
      map.addInteraction(drawalt); 
      document.getElementById("boxmedir").style.display = 'none';
      document.getElementById("altitudbtn").style.background = "#cfe2ff"; // azul 
      document.getElementById("medir").style.background = "#F5F5F5"; // gris
      document.getElementById("desplazar").style.background = "#F5F5F5"; // gris
      document.getElementById("altitud_canc").style.display = "block";
      document.getElementById("btnCancelarAltitud").style.display = "block";
      document.getElementById("btnInfo").style.background = "#F5F5F5"; // gris

      map.on('click', function (event) {
          const ll = map.getCoordinateFromPixel(event.pixel);
          const transformedLL = ol.proj.transform(ll, 'EPSG:3857', 'EPSG:4326');
          const lon = transformedLL[0];
          const lat = transformedLL[1];
          //console.log("Lon " + lon + " Lat " + lat);

          fetch('obtalt.jsp?x=' + lon + '&y=' + lat)
          .then(function (response) {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error('No se pudo obtener la altura');
            }
          })
          
          .then(function (val) {
            var alt = parseInt(val);
            if (isNaN(alt) || alt == 32767 || alt < -100 || val === '') {
              alt = 0;
            }
            alertmsg("Altitud: " + alt);
          })
        
          .catch(function (error) {
            alertmsg(error.message);
          });
        });
    }

    function removeAltitud(){
      if (drawalt) {
        map.removeInteraction(drawalt);
        drawalt = null;
        document.addEventListener('DOMContentLoaded', function() {
          document.getElementById("btnCancelarAltitud").style.display = "none";
          document.getElementById("msj").style.display = "none";
        });
        setTimeout(function() {
          location.reload();
        }, 1000); // 1000 milisegundos = 1 segundo
        //alert("eliminar");
      } else {
        alert("Ocurrio un error, recarge la pagina y traze nuevamente las lineas");
      }
    }
  */

/* RECARGAR LA PAGINA */
    function reload(){
      event.preventDefault(); // Evita que se actualice la página
          // Muestra la ventana de diálogo Bootstrap
      $('#exampleModal').modal('show');
    }
    

   function yesreload(){
      window.location.href = "ConsultaMapa";
    localStorage.clear();
    }  
  
// poner mxestados encima de dglob2
  //diglob2.setZIndex(-1);
  mxestados.setZIndex(1);

/* MINUTOS DE INACTIVIDAD  */ 
  var tiempoInactividad = 10 * 60 * 1000; // 10 minutos
  var temporizadorInactividad;

  function reiniciarTemporizadorInactividad() {
    clearTimeout(temporizadorInactividad);
    temporizadorInactividad = setTimeout(cerrarSesion, tiempoInactividad);
  }


  function cerrarSesion() {
    window.location.href = "index.jsp"; 
  }


  document.addEventListener("mousemove", reiniciarTemporizadorInactividad);
  document.addEventListener("keypress", reiniciarTemporizadorInactividad);

  reiniciarTemporizadorInactividad();

/* ZOOM ESCALAS */
  var escalas = [
    '14M', '7M', '3M', '2M', // Zoom 5, 6, 7, 8
    '867K', '433K', '217K', '108K', '54K', '27K', '14K', // Zoom 9, 10, 11, 12, 13, 14, 15
    '6771', '3386', '1693', '846', '423', '212' // Zoom 16, 17, 18, 19, 20, 21
  ];

  map.on('moveend', function(event) {
    var zoomLevel = Math.round(map.getView().getZoom()); // Redondea el nivel de zoom
   // console.log('Nivel de zoom actual:', zoomLevel); // Para depuración

    // Verifica que el nivel de zoom esté dentro del rango de escalas definido
    if (zoomLevel >= 5 && zoomLevel <= 21) {
      var index = zoomLevel - 5; // Ajustar el índice al rango de escalas definido
      if (index >= 0 && index < escalas.length) {
        var escala = escalas[index];
        document.getElementById('escala_valor').textContent = 'Escala 1: ' + escala;
      } else {
     //   console.error('Índice fuera de rango para el array de escalas:', index);
      }
    } else {
      document.getElementById('escala_valor').textContent = 'Escala fuera del rango';
    //  console.warn('Nivel de zoom fuera del rango de escalas:', zoomLevel);
    }
  });
  
  //BUSQUEDAS APARECER
  var extent = map.getView().calculateExtent(map.getSize());
    var [c0, c1, c2, c3] = extent;

    document.getElementById('c0').value = c0;
    document.getElementById('c1').value = c1;
    document.getElementById('c2').value = c2;
    document.getElementById('c3').value = c3;
   
   
   function Actualiza_Extent(){
    var extent = map.getView().calculateExtent(map.getSize());
    var [c0, c1, c2, c3] = extent;

    document.getElementById('c0').value = c0;
    document.getElementById('c1').value = c1;
    document.getElementById('c2').value = c2;
    document.getElementById('c3').value = c3;
  	
  };
   
   
   map.getView().on('change:center', function() {
      Actualiza_Extent();
  });


  
  
  if (localStorage.getItem('searchResults')) {
      // Mostrar el botón con ID 'delete_buscar'
      var busquedadiv = document.getElementById('busquedadiv');
      if (busquedadiv) {
            busquedadiv.style.display = 'block';
        const savedResults = localStorage.getItem('searchResults');
        document.getElementById('resultsContainer').innerHTML = savedResults;
      }
    } 
	
	if (localStorage.getItem('searchResultsCorte')) {
	     // Mostrar el botón con ID 'delete_buscar'
	     var busquedadiv = document.getElementById('busquedadivCorte');
	     if (busquedadiv) {
	           busquedadiv.style.display = 'block';
	       const savedResults = localStorage.getItem('searchResultsCorte');
	       document.getElementById('resultsContainerCorte').innerHTML = savedResults;
	     }
	   } 
  
  function MostrarBusqueda(){
      const busqueda = localStorage.getItem('searchResults');
      const busquedadiv = document.getElementById('busquedadiv');
      
      const busquedaCorte = localStorage.getItem('searchResultsCorte');
      const busquedadivCorte = document.getElementById('busquedadivCorte');
      
      const btnMostrar = document.getElementById('btnMostrar');
      const btnX = document.getElementById('btnXs');

      if(busqueda){
        busquedadiv.innerHTML = busqueda;
        busquedadiv.style.display ='block';
        
        btnMostrar.style.display = 'none';
        btnX.style.display = 'none';
      }
      
      if(busquedaCorte){
        busquedadivCorte.innerHTML = busquedaCorte;
        busquedadivCorte.style.display ='block';
            
        btnMostrar.style.display = 'none';
        btnX.style.display = 'none';
      }
    }
    
    function MostrarStreet(){
    alert("street");
    const btnMostrarStreet = document.getElementById('btnStreet');
    btnMostrarStreet.style.display = 'block'

    }
    
    function DeleteAll(){
      const btnMostrar = document.getElementById('btnMostrar');
      const btnX = document.getElementById('btnXs');
      
      btnMostrar.style.display = 'none';
      btnX.style.display = 'none';
      
      localStorage.removeItem('searchResults');
      localStorage.removeItem('searchResultsCorte');
    }
	
	/* BUSCAR BOTON */ 
		document.getElementById("searchForm").addEventListener("submit", function(event) {
		    event.preventDefault(); // Evita que la página se recargue
		    
			const formData = new FormData(document.getElementById('searchForm'));
			// Convierte FormData a una cadena de consulta (query string)
			const queryString = new URLSearchParams(formData).toString();

			// Envía una solicitud GET con los parámetros de consulta
			fetch('Search?' + queryString, {
				method: 'GET'
			})
			.then(response => response.text())
			.then(result => {
				//alert("Envio de datos");
				//console.log("respuesta del servidor: ", result);
				document.getElementById('resultsContainer').innerHTML = result;
				localStorage.setItem('searchResults', result);
			})
			.catch(error => console.error('Error:', error));
		});
		
		
				// CORTE 
				    
				    $(document).ready(function() {
				        $('#searchFormCorte').submit(function(event) {
				        event.preventDefault();
				                  
				        var formData = $(this).serialize();

				                  // Enviar la solicitud AJAX al servlet
				        $.ajax({
				          type: 'GET',
				            url: 'SearchCorte',
				            data: formData,
				            success: function(response) {
				              $('#busquedadivCorte').html(response);
				            },
				            error: function() {
				            alert('Error al enviar la solicitud');
				            }
				            });
				         });  
				       });
				       
				        
				     if (localStorage.getItem('searchResultsCorte')) {
				        // Mostrar el botón con ID 'delete_buscar'
				        var busquedadiv = document.getElementById('busquedadivCorte');
				        if (busquedadiv) {
				              busquedadiv.style.display = 'block';
				        const savedResults = localStorage.getItem('searchResultsCorte');
				        document.getElementById('resultsContainerCorte').innerHTML = savedResults;
				        }
				      } 
				      
				        function submitFormCorte() {
				            // Crea un objeto FormData a partir del formulario
				            const formDataCorte = new FormData(document.getElementById('searchFormCorte'));

				            // Convierte FormData a una cadena de consulta (query string)
				            const queryStringCorte = new URLSearchParams(formDataCorte).toString();

				            // Envía una solicitud GET con los parámetros de consulta
				            fetch('SearchCorte?' + queryStringCorte, {
				              method: 'GET'
				            })
				            .then(response => response.text())
				            .then(result => {
				              // Guarda el resultado en localStorage
				              localStorage.setItem('searchResultsCorte', result);
				              // Actualiza el contenido del div
				              document.getElementById('resultsContainerCorte').innerHTML = result;
				            })
				            .catch(error => console.error('Error:', error));
				          }
				      
				      document.addEventListener('DOMContentLoaded', function() {
				          try {
				              const savedResults = localStorage.getItem('searchResultsCorte');
				              if (savedResults) {
				                  const resultsContainer = document.getElementById('resultsContainerCorte');
				                  if (resultsContainer) {
				                      resultsContainer.innerHTML = savedResults;
				                 //     console.log('Resultados cargados en el contenedor');
				                  } else {
				               //       console.error('No se encontró el contenedor de resultados');
				                  }
				              } else {
				                //  console.log('No se encontraron resultados guardados en localStorage');
				              }
				          } catch (error) {
				              console.error('Error al cargar resultados guardados:', error);
				          }
				      });
    
/* MOUSE COUNTER */
  //console.log("ID:", id);
  //console.log("RegID", regid);
  var mousecount = 0;
  map.on('pointermove', function(event) {
    if (mousecount==0){
            var ajax=nuevoAjax();
            ajax.open("GET",'mousecount.jsp', true);
            ajax.onreadystatechange=function()
            {
                    if(ajax.readyState==4)  {
                        var val=ajax.responseText;
                        if (val==0){
                            cerrarSesion();
                        }else{   //sesion activa
                                    gtag('event', 'mouse', {
                                    'event_category': 'sesion',
                                    'event_label': 'activo',
                                    'value': id
                                    });
                        }
                   }
            }
            ajax.send(null);
                setTimeout(function(){
                        mousecount=0;
            //}, 600000);
            }, 60000);
            mousecount=1;
        }
  });
  




////  CAMBIO DE FUNCIONES EN ACCESO DE ICONOS
/* MEDIR */

  const rastere = new ol.layer.Tile({/*source: new ol.source.OSM()*/});
  const sourcee = new ol.source.Vector();
  const vectore = new ol.layer.Vector({
    source: sourcee,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: '#ffcc33',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    })
  });

  map.addLayer(rastere);
  map.addLayer(vectore);

  let sketch;
  let helpTooltipElement;
  let helpTooltip;
  let measureTooltipElement;
  let measureTooltip;
  const continuePolygonMsg = 'Click to continue drawing the polygon';
  const continueLineMsg = 'Click to continue drawing the line';

  const typeSelect = document.getElementById('type');
  let draw;

  const formatLength = function(line) {
    document.getElementById('msjs').style.display = 'none';
    const length = ol.sphere.getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
  };

  const formatArea = function(polygon) {
    document.getElementById('msjs').style.display = 'none';
    const area = ol.sphere.getArea(polygon);
    let output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    } else {
      output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    }
    return output;
  };

  function addInteraction() {
  
  
    document.getElementById('msjs').style.display = 'none';
    var type = typeSelect.value == 'area' ? 'Polygon' : 'LineString';
    draw = new ol.interaction.Draw({
      source: sourcee,
      type: type,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2,
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
        }),
      }),
    });

    map.addInteraction(draw);
    createMeasureTooltip();
    createHelpTooltip();

    var listener;
    draw.on('drawstart', function (evt) {
      document.getElementById('msjs').style.display = 'none';
      sketch = evt.feature;
      var tooltipCoord = evt.coordinate;

      listener = sketch.getGeometry().on('change', function (evt) {
        document.getElementById('msjs').style.display = 'none';
        var geom = evt.target;
        var output;
        if (geom instanceof ol.geom.Polygon) {
          document.getElementById('msjs').style.display = 'none';
          output = formatArea(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof ol.geom.LineString) {
          document.getElementById('msjs').style.display = 'none';
          output = formatLength(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        measureTooltipElement.innerHTML = output;
        measureTooltip.setPosition(tooltipCoord);
      });
    });

    draw.on('drawend', function () {
      document.getElementById('msjs').style.display = 'none';
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
      measureTooltip.setOffset([0, -7]);
      sketch = null;
      measureTooltipElement = null;
      createMeasureTooltip();
      ol.Observable.unByKey(listener);
    });
  }

  function createHelpTooltip() {
    document.getElementById('msjs').style.display = 'none';
    if (helpTooltipElement) {
      helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'ol-tooltip hidden';
    helpTooltip = new ol.Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left',
    });
    map.addOverlay(helpTooltip);
  }

  function createMeasureTooltip() {
    document.getElementById('msjs').style.display = 'none';
    if (measureTooltipElement) {
      measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false,
    });
    map.addOverlay(measureTooltip);
  }

  typeSelect.onchange = function () {
    map.removeInteraction(draw);
    document.getElementById('msjs').style.display = 'none';
    addInteraction();
  };
  document.getElementById('msjs').style.display = 'none';

  let singleClickListener;

  let medirActivo = false; 
  
  function addmedir(){
	medirActivo = !medirActivo;
	
	if(medirActivo){
		document.getElementById('msjs').style.display = 'none';
		document.getElementById("boxmedir").style.display = 'block';
		document.getElementById("medir").style.background = "#cfe2ff"; // azul 
		document.getElementById("desplazar").style.background = "#F5F5F5"; // gris
		document.getElementById("btnInfo").style.background = "#F5F5F5"; // gris
		document.getElementById("streetViewButton").style.background = "#F5F5F5"; // gris

		overlay.setPosition(undefined);
		  
		if (streetViewClickHandler) {
			map.un('click', streetViewClickHandler);
		    streetViewClickHandler = null;
		}

		if (singleClickListener) {
		   map.un('singleclick', singleClickListener.listener);
		}

		const customCursor = document.querySelector('.custom-cursor');
		if (customCursor) {
		   customCursor.remove();
		}
		      
		document.body.style.cursor = 'default';
		document.getElementById('btnStreet').style.marginTop = '30px';
		    
		addInteraction();
	} else {
		if (singleClickListener) {
		    map.un('singleclick', singleClickListener.listener);
		}
		
		const customCursor = document.querySelector('.custom-cursor');
		if (customCursor) {
			customCursor.remove();
		}
		          
		document.body.style.cursor = 'default';
		// Desactivar la interacción de medición
		if (draw) {
			map.removeInteraction(draw);
		    draw = null;
		    map.removeOverlay(helpTooltip);
		}
		desplazar();
	}
  }  

  function removeInteraction(){
    if (draw) {
      map.removeInteraction(draw);
      draw = null;
      map.removeOverlay(helpTooltip);
      document.getElementById("boxmedir").style.display = "none";
      document.getElementById("btnX").style.display = "none";

      // Reactivar el manejador de clic
      info();
    } else {
      alert("Ocurrio un error, recarge la pagina y traze nuevamente las lineas");
    }
  }

/* POPUP DE LA INFO */ 

  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');

  // Crear el overlay pop-up
  var overlay = new ol.Overlay({
    element: container,
    positioning: 'bottom-center',
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });
  map.addOverlay(overlay);

  // Añadir el evento de clic al botón de cerrar
  closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  let infoActivo = false; 
  
  function info() {
	infoActivo = !infoActivo;
	
	if(infoActivo){
		document.getElementById('msjs').style.display = 'none';
		    document.getElementById("boxmedir").style.display = 'none';
		    document.getElementById("medir").style.background = "#F5F5F5"; // gris
		    document.getElementById("btnInfo").style.background = "#cfe2ff"; // azul
		    document.getElementById("desplazar").style.background = "#F5F5F5"; // gris
		  	document.getElementById("streetViewButton").style.background = "#F5F5F5"; // gris
		  
		  	if (streetViewClickHandler) {
		    	map.un('click', streetViewClickHandler);
		    	streetViewClickHandler = null;
		  	}

		  	if (singleClickListener) {
		    	map.un('singleclick', singleClickListener.listener);
		  	}

		  	const customCursor = document.querySelector('.custom-cursor');
		  	if (customCursor) {
		    	customCursor.remove();
		  	}
		        
		  	document.body.style.cursor = 'default';

		    // Desactivar la interacción de medición
		    if (draw) {
		      map.removeInteraction(draw);
		      draw = null;
		      map.removeOverlay(helpTooltip);
		    }

		    singleClickListener = map.on('singleclick', function(evt) {
		      document.getElementById('msjs').style.display = 'none';
		      var viewResolution = map.getView().getResolution();
		      var projection = map.getView().getProjection();
		      
		      var capas = [mxestados, municipios, agebrural, ageburbana, locurbana, locrur_ext, locrural, mza, caserio];
		      var urls = [];
		      for (var i = 0; i < capas.length; i++) {
		        if (capas[i].getVisible()) {
		          var url = capas[i].getSource().getFeatureInfoUrl(
		            evt.coordinate,
		            viewResolution,
		            projection,
		            {'INFO_FORMAT': 'text/html'}
		          );
		          if (url) {
		            //urls.push(fetch(proxy + encodeURIComponent(url)));
		            //urls.push(fetch(historico.ProxyServlet(encodeURIComponent(url))));
		            const rutaActual = window.location.pathname;
		            const hostActual = window.location.origin;
		            const rutaActualSinConsultaMapa = rutaActual.replace('ConsultaMapa','');
					//console.log(rutaActualSinConsultaMapa); // /mi-ruta
					//alert("rutaActualSinConsultaMapa: " + rutaActualSinConsultaMapa);
					
					//urls.push(fetch(url));
		            const url2 = hostActual +  rutaActualSinConsultaMapa  + 'ProxyServlet?url=' + encodeURIComponent(url)
		            urls.push(fetch(url2));
					//alert("url2: " + url2);
		            
		            
		          }
		        }
		      }

		      Promise.all(urls)
		        
		        .then(function(responses) {
		          return Promise.all(responses.map(function(response) {
		            return response.text();
		            
		          }));
		        })

		        .then(function(htmls) {
		          var html = htmls.join('');
		          const coordinate = evt.coordinate;
		          content.innerHTML = html;
		          container.style.display = 'block'; // Asegurarse de que el contenedor esté visible
		          overlay.setPosition(coordinate);
		        });
		    });	
	} else {
		desplazar();
	}
    
  }

/* DESPLAZAR */ 
  function desplazar(){
    document.getElementById('msjs').style.display = 'none';
    document.getElementById("boxmedir").style.display = 'none';
    document.getElementById("medir").style.background = "#F5F5F5"; // gris
    document.getElementById("btnInfo").style.background = "#F5F5F5"; // gris
    document.getElementById("desplazar").style.background = "#cfe2ff"; // azul
  document.getElementById("streetViewButton").style.background = "#F5F5F5"; // gris
  
  if (streetViewClickHandler) {
    map.un('click', streetViewClickHandler);
    streetViewClickHandler = null;
  }

  if (singleClickListener) {
    map.un('singleclick', singleClickListener.listener);
  }

  const customCursor = document.querySelector('.custom-cursor');
  if (customCursor) {
    customCursor.remove();
  }
          
  document.body.style.cursor = 'default';
  
    // Ocultar el pop-up
    overlay.setPosition(undefined);

    // Desactivar la interacción de medición
    if (draw) {
      map.removeInteraction(draw);
      draw = null;
      map.removeOverlay(helpTooltip);
    }

    // Desactivar el manejador de clic del modo de información
    if (singleClickListener) {
      map.un('singleclick', singleClickListener.listener);
    }
  }
  
/* STREET VIEW */ 
  let currentIconFeature = null;
  let moveCursorHandler = null;
  let streetViewClickHandler = null;

  function addIcon(coords) {
      if (currentIconFeature) {
          vectorSource.removeFeature(currentIconFeature);
      }

      const iconFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat(coords))
      });

      const iconStyle = new ol.style.Style({
          image: new ol.style.Icon({
              anchor: [0.5, 1], 
              src: 'resources/images/monito.png', 
              scale: 0.1 
          })
      });

      iconFeature.setStyle(iconStyle);    
    vectorSource.addFeature(iconFeature);
      currentIconFeature = iconFeature;
  }
  
  let streetViewActivo = false; 

  function streetviewf() { 
	streetViewActivo = !streetViewActivo; 
	
	if(streetViewActivo){
		document.getElementById('msjs').style.display = 'none';
		    document.getElementById("boxmedir").style.display = 'none';
		    document.getElementById("medir").style.background = "#F5F5F5"; // gris
		    document.getElementById("btnInfo").style.background = "#F5F5F5"; // gris
		    document.getElementById("desplazar").style.background = "#F5F5F5"; // gris
		    document.getElementById("streetViewButton").style.background = "#cfe2ff"; // gris
		    
		      document.getElementById('streetview').style.display = 'block';
		      document.getElementById('btnStreet').style.display = 'block';
		    
		    if (draw) {
		      map.removeInteraction(draw);
		      draw = null;
		      map.removeOverlay(helpTooltip);
		    }
		    
		    overlay.setPosition(undefined);

		    // Desactivar el manejador de clic del modo de información
		    if (singleClickListener) {
		      map.un('singleclick', singleClickListener.listener);
		    }
		    
		      streetview.setVisible(true);
		      //document.body.style.cursor = 'none'; // Oculta el cursor predeterminado
		     // addCustomCursor();

		      streetViewClickHandler = function(event) {
		          const ll = map.getCoordinateFromPixel(event.pixel);
		          const transformedLL = ol.proj.transform(ll, 'EPSG:3857', 'EPSG:4326');
		          const lon = transformedLL[0];
		          const lat = transformedLL[1];
		          //console.log("Lon " + lon + " Lat " + lat);

		          const coords1 = ol.proj.toLonLat(event.coordinate);
		          addIcon(coords1);

		          const url = new URL('streetview.jsp', window.location.href);
		          url.searchParams.append('lon', lon);
		          url.searchParams.append('lat', lat);

		          fetch(url.toString())
		              .then(response => response.text())
		              .then(html => {
		                  document.getElementById('streetview').innerHTML = html;
		               })
		               .catch(error => {
		                  console.error('Error al cargar streetview.jsp:', error);
		               });  
		      };
		    map.on('click', streetViewClickHandler);
	} else {
		desplazar();
		delete_streetview();
		document.getElementById('streetview').style.display = 'none';
	}
    
  }

  function addCustomCursor() {
      const cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      cursor.innerHTML = '<i class="fa fa-street-view" aria-hidden="true"></i>';
      document.body.appendChild(cursor);

      moveCursorHandler = (e) => {
          cursor.style.left = e.clientX + 'px';
          cursor.style.top = e.clientY + 'px';
      };
      document.addEventListener('mousemove', moveCursorHandler);
  }

  document.addEventListener('DOMContentLoaded', () => {
      const streetViewButton = document.getElementById('streetViewButton');
      streetViewButton.addEventListener('click', streetviewf);
  });

  function delete_streetview() {
      streetview.setVisible(false);
      
      const cursor = document.querySelector('.custom-cursor');
      if (cursor) {
          cursor.remove();
      }

      if (moveCursorHandler) {
          document.removeEventListener('mousemove', moveCursorHandler);
          moveCursorHandler = null;
      }

      if (currentIconFeature) {
          vectorSource.removeFeature(currentIconFeature);
          currentIconFeature = null; // Reiniciar la variable
      }
    
    if (streetViewClickHandler) {
      map.un('click', streetViewClickHandler);
        streetViewClickHandler = null;
    }
   
    document.getElementById('btnStreet').style.display = 'none';
  }
  
  
/* MENU CONTEXTUAL */
	const contextMenu = document.getElementById('contextmenu'); // Corregido a minúsculas para coincidir con el HTML
	const pasteOption = document.getElementById('pasteOption');
	let textoCopiado = "";
	let ultimaSeleccion = "";
	let isTextSelected = false;
	let clickTarget = null;
	
	// Eliminado el primer event listener duplicado de contextmenu
	
	document.addEventListener('click', function() {
	  contextMenu.style.display = 'none';
	});
	
	
	function removeMeasurements() {
		desplazar();
		  sourcee.clear();
		
		  map.getOverlays().getArray().slice().forEach(function(overlay) {
		    const element = overlay.getElement();
		    if (element && element.className && element.className.includes('ol-tooltip')) {
		      map.removeOverlay(overlay);
		    }
		  });
		
		  if (measureTooltipElement) {
		    if (measureTooltipElement.parentNode) {
		      measureTooltipElement.parentNode.removeChild(measureTooltipElement);
		    }
		    measureTooltipElement = null;
		  }
		
		  if (helpTooltipElement) {
		    if (helpTooltipElement.parentNode) {
		      helpTooltipElement.parentNode.removeChild(helpTooltipElement);
		    }
		    helpTooltipElement = null;
		  }
		
		 // console.log("Mediciones eliminadas");
	}
	
	function removeSearch() {
		  const layersToRemove = [];
		
		  map.getLayers().forEach(function(layer) {
		    if (layer instanceof ol.layer.Vector && layer.get('name') === 'punto') {
		      layersToRemove.push(layer);
		    }
		  });
		
		  layersToRemove.forEach(function(layer) {
		    map.removeLayer(layer);
		  });
		
		//  console.log("Puntos eliminados del mapa.");
		  localStorage.removeItem('markerCoordinates');
		
		  markerLayer.getSource().clear();
	}
	
	// FUNCIONES PARA COPIAR Y PEGAR
	function isTextInput(element) {
	  return (
	    element.tagName === 'TEXTAREA' ||
	    element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'password' || element.type === 'email' || element.type === 'search' || element.type === 'tel' || element.type === 'url') ||
	    element.isContentEditable
	  );
	}
	
	function findTextInputParent(element) {
	  let currentElement = element;
	  for (let i = 0; i < 5 && currentElement; i++) {
	    if (isTextInput(currentElement)) {
	      return currentElement;
	    }
	    currentElement = currentElement.parentElement;
	  }
	  return null;
	}
	
	// Único event listener para el menú contextual
	document.addEventListener('contextmenu', function(e) {
	  e.preventDefault();
	
	  // Buscar si el clic fue en un elemento de texto o cerca de uno
	  clickTarget = findTextInputParent(e.target);
	
	  // Verificar si hay selección de texto
	  isTextSelected = window.getSelection().toString().trim().length > 0;
	
	  // Mostrar opción de pegar solo si hay texto copiado Y estamos en un área donde se puede pegar
	  const canPaste = clickTarget && textoCopiado;
	  pasteOption.style.display = canPaste ? 'block' : 'none';
	
	  // Posicionamiento
	  const x = Math.min(e.pageX, window.innerWidth - contextMenu.offsetWidth);
	  const y = Math.min(e.pageY, window.innerHeight - contextMenu.offsetHeight);
	
	  contextMenu.style.top = `${y}px`;
	  contextMenu.style.left = `${x}px`;
	  contextMenu.style.display = 'block';
	
	  // Guardar última selección si existe
	  ultimaSeleccion = isTextSelected ? window.getSelection().toString().trim() : "";
	});
	
	// Copiar texto
	function copyText() {
	  if (!isTextSelected) {
	    alertmsg("No hay texto seleccionado");
	    return;
	  }
	
	  // Método alternativo compatible con HTTP
	  const textarea = document.createElement('textarea');
	  textarea.value = ultimaSeleccion;
	  textarea.style.position = 'fixed';
	  document.body.appendChild(textarea);
	  textarea.select();
	
	  try {
	    if (document.execCommand('copy')) {
	      textoCopiado = ultimaSeleccion;
	      pasteOption.style.display = 'block';
	      alertmsg("Texto copiado");
	    }
	  } catch (err) {
	    alertmsg("Error al copiar");
	  }
	
	  document.body.removeChild(textarea);
	  contextMenu.style.display = 'none';
	}
	
	// Pegar texto (versión para múltiples inputs)
	function pasteText() {
	  // Si no hay texto para pegar, salir
	  if (!textoCopiado) {
	    alertmsg("No hay texto para pegar");
	    return;
	  }
	
	  // Si no hay un elemento válido donde pegar, salir
	  if (!clickTarget) {
	    alertmsg("No se puede pegar aquí");
	    return;
	  }
	
	  // Enfocar el elemento donde se hizo clic
	  clickTarget.focus();
	
	  if (clickTarget.tagName === 'TEXTAREA' || clickTarget.tagName === 'INPUT') {
	    // Para inputs y textareas
	    const startPos = clickTarget.selectionStart;
	    const endPos = clickTarget.selectionEnd;
	
	    clickTarget.value =
	      clickTarget.value.substring(0, startPos) +
	      textoCopiado +
	      clickTarget.value.substring(endPos);
	
	    // Actualizar posición del cursor
	    clickTarget.selectionStart = clickTarget.selectionEnd = startPos + textoCopiado.length;
	  } else if (clickTarget.isContentEditable) {
	    // Para elementos con contentEditable=true
	    const selection = window.getSelection();
	    if (selection.rangeCount > 0) {
	      const range = selection.getRangeAt(0);
	      range.deleteContents();
	      range.insertNode(document.createTextNode(textoCopiado));
	    }
	  }
	
	  alertmsg("Texto pegado");
	  contextMenu.style.display = 'none';
	}
	
	// Sincronizar con portapapeles nativo
	document.addEventListener('copy', (e) => {
	  const copiedText = window.getSelection().toString().trim();
	  if (copiedText) {
	    textoCopiado = copiedText;
	  }
	});
	
  ///// DEUPRACION 	
  	//console.log('Map size:', map.getSize());
	//console.log('Extent:', map.getView().calculateExtent(map.getSize()));
	