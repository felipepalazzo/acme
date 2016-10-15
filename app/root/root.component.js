import { Marionette } from '../../vendor/vendor';
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
  onRender() {
    var formModel = new FormModel();
    this.showSideBar(formModel);
    this.showMap(formModel);
  },
  showSideBar(model) {
    this.showChildView('sideBarRegion', new FormView({ model: model }));
  },
  showMap(model) {
    this.showChildView('mapRegion', new MapView({ model: model }));
  },
});
