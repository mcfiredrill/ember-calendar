import Component from '@ember/component';
import ComponentCalendar from 'ember-calendar/models/component-calendar';

export default Component.extend({
  classNameBindings: [':as-calendar'],
  tagName: 'section',

  dateFormatOptions: null,
  dayEndingTime: '22:00',
  dayStartingTime: '8:00',
  defaultOccurrenceDuration: '1:00',
  defaultOccurrenceTitle: 'New event',
  defaultOccurrenceType: '',
  isEditing: true,
  model: null,
  monthTimeSlotHeight: 20,
  nowTimeLabelFormat: 'h:mm',
  occurrences: null,
  showHeader: true,
  startingDate: null,
  startFromDate: null,
  timeSlotDuration: '00:30',
  timeSlotLabelFormat: 'h a',
  timeSlotHeight: 20,
  title: null,
  type: 'week',

  init() {
    this._super(...arguments);
    // merge dateFormatDefaults defaults with anything that's passed in

    const dateFormatDefaults = {
      dayHeader: 'MMMM DD, YYYY',
      dayContent: 'dddd',
      weekHeaderStart: 'ddd D MMM',
      weekHeaderEnd: 'ddd D MMM, YYYY',
      weekContent: 'ddd D',
      monthHeader: 'MMMM YYYY',
      monthContent: 'ddd'
    };
    this.set('dateFormatOptions', Object.assign(dateFormatDefaults, this.dateFormatOptions));

    this.set('model', ComponentCalendar.create({ component: this }));
  },

  actions: {
    addOccurrence: function (time) {
      if (this.get('model.isMonthView')) { return false; }

      var occurrence = this.model.createOccurrence({
        startsAt: time.toDate()
      });

      this.onAddOccurrence(occurrence.get('content'));
    },

    onNavigate: function(index) {
      if (this.onNavigate) {
        this.onNavigate(index);
      }
    },

    navigateToDay: function (day) {
      this.model.goToDayView(day);
    },

    changeType: function (type) {
      this.model.changeType(type);

      if (this.onTypeChange) {
        this.onTypeChange(type);
      }
    }
  }
});
