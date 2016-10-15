import { Backbone, Marionette } from '../../vendor/vendor';
import template from './root.template.jst.ejs';
import FormModel from '../form/form.model';
import FormView from '../form/form.component';
import MapView from '../map/map.component';

export default Marionette.View.extend({
  template: template,
  className: 'full-height',
  regions: {
    sideBarRegion: '[data-region="side-bar"]',
    mapRegion: '[data-region="map"]',
  },
  childViewEvents: {
    'submit:form': 'onSubmitForm',
  },
  onRender() {
    this.showSideBar();
    this.showMap();
  },
  showSideBar(model) {
    var form = new FormModel();
    this.showChildView('sideBarRegion', new FormView({ model: form }));
  },
  showMap(model) {
    this.map = new Backbone.Model();
    this.showChildView('mapRegion', new MapView({ model: this.map }));
  },
  onSubmitForm(childModel) {
    this.map.set('place', childModel.get('place'));
  },
});
