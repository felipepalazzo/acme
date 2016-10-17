/* globals google */
import { Marionette, BackboneValidation } from '../../vendor/vendor';
import template from './form.template.jst.ejs';
import { SP_COORDINATES } from '../constants';

export default Marionette.View.extend({
  template: template,
  className: 'container-fluid form-container',
  ui: {
    'route': '[data-ui="route"]',
    'phone': '[data-ui="phone"]',
    'alert': '[data-ui="alert"]',
    'close': '[data-ui="close"]',
  },
  modelEvents: {
    'validated:invalid': 'showErrorMsg',
    'validated:valid': 'removeErrorMsg',
  },
  events: {
    'submit': 'onSubmit',
    'click @ui.close': 'removeErrorMsg',
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
    this.initAutoComplete();
    this.initPhoneMask();
  },
  initAutoComplete() {
    var coordinates = SP_COORDINATES;
    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(coordinates.south, coordinates.west),
      new google.maps.LatLng(coordinates.north, coordinates.east)
    );
    this.autocomplete = new google.maps.places.Autocomplete(
      this.ui.route[0], { types: ['geocode'], bounds: defaultBounds, componentRestrictions: { country: 'br' } });
    this.autocomplete.addListener('place_changed', () => {
      this.fillInAddress();
    });
  },
  initPhoneMask() {
    $.fn.mask.call(this.ui.phone, '(99) 9999-9999');
  },
  onSubmit(evt) {
    evt.preventDefault();
    var formValues = $(evt.target).serializeObject();
    this.model.set(formValues);
    if (this.model.isValid(true)) {
      this.model.set('formatted_address', this.place.formatted_address);
      this.triggerMethod('submit:form', this.model);
    }
  },
  showErrorMsg() {
    this.ui.alert.removeClass('hidden');
  },
  removeErrorMsg() {
    this.ui.alert.addClass('hidden');
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
