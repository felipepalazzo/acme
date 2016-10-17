/* globals google */
import { Backbone, Marionette } from '../../vendor/vendor';
import { ACME_COORDINATES, API_KEY } from '../constants';
import template from './map.template.jst.ejs';
import CardView from '../card/card.component';

export default Marionette.View.extend({
  template: template,
  className: 'map-wrap full-height',
  modelEvents: {
    'change:formatted_address': 'onChangeFormattedAddress',
    'change:location': 'onChangeLocation',
  },
  ui: {
    mapEl: '[data-ui="map"]',
  },
  regions: {
    cardRegion: '[data-region="card"]',
  },
  onRender() {
    this.createMap();
    this.drawCircle();
  },
  initialize() {
    var coords = ACME_COORDINATES;
    this.latLng = new google.maps.LatLng({ lat: coords.lat, lng: coords.lng });
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.defaultOpts = {
      zoom: 14,
      maxDistanceInMeters: 4000,
      opacity: .5,
    };
  },
  createMap() {
    this.map = new google.maps.Map(this.ui.mapEl[0], {
      zoom: this.defaultOpts.zoom,
      center: this.latLng,
    });
  },
  setZoom(number) {
    this.map.setZoom(number);
  },
  drawCircle() {
    this.circle = new google.maps.Circle({
      map: this.map,
      radius: this.defaultOpts.maxDistanceInMeters,
      center: this.latLng,
      fillColor: 'red',
      fillOpacity: 0,
      strokeColor: '#c11111',
      strokeOpacity: 0,
    });
  },
  showCircle() {
    this.circle.setOptions({
      fillOpacity: this.defaultOpts.opacity,
      strokeOpacity: this.defaultOpts.opacity
    });
  },
  hideCircle() {
    this.circle.setOptions({
      fillOpacity: 0,
      strokeOpacity: 0
    });
  },
  onChangeFormattedAddress() {
    this.setAddressCoordinates();
  },
  getAddress() {
    return this.model.get('formatted_address');
  },
  getAddressCoordinates() {
    return $.get('https://maps.googleapis.com/maps/api/geocode/json?&address=' + this.getAddress() + '&key=' + API_KEY);
  },
  setAddressCoordinates() {
    var deferred = this.getAddressCoordinates();
    deferred
      .fail(function() {
        console.error('Oops! geocode went wrong');
      })
      .done((response) => {
        if (response.error_message) {
          console.log(response.error_message);
        } else {
          var location = response.results[0].geometry.location;
          var latLng = new google.maps.LatLng({ lat: location.lat, lng: location.lng });
          this.model.set('location', latLng);
        }
      });
  },
  showDirections() {
    this.directionsDisplay.setMap(this.map);
    this.directionsService.route({
      origin: this.latLng,
      destination: this.model.get('location'),
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        var duration = response.routes[0].legs[0].duration.text;
        this.showDuration('Tempo de entrega:', duration);
        this.directionsDisplay.setDirections(response);
      } else {
        console.error('Directions request failed due to ' + status);
      }
    });
  },
  hideDirections() {
    this.directionsDisplay.setMap(null);
  },
  showDuration(text, duration) {
    this.showChildView('cardRegion', new CardView({
      model: new Backbone.Model({ text: text, duration: duration })
    }));
  },
  isWithinTheCircle() {
    return google.maps.geometry.spherical.computeDistanceBetween(this.model.get('location'), this.latLng) <= this.defaultOpts.maxDistanceInMeters;
  },
  onChangeLocation() {
    if (this.isWithinTheCircle()) {
      this.hideCircle();
      this.showDirections();
    } else {
      this.showDuration('Entregas apenas na área destacada');
      this.showCircle();
      this.setZoom(this.defaultOpts.zoom - 1);
      this.hideDirections();
    }
  },
});
