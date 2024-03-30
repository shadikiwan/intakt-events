exports.handler = async function(event, context) {
    // Dynamically import 'node-fetch'
    let fetch;
    try {
      fetch = (await import('node-fetch')).default;
    } catch (error) {
      console.error('Failed to import node-fetch:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to import node-fetch' })
      };
    }
  
    // Assuming 'ical.js' is compatible or adjust for your parser library
    let ical;
    try {
      ical = await import('ical.js'); // Adjust based on actual usage and compatibility
    } catch (error) {
      console.error('Failed to import ical.js:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to import ical.js' })
      };
    }
  
    const url = 'https://cloud.magdeburg.jetzt/remote.php/dav/public-calendars/PB4GBHYqXMJjtNX7?export';
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch calendar data: ${response.statusText}`);
      }
      const data = await response.text();
  
      // Parse iCalendar data - Adapt this part based on the parsing library you're using
      const jcalData = ical.parse(data);
      const comp = new ical.Component(jcalData);
      const events = comp.getAllSubcomponents('vevent');
  
      const now = new Date();
      let currentEvent = null;
      let futureEvents = [];
  
      events.forEach(event => {
        const icalEvent = new ical.Event(event);
        const eventStart = icalEvent.startDate.toJSDate();
        const eventEnd = icalEvent.endDate.toJSDate();
  
        if (eventStart <= now && eventEnd > now) {
          currentEvent = {
            summary: icalEvent.summary,
            start: eventStart.toISOString(),
            end: eventEnd.toISOString(),
            description: icalEvent.description || 'No description available',
          };
        } else if (eventStart > now) {
          futureEvents.push({
            summary: icalEvent.summary,
            start: eventStart.toISOString(),
            end: eventEnd.toISOString(),
            description: icalEvent.description || 'No description available',
          });
        }
      });
  
      // Sort future events by start date
      futureEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
  
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentEvent, futureEvents })
      };
    } catch (error) {
      console.error('Error fetching or parsing calendar data:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error processing calendar data' })
      };
    }
  };
  