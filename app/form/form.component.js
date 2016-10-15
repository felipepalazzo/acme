/* globals google */
import { Marionette } from '../../vendor/vendor';
import template from './form.template.jst.ejs';
import { SP_COORDINATES } from '../constants';

export default Marionette.View.extend({
  tagName: 'form',
  template: template,
  events: {
    'submit': 'onSubmit',
  },
  addressInputs: [
    'street_number',
    'route',
    'postal_code',
    'sublocality_level_1',
  ],
  onRender() {
    var coordinates = SP_COORDINATES;
    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(coordinates.south, coordinates.west),
      new google.maps.LatLng(coordinates.north, coordinates.east)
    );
    this.autocomplete = new google.maps.places.Autocomplete(
      this.$('#route')[0], { types: ['geocode'], bounds: defaultBounds });
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
  },
  onSubmit: function(evt) {
    evt.preventDefault();
  },
  setInputValue(inputUi, value) {
    this.ui[inputUi].val()
  },
  fillInAddress() {
    var place = this.autocomplete.getPlace();
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (this.addressInputs.includes(addressType)) {
        var val = place.address_components[i].short_name;
        this.$('#' + addressType).val(val);
      }
    }
  },
});
