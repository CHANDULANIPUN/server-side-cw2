const axios = require('axios');

// Funtion to get country by name
exports.getCountryByname = async (req, res) => {
    const {name} = req.params; // Get the country name from the request parameters
    console.log('Received name parameter:', name); // Debugging log

    if(!name){
        return res.status(400).json({error: 'Country name is required'}); // Return error if name is not provided
    }

    try{
        const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`); // Fetch country data from API
        const country = response.data[0]; // Get the first country from the response
        const countryInfo = {
            name: country.name.common,
            capital: country.capital ? country.capital[0] : 'No capital available',
            currencies: country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A',
            languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
            flag: country.flags.svg
        }; // Extract relevant information from the country data
        res.json(countryInfo); // Return the extracted country information
        } catch (error) {
            console.error('Error fetching country data:', error); // Debugging log
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ error: `Country not found: ${name}` }); // Return 404 if country is not found
            }
            return res.status(500).json({ error: 'Internal server error' }); // Return 500 for other errors

    }
}