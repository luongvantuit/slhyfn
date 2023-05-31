const grpc = require("@grpc/grpc-js");
const fs = require("fs");
const crypto = require("crypto");
const { connect, signers } = require("@hyperledger/fabric-gateway");
const path = require("path");

const peerHostAlias =
  process.env.PEER_HOST_ALIAS || `peer0.${process.env.NAME_ORG}.example.com`;
const peerEndpoint =
  process.env.PEER_ENDPOINT || `localhost:${process.env.PEER_PORT}`;
const cryptoPath =
  process.env.CRYPTO_PATH ||
  path.resolve(
    process.cwd(),
    "..",
    "crypto-config",
    "peerOrganizations",
    `${process.env.NAME_ORG}.example.com`
  );
const tlsCertPath =
  process.env.TLS_CERT_PATH ||
  path.resolve(
    cryptoPath,
    "peers",
    `peer0.${process.env.NAME_ORG}.example.com`,
    "tls",
    "ca.crt"
  );
const keyDirectoryPath =
  process.env.KEY_DIRECTORY_PATH ||
  path.resolve(
    cryptoPath,
    "users",
    `Admin@${process.env.NAME_ORG}.example.com`,
    "msp",
    "keystore"
  );
// Path to user certificate.
const certPath =
  process.env.CERT_PATH ||
  path.resolve(
    cryptoPath,
    "users",
    `Admin@${process.env.NAME_ORG}.example.com`,
    "msp",
    "signcerts",
    `Admin@${process.env.NAME_ORG}.example.com-cert.pem`
  );

async function newGrpcConnection() {
  const tlsRootCert = fs.readFileSync(tlsCertPath);
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
  return new grpc.Client(peerEndpoint, tlsCredentials, {
    "grpc.ssl_target_name_override": peerHostAlias,
  });
}

function newIdentity() {
  const credentials = fs.readFileSync(certPath);
  return { mspId: process.env.MSPID, credentials };
}

function newSigner() {
  const files = fs.readdirSync(keyDirectoryPath);
  const keyPath = path.resolve(keyDirectoryPath, files[0]);
  const privateKeyPem = fs.readFileSync(keyPath);
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
}

async function GetGateway() {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: newIdentity(),
    signer: newSigner(),
  });

  return gateway;
}

async function GetCC() {
  const gw = await GetGateway();
  return gw.getNetwork("sl").getContract("slcc");
}

module.exports = {
  GetGateway,
  GetCC,
};
