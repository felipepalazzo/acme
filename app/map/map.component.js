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
  createMap() {
    this.map = new google.maps.Map(this.el, {
      zoom: 3,
      center: {lat: 41.85, lng: -87.65}
    });
  },
  onChangePlace() {

  },
});
