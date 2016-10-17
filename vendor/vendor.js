import _ from  'underscore';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import BackboneValidation from 'backbone-validation';
_.extend(Backbone.Model.prototype, BackboneValidation.mixin);
export {_, Backbone, BackboneValidation, Marionette};
