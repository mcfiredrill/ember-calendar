import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import computedDuration from 'ember-calendar/macros/computed-duration';

export default Component.extend({
  attributeBindings: ['_style:style'],
  classNameBindings: [':as-calendar-occurrence', 'type'],
  tagName: 'article',

  model: null,
  timeSlotDuration: null,
  timeSlotHeight: null,
  isMonthView: false,
  title: oneWay('model.title'),
  content: oneWay('model.content'),
  day: oneWay('model.day'),
  type: oneWay('model.content.type'),
  computedTimeSlotDuration: computedDuration('timeSlotDuration'),

  titleStyle: computed('timeSlotHeight', function() {
    return htmlSafe(`line-height: ${this.timeSlotHeight}px;`);
  }),

  _duration: oneWay('model.duration'),
  _startingTime: oneWay('model.startingTime'),
  _dayStartingTime: oneWay('day.startingTime'),

  _occupiedTimeSlots: computed(
    'isMonthView',
    '_duration',
    'computedTimeSlotDuration', function () {
      return this.isMonthView ? 1 : this._duration.as('ms') /
             this.computedTimeSlotDuration.as('ms');
  }),

  _height: computed('_occupiedTimeSlots', function() {
    return this.timeSlotHeight * this._occupiedTimeSlots;
  }),

  _top: computed(
    '_startingTime',
    '_dayStartingTime',
    'computedTimeSlotDuration',
    'timeSlotHeight', function () {
    return (this._startingTime.diff(this._dayStartingTime) /
            this.computedTimeSlotDuration.as('ms')) *
            this.timeSlotHeight;
  }),

  _style: computed('_height', '_top', function() {
    return htmlSafe(`top: ${this._top}px;
            height: ${this._height}px;`);
  }),

  click(event) {
    event.stopPropagation();
  },
});
