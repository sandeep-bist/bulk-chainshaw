const axios = require('axios');



 const makeApiCallWithRetry=async(
    url,data,headers,method="POST",maxRetries = 3,retryDelay = 1000) =>{
        

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log("Trying API calling:-",attempt)
    try {
        if (method=="POST"){
            const response = await axios.post(url,data, { headers });
            return response.data;

        }
        else if(method=="PUT"){
            const response = await axios.put(url);
            return response.data;
        }
        else{
            const response = await axios.get(url);
            return response.data;
        }
    } catch (error) {
      // Check if the error is retriable (e.g., 4xx or 5xx)
      const isRetriableError = error.response && (error.response.status>= 400);

      if (isRetriableError && attempt < maxRetries) {
        console.log(`Retrying after ${retryDelay} milliseconds (attempt ${attempt}/${maxRetries})`);
        await wait(retryDelay);
      } else {
        // If the error is not retriable or max retries reached, rethrow the error
        throw error;
      }
    }
  }
}


// Helper function to wait for a specified duration
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// Example usage
// const apiUrl = 'https://example.com/api/data';
// makeApiCallWithRetry(apiUrl,method)
//   .then(data => {
//     console.log('API call successful:', data);
//   })
//   .catch(error => {
//     console.error('API call failed:', error.message);
//   });

module.exports=makeApiCallWithRetry;