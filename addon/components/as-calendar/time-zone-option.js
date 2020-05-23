import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [':as-calendar-time-zone-option', 'isSelected:selected'],

  description: oneWay('option.description'),
  option: null,
  selectedOption: null,

  isSelected: computed(
    'selectedOption.value',
    'option.value', function() {
      return this.get('selectedOption.value') === this.get('option.value');
  }),

  click() {
    this.onSelect(this.get('option.value'));
  }
});
