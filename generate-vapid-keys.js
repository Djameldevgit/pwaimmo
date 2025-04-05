const crypto = require('crypto');

function toBase64Url(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const ecdh = crypto.createECDH('prime256v1');
ecdh.generateKeys();

// Clave pública debe incluir el byte 0x04 (formato no comprimido)
const publicKey = Buffer.concat([Buffer.from([0x04]), ecdh.getPublicKey()]);
const privateKey = ecdh.getPrivateKey();

console.log('Clave PÚBLICA VAPID:');
console.log(toBase64Url(publicKey));

console.log('\nClave PRIVADA VAPID:');
console.log(toBase64Url(privateKey));

console.log('\nAñade esto a tu .env:');
console.log(`VAPID_PUBLIC_KEY=${toBase64Url(publicKey)}`);
console.log(`VAPID_PRIVATE_KEY=${toBase64Url(privateKey)}`);