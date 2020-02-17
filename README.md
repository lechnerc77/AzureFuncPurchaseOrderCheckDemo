# Purchase Order Demo
The basic intention of this code is described in the blog post [“A Serverless Extension Story – From ABAP to Azure”](https://blogs.sap.com/2019/12/09/a-serverless-extension-story-from-abap-to-azure/). 
This code is the fourth enhancement as described in the blog post ["A Serverless Extension Story II – Bringing State to the Stateless"](https://blogs.sap.com/2020/02/17/a-serverless-extension-story-ii-bringing-state-to-the-stateless/). It introduces a basic circuit breaker for the HTTP call making use of Durable Entities. 

## Branch
You are on the durablefuncV2CircuitBreaker branch.

## Setup
* Execute a `npm install` in the project directory
* Execute a `npm run build` to build the project
* Execute a `func extensions install` to install the durable function extension explicitly

## Calling the project
To trigger the  project you issue an HTTP GET/POST call to the endpoint ` http://localhost:7071/api/orchestrators/PurchaseOrderCheckOrchestratorJS`.

As there is a bug in the durable function extension version 2.1.x there must not be any body handed over to the HTTP call. This issue will be fixed with version 2.2.0

## Demo Setup
The wrong data of the call is currently set explicitly in the `index.ts` file of `PurchaseOrderCustomerDunningDataActivity` to open the circuit breaker. To trigger the circuit breaker, fire several calls to the HTTP endpoint. 

## Local Setting
If you want to develop locally, you need to create a local.settings.json file. You find a template in my [gist](https://gist.github.com/lechnerc77/2da9c96d902cc554ce8250f202cb7f5b)