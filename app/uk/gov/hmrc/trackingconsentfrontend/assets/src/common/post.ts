/* istanbul ignore file */
const post = (url: string, data: {}) => {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true; // needed to send the deviceId stored in mdtpdi
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Csrf-Token', 'nocheck');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));
};

export default post;
