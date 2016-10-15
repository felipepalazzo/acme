/* globals google */
import { Marionette } from '../../vendor/vendor';

export default Marionette.View.extend({
  template: false,
  className: 'map',
  modelEvents: {
    'change:place': 'onChangePlace',
  },
  onRender() {
    this.createMap();
  },
  initialize() {
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
  },
  createMap() {
    this.map = new google.maps.Map(this.el, {
      zoom: 15,
      center: { lat: -23.585816, lng: -46.682626 }
    });
    this.directionsDisplay.setMap(this.map);
  },
  onChangePlace() {

  },
  calculateAndDisplayRoute() {
    // this.directionsService.route({
    // origin: ,
    // destination: ,
    // travelMode: 'DRIVING'
  // });
  },
});
