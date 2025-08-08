// const express = require('express');
// const axios = require('axios');
// const router = express.Router();
// require('dotenv').config();

// // GET location by latitude and longitude
// router.get('/get-location', async (req, res) => {
//   const { lat, lon } = req.query;
//   const apiKey = process.env.LOCATIONIQ_API_KEY;

//   if (!lat || !lon) {
//     return res.status(400).json({ error: 'Latitude and longitude are required' });
//   }

//   try {
//     const response = await axios.get('https://us1.locationiq.com/v1/reverse.php', {
//       params: {
//         key: apiKey,
//         lat,
//         lon,
//         format: 'json'
//       }
//     });

//     const address = response.data.display_name;
//     console.log(response.data);
//     res.status(200).json({ location: address });

//   } catch (error) {
//     console.error('LocationIQ API Error:', error.message);
//     res.status(500).json({ error: 'Failed to get location' });
//   }
// });

// module.exports = router;



const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

// GET location by latitude and longitude
router.get('/get-location', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.LOCATIONIQ_API_KEY;

  // Validate input
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const response = await axios.get('https://us1.locationiq.com/v1/reverse.php', {
      params: {
        key: apiKey,
        lat,
        lon,
        format: 'json'
      }
    });

    const { city, town, village, state, country } = response.data.address;

    // fallback: some locations return 'town' or 'village' instead of 'city'
    const resolvedCity = city || town || village || '';
    const address = `${resolvedCity}, ${state || ''}, ${country || ''}`.replace(/, ,/g, ',').trim();

    res.status(200).json({ location: address });

  } catch (error) {
    console.error('LocationIQ API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to get location',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;
