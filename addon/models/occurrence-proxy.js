import { oneWay } from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
import Ember from 'ember';
import moment from 'moment';
import computedMoment from 'ember-calendar/macros/computed-moment';
import Day from './day';

var OccurrenceProxy = EmberObject.extend(Ember.Copyable, {
  calendar: null,
  content: null,
  endingTime: computedMoment('content.endsAt'),
  startingTime: computedMoment('content.startsAt'),
  title: oneWay('content.title'),
  type: oneWay('content.type'),

  duration: computed('startingTime', 'endingTime', function() {
    return moment.duration(
      this.endingTime.diff(this.startingTime)
    );
  }),

  day: computed('startingTime', 'calendar', 'calendar.{startingTime,startFromDate}', function() {
    return Day.create({
      calendar: this.calendar,
      offset: this.startingTime.diff(this.get('calendar.startDate'), 'days')
    });
  }),

  copy: function() {
    return OccurrenceProxy.create({
      calendar: this.calendar,

      content: EmberObject.create({
        startsAt: this.get('content.startsAt'),
        endsAt: this.get('content.endsAt'),
        title: this.get('content.title'),
        type: this.get('content.type'),
      })
    });
  }
});

export default OccurrenceProxy;
