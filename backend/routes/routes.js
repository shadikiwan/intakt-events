const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const fetch = (await import('node-fetch')).default;
    const ical = (await import('ical.js')).default;

    const response = await fetch('https://cloud.magdeburg.jetzt/remote.php/dav/public-calendars/PB4GBHYqXMJjtNX7?export');
    const data = await response.text();

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
            const iterator = icalEvent.iterator();
            let next;
            while ((next = iterator.next()) && next.toJSDate() <= maxDate) {
                const nextStart = next.toJSDate();
                const nextEnd = new Date(nextStart.getTime() + (eventEnd - eventStart));
                if (nextStart <= now && nextEnd > now) {
                    currentEvent = {
                        summary: icalEvent.summary,
                        start: nextStart,
                        end: nextEnd,
                        description: icalEvent.description || 'No description available'
                    };
                } else if (nextStart > now && nextStart <= maxDate) {
                    futureEvents.push({
                        summary: icalEvent.summary,
                        start: nextStart,
                        end: nextEnd,
                        description: icalEvent.description || 'No description available'
                    });
                }
            }
        } else {
            if (eventStart <= now && eventEnd > now) {
                currentEvent = {
                    summary: icalEvent.summary,
                    start: eventStart,
                    end: eventEnd,
                    description: icalEvent.description || 'No description available'
                };
            } else if (eventStart > now && eventStart <= maxDate) {
                futureEvents.push({
                    summary: icalEvent.summary,
                    start: eventStart,
                    end: eventEnd,
                    description: icalEvent.description || 'No description available'
                });
            }
        }
    });

    // Sort the future events by start date
    futureEvents = futureEvents.filter(event => event.start <= maxDate);
    futureEvents.sort((a, b) => a.start - b.start);

    res.send({ currentEvent, futureEvents });
});

module.exports = router;
