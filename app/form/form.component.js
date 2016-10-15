/* globals google */
import {Marionette} from '../../vendor/vendor';
import template from './form.template.jst.ejs';

export default Marionette.View.extend({
  tagName: 'form',
  template: template,
  ui: {
    route: '[data-ui="route"]',
  },
  events: {
    'submit': 'onSubmit',
  },
  COORDINATES: {
    // The results are biased towards, but not restricted to,
    // places contained within these bounds (São Paulo)
    north: -23.356604,
    south: -24.008221,
    east: -46.365084,
    west: -46.825514,
  },
  componentForm: {
    street_number: 'short_name',
    route: 'long_name',
    postal_code: 'short_name',
  },
  onRender() {
    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(this.COORDINATES.south, this.COORDINATES.west),
      new google.maps.LatLng(this.COORDINATES.north, this.COORDINATES.east)
    );
    this.autocomplete = new google.maps.places.Autocomplete(
      this.$('#route')[0], { types: ['geocode'], bounds: defaultBounds });
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
  },
  onSubmit: function(evt) {
    evt.preventDefault();
  },
  fillInAddress() {
    var place = this.autocomplete.getPlace();
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (this.componentForm[addressType]) {
        var val = place.address_components[i][this.componentForm[addressType]];
        this.$('#' + addressType).val(val);
      }
    }
  },
});
