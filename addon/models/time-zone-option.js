import EmberObject, { computed } from '@ember/object';
import moment from 'moment';

export default EmberObject.extend({
  value: null,

  description: computed('value', function() {
    return `${this._title}
            (${this._offset}
            ${this.abbreviation})`;
  }),

  abbreviation: computed('value', function() {
    return moment().tz(this.value).format('z');
  }),

  _title: computed('value', function() {
    return this.value.replace('_', ' ');
  }),

  _offset: computed('value', function() {
    return moment().tz(this.value).format('Z');
  })
});
