# Purchase Order Demo
The basic intention of this code is described in the blog post [“A Serverless Extension Story – From ABAP to Azure”](https://blogs.sap.com/2019/12/09/a-serverless-extension-story-from-abap-to-azure/). 
This code is the fourth enhancement as described in the blog post ["A Serverless Extension Story II – Bringing State to the Stateless"](https://blogs.sap.com/2020/02/17/a-serverless-extension-story-ii-bringing-state-to-the-stateless/). It introduces a basic circuit breaker for the HTTP call making use of Durable Entities. 

## Branch
You are on the durablefuncV2CircuitBreaker branch.

## Setup
* Execute `npm install` in the project directory
* Execute `func extensions install` to install the durable function extension explicitly
* Execute `npm run build` to build the project

## Calling the project
To trigger the  project you issue an HTTP GET/POST call to the endpoint ` http://localhost:7071/api/orchestrators/PurchaseOrderCheckOrchestratorJS`.

The body of the __correct__ call must contain the following data:
```
{
	"bpId": "17100001",
	"companyCode": "1710",
	"dunningArea": " "
}
```

The body of the __wrong__ call must contain the following data:
```
{
	"bpId": "17100001",
	"companyCode": "1710",
	"dunningArea": "1234"
}
```

## Demo Setup
To trigger the circuit breaker, fire several calls with the wrong data to the HTTP endpoint. 

## Local Setting
If you want to develop locally, you need to create a local.settings.json file. You find a template in my [gist](https://gist.github.com/lechnerc77/2da9c96d902cc554ce8250f202cb7f5b)

## Updates 
### 03/22/2020
* Tested with Function runtime V3 (nodeJS 12 LTS) and Durable Extension 2.2.0
* Added file `RESTcalls.http`. This way you can use the [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) of Visual Studio Code to issue the calls