import {Marionette} from '../vendor/vendor';
import FormView from './form/form.component';

export default Marionette.Application.extend({
  region: '#app',

  initialize() {
    this.on('start', () => {
      this.showView(new FormView());
    })
  }
});
