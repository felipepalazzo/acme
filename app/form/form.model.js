import { Backbone } from '../../vendor/vendor';

export default Backbone.Model.extend({
  validation: {
    name: {
      required: true,
      msg: 'Campo obrigatório',
    },
    email: {
      required: true,
      pattern: 'email',
      msg: 'Favor fornecer e-mail válido',
    },
    route: {
      required: true,
      msg: 'Campo obrigatório',
    },
    street_number: {
      required: true,
      msg: 'Campo obrigatório',
    }
  },
});
