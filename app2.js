const jose = require('jose')
const {
  JWE,   // JSON Web Encryption (JWE)
  JWK,   // JSON Web Key (JWK)
  JWKS,  // JSON Web Key Set (JWKS)
  JWS,   // JSON Web Signature (JWS)
  JWT,   // JSON Web Token (JWT)
  errors // errors utilized by jose
} = jose

// VERIZON
const vzJWK1 = {"kid":"bb35ca40-5ca3-11e9-b9b3-8917f1aeb6fd","kty":"RSA","alg":"RS256","n":"op8E8XUgEjCgB1mimQ49-2WRjAedPW1gSU5b_M84miW1MnoXGlKHa9knBXRWFT-YU8Eq8O15ltwz5TvdorPcvwjx7CE41ikAKwjvNK-Qvn09lQjKiixStll_nNn-5y1TQ0OF44N8MVlApBni44cqeaZvJ-37oCftfd4gxv7hSB95lzI2Ax7YvsacwPbf8Lm5pm00rede21YZNVXq9DbOFB4F4SFQM0oL3aPoG5oyXG6lsDsoSc-qpvXZXOwBsc4bQmqx1SL_BTkLdGuMF7aKosRJ8BNwnJmQg0HvrU0oy4vR7vAiJW_mquol8cS8Nuxp0RHXRT7Xe8DJzxo_245Q1w","e":"AQAB","use":"enc"}
const vzJWK2 = {"kid":"zhBofbZw+jkZZjXs28fGfzxZgM8=","kty":"RSA","alg":"RS256","n":"AKNbl89eP6B8kZATNSPe3-OZ3esLx31hjX-dakHtPwXCAaCKqJFwjwKdxyRuPdsVG-8Dbk3PGhk26aJrSE93EpxeqmQqxNPMeD-N0_8pjkuVYWwPIQ_ts2iTiWOVn7wzlE4ASfvupqOR5pjuYMWNo_pd4L7QNjUCKoAt9H11HMyiP-6roo_EYgX4AH7OAhfUMncYsopWhkW_ze9z8wTXc8BAEgDmt8zFCez1CtqJB_MlSBUGDgk8oHYDsHKmx05baBaOBQ8LRGP5SULSbRtu34eLFootBIn0FvUZSnwTiSpbaHHRgWrMOVm07oSLWBuO3h_bj38zBuuqqVsAK8YuyoE","e":"AQAB","use":"sig"};
const vzJWK1AsKey = jose.JWK.asKey(vzJWK1);
const vzJWK2AsKey = jose.JWK.asKey(vzJWK2);

const tmoJWK1 = {
  "kty": "RSA",
  "kid": "pre.ccidauth.uxsidmwsdfjhaaa9324asdf",
  "alg": "RS256",
  "use": "sig",
  "e": "AQAB",
  "n": "<TBD>",
  "x5c": [
    "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"
  ]
}
const tmoJWK2 = {
  "kty": "RSA",
  "kid": "3dgt0ku4be052xaq",
  "alg": "RS256",
  "use": "enc",
  "e": "AQAB",
  "n": "p-MEbsQE4N1a1gXiobp4Le-KyL1FyRvVoxvR3Jf5HZeVvF2f6uuIi2g66fp_R7DOv-EoBWE1FIIo_X5qhArz9jYN9sCfDqyEBrwbhuy9lzfpPWHliaQUG8K1lfR8JZoxNIFJJlbifZ_rvG2pmZIrS7Iyp7QRWwwl_tVJRNX-mLRIBJ85fkNaSnA5zSeJgVw2Zw_9iFdCotfDmtUPJKlyUMoNWrc-1PdlYuqjTAcEUk-7HiEqA_Hx_eCBeQeUmsyDlKDf0KwGt5Wc96ymFLbkiKLIVdXANF4fT-qRl4B6W8SmASepTaewOu2MKO9iN-RknG0TRHzvuGiembfU31jdUw"
}
const tmoJWK3 = {
  "kty": "RSA",
  "kid": "kid_selfsigned",
  "alg": "RS256",
  "use": "sig",
  "e": "AQAB",
  "n": "rMho5Lhsz5cyVQQuVDXZd7Kj1zKceam1vrWxEZry19T5Bs7TBCTqe87XybQ0HA6jjfyc5PJqSlE7isyxa2ECmIUKQc_esZtvy-nllHqekEqSy134Kfm-PdcV0yTE-L9mzm-wHR0z8hBzeFNkml2cCLjcULx3uAc5xzcN1vVXKBmmeytkEAcHfS8WmqySRIYPFdWlMzvL5tnnK2O_p4lS9gCJnL5YtB231mQBQ-VT080iKYEJrXKOX46VtOEhDF-epz9pg10rUHmX2kVu87GoXHV3rqSH3aYB65SYOCfG7Z68m_3-OJX3BeKbX25qtOHoLrMn5Ql_aJE7FI1-cuiZ4w"
}
// const tmoJWK1AsKey = jose.JWK.asKey(tmoJWK1); // JOSEInvalidEncoding: input is not a valid base64url encoded string
const tmoJWK2AsKey = jose.JWK.asKey(tmoJWK2);
const tmoJWK3AsKey = jose.JWK.asKey(tmoJWK3);

// console.log(tmoJWK3AsKey.toPEM())

// // const keystore = new jose.JWKS.KeyStore(vzJWK1AsKey, vzJWK2AsKey);
const keystore = new jose.JWKS.KeyStore();
keystore.add(tmoJWK2AsKey);
keystore.add(tmoJWK3AsKey);

const tmoIDToken = 'eyJraWQiOiJraWRfc2VsZnNpZ25lZCIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJleHAiOjE1NzkyOTkzMzEsImlhdCI6MTU3OTI5NTczMSwiaXNzIjoiaHR0cHM6Ly9pYW0ubXNnLnQtbW9iaWxlLmNvbSIsImF1ZCI6ImNjaWQtOXIzbjJsNHAycHh5YTBlayIsInN1YiI6IjMxMDE2MC1OSzlqbHFUVHJOcGV5dnd0T1ZTYUNpVnlqbmZGNXJreEpSemtxX0R1SlpiOXJhRjlCWWh6OHNQSnBQWXdWb3JzbDVkaDA0eXQwQUN0RUUxRlB5Sk1RcWd4djZ2VTNuSFFOY0toY251ZG1QQ2FYQVFGUEhIZjFLaktxTUdvV3JFMi5leUoySWpvaWRqSWlMQ0poSWpvaWFXUjBiMnRsYm1GbGMzQnliMlFpTENKc0lqb3lOVFlzSW1Gc1p5STZJa0ZGVXlKOSIsInVzbiI6ImI1ZmNlYmEzNGQ5MDdjMjMiLCJhY3IiOiJhMyIsImF1dGhfdGltZSI6MTU3OTI5NTYzOCwiYW1yIjpbImh3ayIsInBpbiIsInBhc3N3b3JkIl19.XDgFn6FGJ0qYzZH9qzR7I9hSUev3ECGNwtGH_ufiOHekaGo_6Bqcn9KBfpn9N21MUSoE30iNyPjtbbjOnLlhKeNBzYztgBZSjXxo--YhKCeDENuYNk1fUYVJ2KqDgySopp_5DpHeBoffKQ0YGwtImljM9IiSHVRNMWWqK4VIsAoazH-mq8y8BHOKAn67Bi8hIpW_4p_FtVwoS3_UtUt5UCqABv8JGyRx8O_fG2Tp4NdCOX-zRTUvjwQ9QgJyHsQLvQF7Hnl379kih4hA6uTmeApi5u40UMyCZEpzaI2JTu26Z-3iJiORsi-F3yrEsy-DHR-tagCqPHd5xqQKn8a2aw';

const result = JWT.IdToken.verify(tmoIDToken, keystore, {
  issuer: 'https://iam.msg.t-mobile.com',
  audience: 'ccid-9r3n2l4p2pxya0ek',
  ignoreExp: true
});

console.log(result)
// console.log(keystore);
