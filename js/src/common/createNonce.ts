import getNonce from './getNonce';

// The following is required for style-loader to add the nonce attribute
// correctly to the cookie banner style element
// It must appear exactly as below (no var, let or const)
// @ts-ignore
// eslint-disable-next-line camelcase, no-undef, no-underscore-dangle
__webpack_nonce__ = getNonce();
