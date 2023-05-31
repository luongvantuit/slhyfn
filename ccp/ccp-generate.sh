#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP="$(one_line_pem $4)"
    local CP="$(one_line_pem $5)"
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s/\${LORG}/$6/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp/ccp-template.json
}

function yaml_ccp {
    local PP="$(one_line_pem $4)"
    local CP="$(one_line_pem $5)"
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s/\${LORG}/$6/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=Org
LORG=$(echo $ORG | tr '[:upper:]' '[:lower:]')
P0PORT=7051
CAPORT=7054
PEERPEM=$PWD/crypto-config/peerOrganizations/$LORG.example.com/tlsca/tlsca.$LORG.example.com-cert.pem
CAPEM=$PWD/crypto-config/peerOrganizations/$LORG.example.com/ca/ca.$LORG.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $LORG)" >$PWD/crypto-config/peerOrganizations/$LORG.example.com/connection-$LORG.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $LORG)" >$PWD/crypto-config/peerOrganizations/$LORG.example.com/connection-$LORG.yaml
