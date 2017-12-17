/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.

    // onSuccess Callback
    //   This method accepts a `Position` object, which contains
    //   the current GPS coordinates
    onSuccess: function(position) {
        var element = document.getElementById('geolocation');
        map = L.map('mapid').setView([position.coords.latitude, position.coords.longitude], 13);
        
        console.log('Latitude: '          + position.coords.latitude          +'\n' +
                    'Longitude: '         + position.coords.longitude         + '\n');
        
        alert('Latitude: '                + position.coords.latitude          +'\n' +
                    'Longitude: '         + position.coords.longitude         + '\n');

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.satellite',
            accessToken: config.accessToken
        }).addTo(map);

        marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
        var xhr;
        var xhr2;
        var token;
        var itineraire;
        /*
        //sendRequest
        xhr = new XMLHttpRequest();
        //todo encodage
        //var value1 = encodeURIComponent(value1),
        //var value2 = encodeURIComponent(value2);
        //this.sendRequest();
        xhr.open('GET', 'https://data.metromobilite.fr/api/lines/json?types=ligne&codes=SEM_C1',false);
        xhr.send(null);
        if(xhr.readyState == 4){
            itineraire = xhr.responseText;
            //alert("itineraire"+itineraire);
            console.log(itineraire);
        }
        // end sendRequest
        */

        //lien back end

        var data = {};
        //POST INTINARIES
        var localaddress = config.localaddress;
        //var url = "http://localhost:8080/microservice2/api/itineraries";
        var url = "http://"+localaddress+":8080"+"/microservice2/api/itineraries";
        itineraire = [{
            "type": "Feature",
            "geometry": {
            "type": "LineString",
            "coordinates": [[5.721275,45.191165],[5.723553,45.187768],[5.726448,45.17798],[5.72656,45.168026],
                            [5.721275,45.151165],[5.723553,45.147768]]
        }
    }];
        var itineraire2 = JSON.stringify(itineraire);
        data = {
            geojson: itineraire2,
            id: null,
            raceid: 10
          }
        var json = JSON.stringify(data);
        xhr2 = new XMLHttpRequest();
        xhr2.open("PUT", url,false);//synchronus
        xhr2.setRequestHeader('Content-type','application/json; charset=utf-8');
        //recuperer sur le gateway curl exemple api
        token = config.microservice2token;
        xhr2.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr2.send(json);
        if (xhr2.readyState === 4){
            //alert("PUT ITINERAIRE");
            console.log("put itineraire");
        }
        // GET Itinaries from our website
        xhr = new XMLHttpRequest();
        //var url = "http://localhost:8080/microservice2/api/itineraries/5";
        var url = "http://"+localaddress+":8080"+"/microservice2/api/itineraries/10";
        xhr.open("GET", url,false);//synchronus
        xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.send(null);
        if (xhr.readyState === 4){
            //alert('GET itinaries')
            console.log("get itinaries");
            itineraire = JSON.parse(xhr.responseText);
            itineraire = JSON.parse(itineraire.geojson);
        }
        //option 1
        /*

        var checkPointIcon = L.icon({
            iconUrl: '/img/LogoMesCourses.png',
            //shadowUrl: '',
            iconSize:     [38, 95], // size of the icon
            //shadowSize:   [50, 64], // size of the shadow
            //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            //shadowAnchor: [4, 62],  // the same for the shadow
            //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        */
        var checkpointCircle =[];
        var idCheckpoint = 0;
        var popup = L.popup();
        var tpsEstime = [10,20,30];
        function onCircleClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the checkpoint tps estime : "+tpsEstime[0])
                .openOn(map);
        }
        //xhr.addEventListener('readystatechange', function(){
            if (xhr.readyState === 4){
                //alert('xhr.readyState'+xhr.readyState);
                //alert('fichier recu');
                response = JSON.parse(xhr.responseText);
                //alert('response geo test'+response.features["0"].geometry.coordinates);
                //alert('response geo test'+itineraire[0].geometry.coordinates);
                //for(elem of response.features["0"].geometry.coordinates["0"] ){
                for(elem of itineraire[0].geometry.coordinates ){
                    //alert(x+" tour de boucle / checkpoint" + idCheckpoint )
                    //alert ('elem x = '+elem[0]);
                    //alert ('elem y = '+elem[1]);
                    //marker = L.marker(elem).addTo(map);

                    //option 2
                    checkpointCircle[idCheckpoint] = L.circle([elem[1],elem[0]], {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 1,
                    radius: 50
                    }).addTo(map);
                    checkpointCircle[idCheckpoint].on('click', onCircleClick);
                    idCheckpoint++;
                }
                var myStyle = {
                    "color": "#ff7800",
                    "weight": 2,
                    "opacity": 1
                };
                var myLayer = L.geoJSON(itineraire,{
                    style: myStyle}).addTo(map);
            }

        //})
        ;
    },
    // onError Callback receives a PositionError object
    //
    onError: function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    },
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
        var map;
        var response;
        var marker;
        var watchID = navigator.geolocation.watchPosition(this.onSuccess, this.onError, { timeout: 10000,enableHighAccuracy: true});
    },
};
app.initialize();