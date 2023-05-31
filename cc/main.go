package main

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	cc "github.com/zujisoft/sl/cc/chaincode"
)

func main() {
	cc, err := contractapi.NewChaincode(&cc.SmartContract{})
	if err != nil {
		panic(err.Error())
	}
	if err := cc.Start(); err != nil {
		panic(err.Error())
	}
}
