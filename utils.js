const axios = require('axios');
const RAPIDAPI_KEY = "8a33d6cd94msh9624d30cddacf05p1a37b2jsnd28e067ee976"
const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com"

const headers = {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  }


async function submitCode(data){
    const submission = {
        language_id: data.language_id,
        source_code: data.source_code,
        stdin: data.stdin
    }
    const response = await axios.post(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`, submission, {headers});
    return response.data
}


module.exports = {
    submitCode
}