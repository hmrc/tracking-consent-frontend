/* istanbul ignore file */
const post = (url: string, data: {}) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);

  // The following line is needed to send the deviceId stored in mdtpdi
  // It will throw an error in IE10 if performed before the open() method
  // See: https://xhr.spec.whatwg.org/#the-withcredentials-attribute
  xhr.withCredentials = true;

  xhr.setRequestHeader('Csrf-Token', 'nocheck');
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(data));
};

export default post;
