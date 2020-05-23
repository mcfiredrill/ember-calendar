import { A } from '@ember/array';
import { oneWay } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
import _ from 'lodash';
import moment from 'moment';
import range from '../utils/range';

var Day = EmberObject.extend({
  calendar: null,
  offset: 0,
  isInPeriod: true,
  shortListLimit: 2,

  value: computed('_period', 'offset', function () {
    return moment(this._period).clone().add(this.offset, 'day');
  }),

  occurrences: computed(
    'calendar.occurrences.@each.startingTime',
    'startingTime',
    'endingTime', function () {
      return this.get('calendar.occurrences').filter((occurrence) => {
        const startingTime = occurrence.get('startingTime');
        const endingTime = this.endingTime.subtract(1, 'minutes');

        return startingTime >= this.startingTime &&
          startingTime <= endingTime;
      });
  }),

  shortOccurencesList: computed('occurrences', function () { // get first 3 occurences for month view
    return this.occurrences.slice(0, this.shortListLimit);
  }),

  showMoreCount: computed('occurrences', function () { // get first 3 occurences for month view
    const length = this.get('occurrences.length');
    const limit = this.shortListLimit;
    return length > limit ? length - limit : 0;
  }),

  hasShowMore: computed('showMoreCount', function () { // get first 3 occurences for month view
    return !!this.showMoreCount;
  }),

  occurrencePreview: computed(
    'calendar.occurrencePreview.startingTime',
    'startingTime',
    'endingTime', function() {
    var occurrencePreview = this.get('calendar.occurrencePreview');

    if (occurrencePreview != null) {
      var startingTime = occurrencePreview.get('startingTime');

      if (startingTime >= this.startingTime &&
          startingTime <= this.endingTime) {
        return occurrencePreview;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }),

  startingTime: computed(
    'value',
    '_timeSlots.firstObject.time', function () {
    return moment(this.value).clone().startOf('day')
      .add(this.get('_timeSlots.firstObject.time'));
  }),

  endingTime: computed(
    'value',
    '_timeSlots.lastObject.endingTime', function() {
    return moment(this.value).clone().startOf('day')
      .add(this.get('_timeSlots.lastObject.endingTime'));
  }),

  isToday: computed('value', function() {
    return this.value.isSame(moment(), 'day');
  }),

  _week: oneWay('calendar.week'),
  _timeSlots: oneWay('calendar.timeSlots'),
  isOutOfPeriod: computed('isInPeriod', function() {
    return !this.isInPeriod;
  }),

  _period: oneWay('calendar.period'),
});

Day.reopenClass({
  buildWeek: function(options) {
    return A(_.range(0, 7).map(function(dayOffset) {
      return Day.create({
        calendar: options.calendar,
        offset: dayOffset
      });
    }));
  },
  buildDay: function(options) {
    return A([Day.create({
      calendar: options.calendar,
      offset: 0
    })
    ]);
  },
  buildMonth: function (options) {
    const maxDaysNumber = 42;
    const calendarStartDate = options.calendar.get('startDate');
    const firstDate = calendarStartDate.isAfter(calendarStartDate.clone().startOf('isoWeek')) ?
                calendarStartDate.clone().startOf('isoWeek') :
      calendarStartDate.clone().startOf('isoWeek').subtract(7, "days");
    const firstDateDifference = firstDate.date() - firstDate.daysInMonth() - 1;

    return A(range(firstDateDifference, maxDaysNumber + firstDateDifference).map(function(dayOffset) {
      return Day.create({
        calendar: options.calendar,
        offset: dayOffset,
        isInPeriod: (dayOffset >= 0) && (dayOffset < (calendarStartDate.daysInMonth()))
      });
    }));
  }
});

export default Day;
