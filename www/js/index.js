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
        map = L.map('mapid').setView([position.coords.latitude, position.coords.longitude], 15);
        
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
        var x = 0;
        var xhr;
        //sendRequest
        xhr = new XMLHttpRequest();
        //todo encodage
        //var value1 = encodeURIComponent(value1),
        //var value2 = encodeURIComponent(value2);
        //this.sendRequest();
        xhr.open('GET', 'https://data.metromobilite.fr/api/lines/json?types=ligne&codes=SEM_C1');
        xhr.send(null);
        // end sendRequest

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
        xhr.addEventListener('readystatechange', function(){
            if (xhr.readyState === 4){
                //alert('xhr.readyState'+xhr.readyState);
                //alert('fichier recu');
                response = JSON.parse(xhr.responseText);
                //alert('response geo test'+response.features["0"].geometry.coordinates);
                for(elem of response.features["0"].geometry.coordinates["0"] ){
                    //alert ('elem x = '+elem[0]);
                    //alert ('elem y = '+elem[1]);
                    //marker = L.marker(elem).addTo(map);
                    if (x%10 === 0){
                        //markers = L.marker([elem[1],elem[0]], {icon: checkPointIcon}).addTo(map);

                        //option 2
                        var circle = L.circle([elem[1],elem[0]], {
                        color: 'red',
                        fillColor: '#f03',
                        fillOpacity: 1,
                        radius: 50
        }).addTo(map);
                    }
                    x++;
                }
                var myStyle = {
                    "color": "#ff7800",
                    "weight": 10,
                    "opacity": 1
                };
                var myLayer = L.geoJSON(response,{
                    style: myStyle}).addTo(map);
            }
        });
    },
    
    // onError Callback receives a PositionError object
    //
    onError: function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    },
    onMapReady: function(position){
        var element = document.getElementById('geolocation');

    },
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
        var map;
        var response;
        var marker;
        var markers;
        //this.sendRequest();
        var watchID = navigator.geolocation.watchPosition(this.onSuccess, this.onError, { timeout: 10000,enableHighAccuracy: true});
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
    
};

app.initialize();