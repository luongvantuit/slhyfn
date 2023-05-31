export PATH=$PATH:$PWD/fabric-samples/bin
SOCK="${DOCKER_HOST:-/var/run/docker.sock}"
DOCKER_SOCK="${SOCK##unix://}" 

function cryptoGenerate() {
    if [ ! -d $PWD/crypto-config ]; then
        cryptogen generate --config=$PWD/cryptogen/crypto-config-orderer.yaml
        cryptogen generate --config=$PWD/cryptogen/crypto-config-deliverer.yaml
        cryptogen generate --config=$PWD/cryptogen/crypto-config-manufacturer.yaml
        cryptogen generate --config=$PWD/cryptogen/crypto-config-producer.yaml
        cryptogen generate --config=$PWD/cryptogen/crypto-config-regulatorydepartment.yaml
        cryptogen generate --config=$PWD/cryptogen/crypto-config-retailer.yaml
    fi

}

cryptoGenerate
DOCKER_SOCK="${DOCKER_SOCK}" docker-compose -f ./compose/docker-compose.yaml -f ./compose/compose-retailer.yaml -f ./compose/compose-manufacturer.yaml -f ./compose/compose-producer.yaml -f ./compose/compose-deliverer.yaml -f ./compose/compose-regulatorydepartment.yaml up -d