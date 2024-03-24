const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const fetch = (await import('node-fetch')).default;
    const ical = (await import('ical.js')).default;

    const response = await fetch('https://cloud.magdeburg.jetzt/remote.php/dav/public-calendars/PB4GBHYqXMJjtNX7?export');
    const data = await response.text();

    const jcalData = ical.parse(data);
    const comp = new ical.Component(jcalData);
    const events = comp.getAllSubcomponents('vevent');

    const now = new Date();
    const maxDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now, including time
    let currentEvent = null;
    let futureEvents = [];

    events.forEach(event => {
        const icalEvent = new ical.Event(event);
        const eventStart = icalEvent.startDate.toJSDate();
        const eventEnd = icalEvent.endDate.toJSDate();

        if (icalEvent.isRecurring()) {
            const iterator = icalEvent.iterator();

            let next = iterator.next();
            while (next && next.toJSDate() <= maxDate) {
                const nextStart = next.toJSDate();
                const nextEnd = new Date(nextStart.getTime() + (eventEnd - eventStart));

                if (nextStart <= now && nextEnd > now) {
                    currentEvent = {
                        summary: icalEvent.summary,
                        start: nextStart,
                        end: nextEnd,
                        description: icalEvent.description ? icalEvent.description : 'No description available'
                    };
                } else if (nextStart > now) {
                    futureEvents.push({
                        summary: icalEvent.summary,
                        start: nextStart,
                        end: nextEnd,
                        description: icalEvent.description ? icalEvent.description : 'No description available'
                    });
                }
                next = iterator.next();
            }
        } else {
            if (eventStart <= now && eventEnd > now) {
                currentEvent = {
                    summary: icalEvent.summary,
                    start: eventStart,
                    end: eventEnd,
                    description: icalEvent.description ? icalEvent.description : 'No description available'
                };
            } else if (eventStart > now) {
                futureEvents.push({
                    summary: icalEvent.summary,
                    start: eventStart,
                    end: eventEnd,
                    description: icalEvent.description ? icalEvent.description : 'No description available'
                });
            }
        }
    });

    // Sort the future events by start date
    futureEvents.sort((a, b) => a.start - b.start);

    res.send({currentEvent, futureEvents})
})

module.exports = router