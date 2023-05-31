export PATH=$PATH:$PWD/fabric-samples/bin
# Env
export CORE_PEER_TLS_ENABLED=true
export PEER0_ORG_CA=$PWD/crypto-config/peerOrganizations/org.example.com/peers/peer0.org.example.com/tls/ca.crt
export CHANNEL_NAME=sl
export CORE_PEER_LOCALMSPID=OrgMSP
export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG_CA
export CORE_PEER_MSPCONFIGPATH=$PWD/crypto-config/peerOrganizations/org.example.com/users/Admin@org.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
export FABRIC_CFG_PATH=$PWD/compose/peercfg
SOCK="${DOCKER_HOST:-/var/run/docker.sock}"
DOCKER_SOCK="${SOCK##unix://}"

# peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C sl -n slcc --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/crypto-config/peerOrganizations/org.example.com/peers/peer0.org.example.com/tls/ca.crt" -c '{"function":"Add","Args":["123456", "Hi"]}'

peer chaincode query -C sl -n slcc -c $1