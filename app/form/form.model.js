import { Backbone } from '../../vendor/vendor';

export default Backbone.Model.extend({
  validation: {
    name: {
      required: true,
    },
    email: {
      required: true,
      pattern: 'email',
    },
    route: {
      required: true,
    },
    street_number: {
      required: true,
    }
  },
});
