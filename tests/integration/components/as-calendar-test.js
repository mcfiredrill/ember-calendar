import { find, findAll, render, click } from '@ember/test-helpers';
import { run } from '@ember/runloop';
import $ from 'jquery';
import { A } from '@ember/array';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import moment from 'moment';
import testSelector from 'ember-test-selectors';

import {
  timeSlotHeight,
  selectTime,
  resizeOccurrence,
  dragOccurrence,
  selectNextWeek,
  selectPreviousWeek
} from 'ember-calendar/test-helpers/all';

module('AsCalendarComponent', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);

    this.set('occurrences', A());

    this.actions.calendarAddOccurrence = (occurrence) => {
      this.occurrences.pushObject(occurrence);
    };

    this.actions.calendarRemoveOccurrence = (occurrence) => {
      this.occurrences.removeObject(occurrence);
    };

    this.actions.calendarUpdateOccurrence = (occurrence, properties) => {
      occurrence.setProperties(properties);
    };
  });

  test('Add an occurrence', async function(assert) {
    await render(hbs`
      {{as-calendar
        title="Ember Calendar"
        occurrences=occurrences
        dayStartingTime="9:00"
        dayEndingTime="18:00"
        timeSlotDuration="00:30"
        onAddOccurrence=(action "calendarAddOccurrence")
        onUpdateOccurrence=(action "calendarUpdateOccurrence")
        onRemoveOccurrence=(action "calendarRemoveOccurrence")}}
    `);

    assert.dom('.as-calendar-occurrence').doesNotExist('it shows an empty calendar');

    selectTime({ day: 0, timeSlot: 0 });

    assert.dom('.as-calendar-occurrence').exists({ count: 1 }, 'it adds the occurrence to the calendar');
    assert.ok(this.get('occurrences.firstObject').startsAt instanceof Date, 'startsAt is a Date');
    assert.ok(this.get('occurrences.firstObject').endsAt instanceof Date, 'endsAt is a Date');
  });

  test('Remove an occurrence', async function(assert) {
    await render(hbs`
      {{as-calendar
        title="Ember Calendar"
        occurrences=occurrences
        dayStartingTime="9:00"
        dayEndingTime="18:00"
        timeSlotDuration="00:30"
        onAddOccurrence=(action "calendarAddOccurrence")
        onUpdateOccurrence=(action "calendarUpdateOccurrence")
        onRemoveOccurrence=(action "calendarRemoveOccurrence")}}
    `);

    selectTime({ day: 0, timeSlot: 0 });

    assert.dom('.as-calendar-occurrence').exists({ count: 1 }, 'it adds the occurrence to the calendar');

    run(() => {
      click('.as-calendar-occurrence .as-calendar-occurrence__remove');
    });

    assert.dom('.as-calendar-occurrence').doesNotExist('it removes the occurrence from the calendar');
  });


  test('Resize an occurrence', async function(assert) {
    await render(hbs`
      {{as-calendar
        title="Ember Calendar"
        occurrences=occurrences
        dayStartingTime="9:00"
        dayEndingTime="18:00"
        timeSlotDuration="00:30"
        defaultOccurrenceDuration="00:30"
        onAddOccurrence=(action "calendarAddOccurrence")
        onUpdateOccurrence=(action "calendarUpdateOccurrence")
        onRemoveOccurrence=(action "calendarRemoveOccurrence")}}
    `);

    selectTime({ day: 0, timeSlot: 0 });

    assert.dom('.as-calendar-occurrence').exists({ count: 1 }, 'it adds the occurrence to the calendar');

    resizeOccurrence(find('.as-calendar-occurrence'), { timeSlots: 2 });

    assert.equal(find('.as-calendar-occurrence').offsetHeight, timeSlotHeight() * 3,
      'it resizes the occurrence');
  });

  test('Drag an occurrence', async function(assert) {
    await render(hbs`
      {{as-calendar
        title="Ember Calendar"
        occurrences=occurrences
        dayStartingTime="9:00"
        dayEndingTime="18:00"
        timeSlotDuration="00:30"
        onAddOccurrence=(action "calendarAddOccurrence")
        onUpdateOccurrence=(action "calendarUpdateOccurrence")
        onRemoveOccurrence=(action "calendarRemoveOccurrence")}}
    `);

    selectTime({ day: 0, timeSlot: 0 });

    assert.dom('.as-calendar-occurrence').exists({ count: 1 }, 'it adds the occurrence to the calendar');
    let inMonday = find(testSelector('day-id', '0')).find('.as-calendar-occurrence').length === 1;
    assert.ok(inMonday);

    dragOccurrence(find('.as-calendar-occurrence'), { days: 2, timeSlots: 4 });

    let inWednesday = find(testSelector('day-id', '2')).find('.as-calendar-occurrence').length === 1;
    assert.ok(inWednesday);
  });

  test('Change week', async function(assert) {

    var weekIndex = 0;

    this.actions.navigateWeek = (index) => {
      weekIndex += index;
    };

    await render(hbs`
      {{as-calendar
        title="Ember Calendar"
        occurrences=occurrences
        onRemoveOccurrence=(action "calendarRemoveOccurrence")
        onNavigateWeek=(action "navigateWeek")}}
    `);

    selectNextWeek();

    assert.equal(weekIndex, 1, 'it navigates to the next week');

    selectPreviousWeek();

    assert.equal(weekIndex, 0, 'it navigates back to the current week');
  });

  test('Displays week of specified day', async function(assert) {
    await render(hbs`
      {{as-calendar
        title="Ember Calendar"
        occurrences=occurrences
        startingDate="2017-06-08"}}
    `);

    assert.dom(find('.as-calendar-timetable__column-item:first-child')).hasText('Mon 5 Jun');
  });

  test('Week starts from specified day', async function(assert) {
    await render(hbs`
      {{as-calendar
        title="Ember Calendar"
        occurrences=occurrences
        startingDate="2017-06-08"
        startFromDate=true}}
    `);

    assert.dom(find('.as-calendar-timetable__column-item:first-child')).hasText('Thu 8 Jun');
  });

  test('Week starts from today', async function(assert) {
    await render(hbs`
      {{as-calendar
        title="Ember Calendar"
        occurrences=occurrences
        startFromDate=true}}
    `);

    const today = moment().format('ddd D MMM');
    assert.dom(find('.as-calendar-timetable__column-item:first-child')).hasText(today);
  });
});
