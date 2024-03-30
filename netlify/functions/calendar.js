const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const url = 'https://cloud.magdeburg.jetzt/remote.php/dav/public-calendars/PB4GBHYqXMJjtNX7?export';
  
  try {
    const response = await fetch(url);
    const data = await response.text();
    
    return {
      statusCode: 200,
      body: data
    };
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return {
      statusCode: 500,
      body: 'Error fetching calendar data'
    };
  }
};