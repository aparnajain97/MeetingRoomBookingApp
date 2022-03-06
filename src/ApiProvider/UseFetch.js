/**
 * Makes api call to specified url
 * @param {*} url 
 * @param {*} method 
 * @param {*} headers 
 * @param {*} body 
 * @returns 
 */
const useFetch = async (url, method, headers, body) => {
  const response = await fetch(url, { method, headers, body});
  if (!response.ok) {
    throw new Error({message: 'Error fetching data', response});
  }
  return response.json(); 
}

export default useFetch;
