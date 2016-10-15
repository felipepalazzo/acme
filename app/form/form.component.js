/* globals google */
import { Marionette, BackboneValidation } from '../../vendor/vendor';
import template from './form.template.jst.ejs';
import { SP_COORDINATES } from '../constants';

export default Marionette.View.extend({
  template: template,
  ui: {
    'button': '[data-ui="button"]',
    'route': '[data-ui="route"]',
  },
  events: {
    'submit': 'onSubmit',
  },
  addressInputs: [
    'street_number',
    'route',
    'postal_code',
    'sublocality_level_1',
  ],
  initialize() {
    BackboneValidation.bind(this);
  },
  onRender() {
    var coordinates = SP_COORDINATES;
    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(coordinates.south, coordinates.west),
      new google.maps.LatLng(coordinates.north, coordinates.east)
    );
    this.autocomplete = new google.maps.places.Autocomplete(
      this.ui.route[0], { types: ['geocode'], bounds: defaultBounds, componentRestrictions: { country: 'br' } });
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
  },
  onSubmit(evt) {
    evt.preventDefault();
  },
  fillInAddress() {
    this.place = this.autocomplete.getPlace();
    for (var i = 0; i < this.place.address_components.length; i++) {
      var addressType = this.place.address_components[i].types[0];
      if (this.addressInputs.includes(addressType)) {
        var val = this.place.address_components[i].short_name;
        this.$('#' + addressType).val(val);
      }
    }
  },
});
