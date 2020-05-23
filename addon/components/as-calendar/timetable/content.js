import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  classNameBindings: [':as-calendar-timetable__content'],
  attributeBindings: ['_style:style'],

  days: oneWay('model.days'),
  model: null,
  timeSlotDuration: oneWay('model.timeSlotDuration'),
  timeSlots: oneWay('model.timeSlots'),
  timetable: null,

  timeSlotStyle: computed('timeSlotHeight', function() {
    return htmlSafe(`height: ${this.timeSlotHeight}px`);
  }),

  dayWidth: computed(function() {
    if (this._wasInserted) {
      return this.element.offsetWidth / this.get('days.length');
    } else {
      return 0;
    }
  }).volatile(),

  _wasInserted: false,

  _style: computed(
  'model.isMonthView',
  'timeSlotHeight',
  'timeSlots.length', function() {
      return htmlSafe(`height: ${this.get('model.isMonthView') ? '600px' : this.get('timeSlots.length') * this.timeSlotHeight}px;`);
  }),

  didInsertElement() {
    this.set('_wasInserted', true);
  },

  init() {
    this._super(...arguments);
    this.set('timetable.contentComponent', this);
  },

  click(event) {
    var offset = this.element.getBoundingClientRect();
    var offsetX = event.pageX - Math.floor(offset.left);
    var offsetY = event.pageY - Math.floor(offset.top);

    var dayIndex = Math.floor(offsetX / this.dayWidth);
    var timeSlotIndex = Math.floor(offsetY / this.timeSlotHeight);
    var day = this.days.objectAt(dayIndex);

    var timeSlot = this.timeSlots.objectAt(timeSlotIndex);

    this.onSelectTime(
      moment(day.get('value')).add(timeSlot.get('time'))
    );
  },

  actions: {
    goTo: function (day) {
      if (this.onNavigateToDay) {
        this.onNavigateToDay(day);
      }
    }
  }
});
