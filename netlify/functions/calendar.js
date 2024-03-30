// For Node 14.x runtime in Netlify, sticking with CommonJS syntax
const fetch = require('node-fetch');
const ical = require('ical.js');

exports.handler = async function(event, context) {
  const url = 'https://cloud.magdeburg.jetzt/remote.php/dav/public-calendars/PB4GBHYqXMJjtNX7?export';

  try {
    const response = await fetch(url);
    const data = await response.text();
    
    // Parse iCalendar data
    const jcalData = ical.parse(data);
    const comp = new ical.Component(jcalData);
    const events = comp.getAllSubcomponents('vevent');

    const now = new Date();
    const maxDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now
    let currentEvent = null;
    let futureEvents = [];

    events.forEach(event => {
      const icalEvent = new ical.Event(event);
      const eventStart = icalEvent.startDate.toJSDate();
      const eventEnd = icalEvent.endDate.toJSDate();

      if (icalEvent.isRecurring()) {
        // Handling for recurring events would need to be implemented similar to your existing logic
      } else {
        if (eventStart <= now && eventEnd > now) {
          currentEvent = {
            summary: icalEvent.summary,
            start: eventStart,
            end: eventEnd,
            description: icalEvent.description || 'No description available'
          };
        } else if (eventStart > now) {
          futureEvents.push({
            summary: icalEvent.summary,
            start: eventStart,
            end: eventEnd,
            description: icalEvent.description || 'No description available'
          });
        }
      }
    });

    // Sort future events by start date
    futureEvents.sort((a, b) => a.start - b.start);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({currentEvent, futureEvents})
    };
  } catch (error) {
    console.error('Error fetching or parsing calendar data:', error);
    return {
      statusCode: 500,
      body: 'Internal server error'
    };
  }
};
