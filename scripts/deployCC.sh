export PATH=$PATH:$PWD/fabric-samples/bin
# Env
export CORE_PEER_TLS_ENABLED=true
SOCK="${DOCKER_HOST:-/var/run/docker.sock}"
DOCKER_SOCK="${SOCK##unix://}"

function checkCommitReadiness() {
    CHANNEL_NAME=$1
    TYPE=$2
    MSPID=$3
    PEER_PORT=$4
    export PEER0_ORG_CA=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/peers/peer0.$TYPE.example.com/tls/ca.crt
    export CORE_PEER_LOCALMSPID=$MSPID
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG_CA
    export CORE_PEER_MSPCONFIGPATH=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/users/Admin@$TYPE.example.com/msp
    export CORE_PEER_ADDRESS=localhost:$PEER_PORT
    export FABRIC_CFG_PATH=$PWD/compose/peercfg/$TYPE
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name slcc --version 1.0 --sequence 1 --tls --cafile "$PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json
}

function commitCC() {
    CHANNEL_NAME=$1
    PEER_CON=$2
    TYPE=$3
    MSPID=$4
    PEER_PORT=$5
    export PEER0_ORG_CA=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/peers/peer0.$TYPE.example.com/tls/ca.crt
    export CORE_PEER_LOCALMSPID=$MSPID
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG_CA
    export CORE_PEER_MSPCONFIGPATH=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/users/Admin@$TYPE.example.com/msp
    export CORE_PEER_ADDRESS=localhost:$PEER_PORT
    export FABRIC_CFG_PATH=$PWD/compose/peercfg/$TYPE
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID $CHANNEL_NAME --name slcc --version 1.0 --sequence 1 --tls --cafile "$PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" $PEER_CON
}

function queryCommitted() {
    CHANNEL_NAME=$1
    TYPE=$2
    MSPID=$3
    PEER_PORT=$4
    export PEER0_ORG_CA=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/peers/peer0.$TYPE.example.com/tls/ca.crt
    export CORE_PEER_LOCALMSPID=$MSPID
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG_CA
    export CORE_PEER_MSPCONFIGPATH=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/users/Admin@$TYPE.example.com/msp
    export CORE_PEER_ADDRESS=localhost:$PEER_PORT
    export FABRIC_CFG_PATH=$PWD/compose/peercfg/$TYPE
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name slcc --cafile "$PWD/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"
}

function packageChaincode() {
    TYPE=$1
    export FABRIC_CFG_PATH=$PWD/compose/peercfg/$TYPE
    # Golang
    pushd $PWD/cc
    GO111MODULE=on go mod vendor
    popd
    # Package cc Golang
    peer lifecycle chaincode package slcc.tar.gz --path $PWD/cc --lang golang --label "slcc_1.0"
}

function deployCC() {
    TYPE=$1
    MSPID=$2
    PEER_PORT=$3
    export PEER0_ORG_CA=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/peers/peer0.$TYPE.example.com/tls/ca.crt
    export CORE_PEER_LOCALMSPID=$MSPID
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG_CA
    export CORE_PEER_MSPCONFIGPATH=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/users/Admin@$TYPE.example.com/msp
    export CORE_PEER_ADDRESS=localhost:$PEER_PORT
    export FABRIC_CFG_PATH=$PWD/compose/peercfg/$TYPE

    peer lifecycle chaincode queryinstalled --output json | jq -r 'try (.installed_chaincodes[].package_id)'
    # Install chaincode
    peer lifecycle chaincode install slcc.tar.gz
}

function approveCC() {
    CHANNEL_NAME=$1
    TYPE=$2
    MSPID=$3
    PEER_PORT=$4
    export PEER0_ORG_CA=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/peers/peer0.$TYPE.example.com/tls/ca.crt
    export CORE_PEER_LOCALMSPID=$MSPID
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG_CA
    export CORE_PEER_MSPCONFIGPATH=$PWD/crypto-config/peerOrganizations/$TYPE.example.com/users/Admin@$TYPE.example.com/msp
    export CORE_PEER_ADDRESS=localhost:$PEER_PORT
    export FABRIC_CFG_PATH=$PWD/compose/peercfg/$TYPE
    CC_PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r 'try (.installed_chaincodes[].package_id)')
    peer lifecycle chaincode queryinstalled
    peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "$PWD/crypto-config/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem" --channelID $CHANNEL_NAME --name slcc --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1
}

packageChaincode deliverer

# Deplay CC To Peer
deployCC deliverer DelivererMSP 7051
deployCC manufacturer ManufacturerMSP 8051
deployCC producer ProducerMSP 9051
deployCC regulatorydepartment RegulatoryDepartmentMSP 10051
deployCC retailer RetailerMSP 11051

# Approve CC On Channel Sl
approveCC sl deliverer DelivererMSP 7051
approveCC sl manufacturer ManufacturerMSP 8051
approveCC sl producer ProducerMSP 9051
approveCC sl regulatorydepartment RegulatoryDepartmentMSP 10051
approveCC sl retailer RetailerMSP 11051

# Approve CC On Channel One
approveCC one deliverer DelivererMSP 7051
approveCC one manufacturer ManufacturerMSP 8051

# Approve CC On Channel Two
approveCC two producer ProducerMSP 9051
approveCC two regulatorydepartment RegulatoryDepartmentMSP 10051
approveCC two retailer RetailerMSP 11051

# Commit CC Channel Sl
checkCommitReadiness sl deliverer DelivererMSP 7051
commitCC sl "--peerAddresses localhost:7051 --tlsRootCertFiles $PWD/crypto-config/peerOrganizations/deliverer.example.com/peers/peer0.deliverer.example.com/tls/ca.crt \ 
    --peerAddresses localhost:8051 --tlsRootCertFiles $PWD/crypto-config/peerOrganizations/manufacturer.example.com/peers/peer0.manufacturer.example.com/tls/ca.crt \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PWD/crypto-config/peerOrganizations/producer.example.com/peers/peer0.producer.example.com/tls/ca.crt \ 
    --peerAddresses localhost:10051 --tlsRootCertFiles $PWD/crypto-config/peerOrganizations/regulatorydepartment.example.com/peers/peer0.regulatorydepartment.example.com/tls/ca.crt \
    --peerAddresses localhost:11051 --tlsRootCertFiles $PWD/crypto-config/peerOrganizations/retailer.example.com/peers/peer0.retailer.example.com/tls/ca.crt" deliverer DelivererMSP 7051
queryCommitted sl deliverer DelivererMSP 7051
queryCommitted sl manufacturer ManufacturerMSP 8051
queryCommitted sl producer ProducerMSP 9051
queryCommitted sl regulatorydepartment RegulatoryDepartmentMSP 10051
queryCommitted sl retailer RetailerMSP 11051

# Commit CC Channel One
checkCommitReadiness one deliverer DelivererMSP 7051
commitCC one "--peerAddresses localhost:7051 --tlsRootCertFiles $PWD/crypto-config/peerOrganizations/deliverer.example.com/peers/peer0.deliverer.example.com/tls/ca.crt \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PWD/crypto-config/peerOrganizations/manufacturer.example.com/peers/peer0.manufacturer.example.com/tls/ca.crt" deliverer DelivererMSP 7051
queryCommitted one deliverer DelivererMSP 7051
queryCommitted one manufacturer ManufacturerMSP 8051

# Commit CC Channel Two
checkCommitReadiness two producer ProducerMSP 9051
commitCC two "--peerAddresses localhost:9051 --tlsRootCertFiles $PWD/crypto-config/peerOrganizations/producer.example.com/peers/peer0.producer.example.com/tls/ca.crt \ 
    --peerAddresses localhost:10051 --tlsRootCertFiles $PWD/crypto-config/peerOrganizations/regulatorydepartment.example.com/peers/peer0.regulatorydepartment.example.com/tls/ca.crt \
    --peerAddresses localhost:11051 --tlsRootCertFiles $PWD/crypto-config/peerOrganizations/retailer.example.com/peers/peer0.retailer.example.com/tls/ca.crt" producer ProducerMSP 9051
queryCommitted two producer ProducerMSP 9051
queryCommitted two regulatorydepartment RegulatoryDepartmentMSP 10051
queryCommitted two retailer RetailerMSP 11051
