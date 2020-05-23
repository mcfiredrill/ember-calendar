import { A } from '@ember/array';
import EmberObject, { computed } from '@ember/object';
import moment from 'moment';

var TimeSlot = EmberObject.extend({
  duration: null,
  time: null,
  isActive: false,

  endingTime: computed('time', 'duration', function() {
    return moment.duration(this.time).add(this.duration);
  }),

  day: computed(function() {
    return moment().startOf('day');
  }),

  value: computed('day', 'time', function() {
    return moment(this.day).add(this.time);
  }),

  endingValue: computed('day', 'endingTime', function() {
    return moment(this.day).add(this.endingTime);
  }),

  isInRange: function(startingTime, endingTime) {
    var value = this.value;
    var day = this.day;

    return value >= moment(day).add(startingTime) &&
           this.endingValue <= moment(day).add(endingTime);
  },

  next: function() {
    var duration = this.duration;
    var momentTime = this.momentTime.clone().add(duration);

    return TimeSlot.create({
      time: moment.duration(this.time).add(duration),
      momentTime: momentTime,
      timeLabel: momentTime.format('HH:mm'),
      duration: duration
    });
  }
});

TimeSlot.reopenClass({
  buildDay: function(options) {
    var timeSlots = A();
    var durationStart = options.showAllHours ? moment.duration(0) : options.startingTime;
    var durationEnd = options.showAllHours ? moment.duration(1, 'day') : options.endingTime;
    var startOfDay = moment().startOf('day').add(durationStart);

    var currentTimeSlot = this.create({
      time: durationStart,
      momentTime: startOfDay.clone().add(options.duration),
      timeLabel: startOfDay.clone().add(options.duration).format('HH:mm'),
      duration: options.duration,
      isActive: durationStart.valueOf() === options.startingTime.valueOf()
    });

    while (currentTimeSlot.isInRange(
      durationStart,
      durationEnd
    )) {
      timeSlots.pushObject(currentTimeSlot);
      currentTimeSlot = currentTimeSlot.next();
      currentTimeSlot.isActive = currentTimeSlot.isInRange(
        options.startingTime,
        options.endingTime
      );
    }

    return timeSlots;
  }
});

export default TimeSlot;
