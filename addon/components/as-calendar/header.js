import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [':as-calendar-header'],
  tagName: 'header',

  isInCurrentWeek: oneWay('model.isInCurrentPeriod'),
  model: null,
  title: '',

  actions: {
    navigateNext: function () {
      this.model.navigateNext();

      if (this.onNavigate) {
        this.onNavigate({
          view: this.get('model.type'),
          start: this.get('model.startDate'),
          end: this.get('model.endDate'),
          dir: 1
        });
      }
    },
    navigatePrevious: function() {
      this.model.navigatePrevious();

      if (this.onNavigate) {
        this.onNavigate({
          view: this.get('model.type'),
          start: this.get('model.startDate'),
          end: this.get('model.endDate'),
          dir: -1
        });
      }
    },

    changeType: function (type) {
      if (this.onTypeChange) {
        this.onTypeChange(type);
      }
    },

    goToToday: function() {
      this.model.goToToday();
    }
  }
});
