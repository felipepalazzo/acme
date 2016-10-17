import { Marionette } from '../../vendor/vendor';
import template from './card.template.jst.ejs';

export default Marionette.View.extend({
  template: template,
  className: 'card panel panel-default',
});
