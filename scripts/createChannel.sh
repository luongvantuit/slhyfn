export PATH=$PATH:$PWD/fabric-samples/bin
export CORE_PEER_TLS_ENABLED=true

function joinNetwork() {
    CHANNEL_NAME=$1
    TYPE=$2
    MSPID=$3
    PEER_PORT=$4
    export ORDERER_CA=$PWD/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
    export PEER0_ORG_CA=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/peers/peer0.$TYPE.example.com/tls/ca.crt
    export ORDERER_ADMIN_TLS_SIGN_CERT=$PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
    export ORDERER_ADMIN_TLS_PRIVATE_KEY=$PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key
    export CORE_PEER_LOCALMSPID=$MSPID
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG_CA
    export CORE_PEER_MSPCONFIGPATH=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/users/Admin@$TYPE.example.com/msp
    export CORE_PEER_ADDRESS=localhost:$PEER_PORT
    export FABRIC_CFG_PATH=$PWD/compose/peercfg/$TYPE
    peer channel join -b $PWD/channel-artifacts/$CHANNEL_NAME.block
}

# Create Channel Sl
configtxgen -profile OrgApplicationGenesis  -outputBlock ./channel-artifacts/sl.block -channelID sl -configPath ./configtx
osnadmin channel join --channelID sl --config-block ./channel-artifacts/sl.block -o localhost:7053 --ca-file $PWD/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem --client-cert $PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt --client-key $PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key

# Create Channel One 
configtxgen -profile OneApplicationGenesis  -outputBlock ./channel-artifacts/one.block -channelID one -configPath ./configtx
osnadmin channel join --channelID one --config-block ./channel-artifacts/one.block -o localhost:7053 --ca-file $PWD/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem --client-cert $PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt --client-key $PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key

# Create Channel Two
configtxgen -profile TwoApplicationGenesis  -outputBlock ./channel-artifacts/two.block -channelID two -configPath ./configtx
osnadmin channel join --channelID two --config-block ./channel-artifacts/two.block -o localhost:7053 --ca-file $PWD/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem --client-cert $PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt --client-key $PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key

sleep 10

# Peer Join Channel (SL)
joinNetwork sl deliverer DelivererMSP 7051
docker exec -it cli.deliverer sh ./scripts/setAnchorPeer.sh sl deliverer DelivererMSP 7051

joinNetwork sl manufacturer ManufacturerMSP 8051
docker exec -it cli.manufacturer sh ./scripts/setAnchorPeer.sh sl manufacturer ManufacturerMSP 8051

joinNetwork sl producer ProducerMSP 9051
docker exec -it cli.producer sh ./scripts/setAnchorPeer.sh sl producer ProducerMSP 9051

joinNetwork sl regulatorydepartment RegulatoryDepartmentMSP 10051
docker exec -it cli.regulatorydepartment sh ./scripts/setAnchorPeer.sh sl regulatorydepartment RegulatoryDepartmentMSP 10051

joinNetwork sl retailer RetailerMSP 11051
docker exec -it cli.retailer sh ./scripts/setAnchorPeer.sh sl retailer RetailerMSP 11051

# Peer Join Channel (One)
joinNetwork one deliverer DelivererMSP 7051
docker exec -it cli.deliverer sh ./scripts/setAnchorPeer.sh one deliverer DelivererMSP 7051

joinNetwork one manufacturer ManufacturerMSP 8051
docker exec -it cli.manufacturer sh ./scripts/setAnchorPeer.sh one manufacturer ManufacturerMSP 8051

# Peer Join Channel (Two)
joinNetwork two producer ProducerMSP 9051
docker exec -it cli.producer sh ./scripts/setAnchorPeer.sh two producer ProducerMSP 9051

joinNetwork two regulatorydepartment RegulatoryDepartmentMSP 10051
docker exec -it cli.regulatorydepartment sh ./scripts/setAnchorPeer.sh two regulatorydepartment RegulatoryDepartmentMSP 10051

joinNetwork two retailer RetailerMSP 11051
docker exec -it cli.retailer sh ./scripts/setAnchorPeer.sh two retailer RetailerMSP 11051