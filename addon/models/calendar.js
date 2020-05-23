import { merge } from '@ember/polyfills';
import EmberObject, { computed } from '@ember/object';
import range from '../utils/range';
import moment from 'moment';
import TimeSlot from './time-slot';
import Day from './day';
import OccurrenceProxy from './occurrence-proxy';

const indexTypesMap = {
  day: 'days',
  week: 'weeks',
  month: 'months',
};
const isoTypesMap = {
  day: 'Day',
  week: 'isoWeek',
  month: 'Month',
};

export default EmberObject.extend({
  dayEndingTime: null,
  dayStartingTime: null,
  occurrences: null,
  startingDate: null,
  startFromDate: false,
  timeSlotDuration: null,
  occurrencePreview: null,
  type: 'week',
  showAllHours: true,

  indexType: computed('type', function () {
    return indexTypesMap[this.type];
  }),

  isoType: computed('type', function () {
    return isoTypesMap[this.type];
  }),

  isInCurrentPeriod: computed('period', '_currentPeriod', function () {
    return this.period.isSame(this._currentPeriod);
  }),

  hasTimeSlots: computed('type', function () {
    return this.type !== 'month';
  }),

  isMonthView: computed('type', function () {
    return this.type === 'month';
  }),

  isWeekView: computed('type', function () {
    return this.type === 'week';
  }),

  isDayView: computed('type', function () {
    return this.type === 'day';
  }),

  timeSlots: computed(
    'dayStartingTime',
    'dayEndingTime',
    'timeSlotDuration',
    'showAllHours', function () {
      return TimeSlot.buildDay({
        timeZone: this.timeZone,
        startingTime: this.dayStartingTime,
        endingTime: this.dayEndingTime,
        duration: this.timeSlotDuration,
        showAllHours: this.showAllHours
      });
    }),

  days: computed('type', 'period', function () {
    var res = null;
    switch (this.type) {
    case 'day':
      res = Day.buildDay({ calendar: this });
      break;
    case 'week':
      res = Day.buildWeek({ calendar: this });
      break;
    case 'month':
      res = Day.buildMonth({ calendar: this });
      break;

    default:
      break;
    }
    return res;
  }),

  startDate: computed('startingTime', 'isoType', function () {
    return moment(this.startingTime).startOf(this.isoType);
  }),

  endDate: computed('startingTime', 'isoType', function () {
    return moment(this.startingTime).endOf(this.isoType);
  }),

  period: computed('startingTime', 'timeZone', 'isoType', function () {
    return moment(this.startingTime).startOf(this.isoType);
  }),

  _currentPeriod: computed('timeZone', 'isoType', function () {
    return moment().startOf(this.isoType);
  }),

  init() {
    this._super(...arguments);
    if (this.startingTime == null) {
      this.goToToday();
    }
    if (!this.dayNames || !this.dayNames.length) {
      this.generateDayNames();
    }
    this.dayNames = [];
  },

  createOccurrence: function (options) {
    var content = merge({
      endsAt: moment(options.startsAt)
        .add(this.defaultOccurrenceDuration).toDate(),

      title: this.defaultOccurrenceTitle,
      type: this.defaultOccurrenceType
    }, options);

    return OccurrenceProxy.create({
      calendar: this,
      content: EmberObject.create(content)
    });
  },

  changeType: function (type) {
    this.set('type', type);
  },

  navigate(index) {
    const indexType = this.indexType;
    const isoType = this.isoType;
    const date = moment(this.startingTime).add(index, indexType).startOf(isoType);

    if (!this.checkIfDateInPeriod(date)) {
      this.set('startingTime', date);
    }
  },
  navigatePrevious: function () {
    this.navigate(-1);
  },
  navigateNext: function () {
    this.navigate(1);
  },

  goToDay: function (day) {
    this.set('startingTime', moment(day).startOf('day'));
  },
  goToDayView: function (day) {
    this.setProperties({
      startingTime: moment(day).startOf('day'),
      type: 'day'
    });
  },

  goToToday: function () {
    this.set('startingTime', moment().startOf('day'));
  },

  generateDayNames: function () {
    const date = moment().day(1);
    this.set('dayNames', range(0, 7).map(() => {
      const name = date.format(this.get('component.dateFormatOptions.monthContent'));
      date.add(1, 'days');
      return name;
    }));
  },

  checkIfDateInPeriod: function (date) {
    return this.period.isSame(moment(date).startOf(this.isoType));
  }
});
