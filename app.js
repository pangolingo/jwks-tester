
// enable debug mode
// process.env.DEBUG = 'jwks';
const { promisify } = require('util');
const jwksClient = require('jwks-rsa');

// const jwksClientPromises = Object.entries(jwksClient).map(([key, v]) => ({key, fn: promisify(v)}))
//                          .reduce((o, p) => Object.assign(o, {[p.key]: p.fn}), {});


const client = jwksClient({
  cache: true,
  strictSsl: true, // Default value
  // jwksUri: 'https://loginservices.verizonwireless.com/vccservices/am/ccid/rest/v1/jwk/jwks',
  jwksUri: 'https://pre.xcid.t-mobile.com/jwks/v1/certs',
  requestHeaders: {}, // Optional
  requestAgentOptions: {} // Optional
});

getSigningKeysAsync = promisify(client.getSigningKeys);
getSigningKeyAsync = promisify(client.getSigningKey);

const doIt = async () => {
  let signingKeys;
  try {
    signingKeys = await getSigningKeysAsync.call(client);
    console.log('signing keys:')
    console.log(signingKeys);
  } catch (e) {
    console.error(e);
    return;
  }

  // if(signingKeys.length > 0){
  //   signingKeys.forEach(async (key) => {
  //     const foundKey = await getSigningKeyAsync.call(client, key.kid);
  //     console.log('found key')
  //     console.log(foundKey)
  //   });
  // }
}

doIt().catch(console.error);


// client.getSigningKeys((err, keys) => {
//   if (err){
//     console.error(err);
//     return
//   }
//   console.log('signing keys:')
//   console.log(keys);
// })


// const kid = 'zhBofbZw+jkZZjXs28fGfzxZgM8=';
// client.getSigningKey(kid, (err, key) => {
//   if (err){
//     console.error(err);
//     return
//   }
//   const signingKey = key.getPublicKey();

//   console.log('signing key:')
//   console.log(signingKey)


//   // Now I can use this to configure my Express or Hapi middleware
// });