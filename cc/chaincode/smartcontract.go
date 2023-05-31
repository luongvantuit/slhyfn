package cc

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"

	// "crypto/sha512"
	"errors"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type History struct {
	Note      string `json:"note"`
	CreatedAt string `json:"createdAt"`
	MSPId     string `json:"mspId"`
}

type Product struct {
	Id           string    `json:"id"`
	Name         string    `json:"name"`
	Type         string    `json:"type"`
	IssuerOrgId  string    `json:"issuerOrgId"`
	State        string    `json:"state"`
	Dependencies []string  `json:"dependencies"`
	CreatedAt    string    `json:"createdAt"`
	Histories    []History `json:"histories"`
}

const (
	Primary = "primary"
	Derived = "derived"
	Unblock = "unblock"
	Block   = "block"
)

type SmartContract struct {
	contractapi.Contract
}

// Hash ID transaction before execute transaction
func (sc *SmartContract) HashId(ctx contractapi.TransactionContextInterface, id string) (string, error) {
	sha := sha256.New()
	sha.Write([]byte(id))
	var hashId string = fmt.Sprintf("%x", sha.Sum(nil))
	return hashId, nil
}

// Check ID is existed in system
func (sc *SmartContract) AssetExisted(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	hashId, err := sc.HashId(ctx, id)
	if err != nil {
		return false, err
	}
	assetJSON, err := ctx.GetStub().GetState(hashId)
	if err != nil {
		return false, err
	}
	return assetJSON != nil, nil
}

// Add New Product
func (sc *SmartContract) AddProduct(ctx contractapi.TransactionContextInterface, productId string, productName string, _type string, dependencies []string, createdAt string) (*Product, error) {
	mspId, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, err
	}
	existed, err := sc.AssetExisted(ctx, productId)
	if err != nil {
		return nil, err
	}
	if existed {
		return nil, errors.New("asset is existed")
	}
	if productName == "" {
		return nil, errors.New("product name is empty")
	}
	if (_type == Derived && len(dependencies) < 1) || (_type != Primary && _type != Derived) {
		return nil, errors.New("type not valid")
	}
	for _, dependency := range dependencies {
		dependencyProduct, err := sc.GetProduct(ctx, dependency)
		if err != nil {
			return nil, err
		}
		if dependencyProduct.State == Block {
			msg := fmt.Sprintf("product dependency is blocked %s", dependency)
			return nil, errors.New(msg)
		}
	}
	hashProductId, err := sc.HashId(ctx, productId)
	if err != nil {
		return nil, err
	}
	product := &Product{
		IssuerOrgId:  mspId,
		State:        Unblock,
		Name:         productName,
		Dependencies: dependencies,
		Id:           productId,
		CreatedAt:    createdAt,
		Type:         _type,
		Histories:    []History{},
	}
	productJson, err := json.Marshal(product)
	if err != nil {
		return nil, err
	}
	if err := ctx.GetStub().PutState(hashProductId, productJson); err != nil {
		return nil, err
	}
	return product, nil
}

// Get Product
func (sc *SmartContract) GetProduct(ctx contractapi.TransactionContextInterface, productId string) (*Product, error) {
	var product Product
	hashProductId, err := sc.HashId(ctx, productId)
	if err != nil {
		return nil, err
	}
	productJSON, err := ctx.GetStub().GetState(hashProductId)
	if err != nil {
		return nil, err
	}
	if productJSON == nil {
		msg := fmt.Sprintf("not found product dependency %s", productId)
		return nil, errors.New(msg)
	}
	if err := json.Unmarshal(productJSON, &product); err != nil {
		return nil, err
	}
	return &product, err
}

func (s *SmartContract) GetProducts(ctx contractapi.TransactionContextInterface) ([]*Product, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var products []*Product
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var product Product
		err = json.Unmarshal(queryResponse.Value, &product)
		if err != nil {
			return nil, err
		}
		products = append(products, &product)
	}

	return products, nil
}

func (sc *SmartContract) AddHistory(ctx contractapi.TransactionContextInterface, productId string, note string, timNote string) (*Product, error) {
	product, err := sc.GetProduct(ctx, productId)
	if err != nil {
		return nil, err
	}
	mspId, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, err
	}
	if len(product.Histories) > 0 {
		prevHistory := product.Histories[len(product.Histories)-1]
		if timNote < prevHistory.CreatedAt {
			return nil, errors.New("date not valid")
		}
	}
	product.Histories = append(product.Histories, History{
		Note:      note,
		CreatedAt: timNote,
		MSPId:     mspId,
	})
	hashProductId, err := sc.HashId(ctx, productId)
	if err != nil {
		return nil, err
	}
	productJson, err := json.Marshal(product)
	if err != nil {
		return nil, err
	}
	if err := ctx.GetStub().PutState(hashProductId, productJson); err != nil {
		return nil, err
	}
	return product, nil
}

func (sc *SmartContract) MyProduct(ctx contractapi.TransactionContextInterface) ([]*Product, error) {
	msp, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, err
	}
	allProducts, err := sc.GetProducts(ctx)
	if err != nil {
		return nil, err
	}
	var products []*Product
	for _, prod := range allProducts {
		if prod.IssuerOrgId == msp {
			products = append(products, prod)
		}
	}
	return products, nil
}

func (sc *SmartContract) MyMSP(ctx contractapi.TransactionContextInterface) (string, error) {
	return ctx.GetClientIdentity().GetMSPID()
}
