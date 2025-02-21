import '@testing-library/jest-dom';
import getNonce from '../../src/common/getNonce';

describe('getNonce', () => {
  beforeEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = `
    <html>
        <head>
            <script nonce="abcdefg" src="/bundle.js"></script>
        </head>
        <body>
        </body>
    </html> 
    `;
  });

  it('should return the nonce value', () => {
    const nonce = getNonce();

    expect(nonce).toEqual('abcdefg');
  });

  it('should return undefined if no nonce value exists', () => {
    document.getElementsByTagName('html')[0].innerHTML = `
    <html>
        <head>
        </head>
        <body>
        </body>
    </html> 
    `;

    const nonce = getNonce();

    expect(nonce).toEqual(undefined);
  });
});
