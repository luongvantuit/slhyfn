#!bin/bash
CHANNEL_NAME=$1
TYPE=$2
MSPID=$3
PEER_PORT=$4
export PATH=$PATH:$PWD/fabric-samples/bin
export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=$PWD/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
export PEER0_ORG_CA=$PWD/crypto-config/peerOrganizations/${TYPE}.example.com/peers/peer0.${TYPE}.example.com/tls/ca.crt
export ORDERER_ADMIN_TLS_SIGN_CERT=$PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
export ORDERER_ADMIN_TLS_PRIVATE_KEY=$PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key
export CORE_PEER_LOCALMSPID=${MSPID}
export CORE_PEER_TLS_ROOTCERT_FILE=${PEER0_ORG_CA}
export CORE_PEER_MSPCONFIGPATH=$PWD/crypto-config/peerOrganizations/${TYPE}.example.com/users/Admin@${TYPE}.example.com/msp
export CORE_PEER_ADDRESS=localhost:${PEER_PORT}
peer channel fetch config config_block.pb -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com -c ${CHANNEL_NAME} --tls --cafile ${ORDERER_CA}

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq .data.data[0].payload.data.config config_block.json > ${MSPID}config.json
jq '.channel_group.groups.Application.groups.'${MSPID}'.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.'${TYPE}'.example.com","port": '${PEER_PORT}'}]},"version": "0"}}' ${MSPID}config.json > ${MSPID}modified_config.json 
configtxlator proto_encode --input ${MSPID}config.json --type common.Config --output original_config.pb
configtxlator proto_encode --input ${MSPID}modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id ${CHANNEL_NAME} --original original_config.pb --updated modified_config.pb --output config_update.pb
configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'${CHANNEL_NAME}'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . >config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output "${MSPID}anchors.tx"

peer channel update -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com -c ${CHANNEL_NAME} -f ${MSPID}anchors.tx --tls --cafile "$ORDERER_CA"