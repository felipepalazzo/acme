/* globals google */
import { Marionette } from '../../vendor/vendor';
import { ACME_COORDINATES, API_KEY } from '../constants';

export default Marionette.View.extend({
  template: false,
  className: 'map',
  modelEvents: {
    'change:formatted_address': 'onChangeFormattedAddress',
    'change:location': 'onChangeLocation',
  },
  onRender() {
    this.createMap();
    this.drawCircle();
  },
  initialize() {
    this.coords = ACME_COORDINATES;
    this.latLng = new google.maps.LatLng({ lat: this.coords.lat, lng: this.coords.lng });
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.defaultOpts = {
      zoom: 15,
      maxDistance: 4000,
    };
  },
  createMap() {
    this.map = new google.maps.Map(this.el, {
      zoom: this.defaultOpts.zoom,
      center: { lat: this.coords.lat, lng: this.coords.lng }
    });
    this.directionsDisplay.setMap(this.map);
  },
  drawCircle() {
    this.circle = new google.maps.Circle({
      map: this.map,
      radius: this.defaultOpts.maxDistance,
      center: this.latLng,
      fillColor: 'red',
      strokeColor: 'orange',
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
      .done(function(response) {
        if (response.error_message) {
          console.log(response.error_message);
        } else {
          this.model.set('location', response.results[0].geometry.location);
        }
      }.bind(this));
  },
  isWithinTheCircle(latLng) {
    var latLngObj = new google.maps.LatLng({ lat: latLng.lat, lng: latLng.lng });
    return google.maps.geometry.spherical.computeDistanceBetween(latLngObj, this.latLng) <= this.defaultOpts.maxDistance;
  },
  onChangeLocation() {
    if (this.isWithinTheCircle(this.model.get('location'))) {
      console.log('inside location');
    } else {
      console.log('out location');
    }
  },
});
