# Purchase Order Demo
The basic intention of this code is described in the blog post [“A Serverless Extension Story – From ABAP to Azure”](https://blogs.sap.com/2019/12/09/a-serverless-extension-story-from-abap-to-azure/). 
This code is the third enhancement as described in the blog post ["A Serverless Extension Story II – Bringing State to the Stateless"](https://blogs.sap.com/2020/02/17/a-serverless-extension-story-ii-bringing-state-to-the-stateless/). It introduces a racing condition to check if the issued HTTP call takes too long making use of the `Task.any` function and the durable timer. 

## Branch
You are on the durablefuncV2retrytimeout branch.

## Setup
* Execute a `npm install` in the project directory
* Execute a `npm run build` to build the project

## Calling the project
To trigger the  project you issue an HTTP GET/POST call to the endpoint ` http://localhost:7071/api/orchestrators/PurchaseOrderCheckOrchestratorJS`.

The body of the call must contain the following data:
```
{
	"bpId": "17100001",
	"companyCode": "1710",
	"dunningArea": " "
}
```

## Demo Setup
The amount of the timeout is set via the environment parameter `timeoutInMilliseconds`. The activity function `PurchaseOrderCustomerDunningDataActivity` contains a sleep functionality that waits 10 seconds until it issues the HTTP call. By tuning the environemnt parameter you can play around with this racing condition.

## Local Setting
If you want to develop locally, you need to create a local.settings.json file. You find a template in my [gist](https://gist.github.com/lechnerc77/2da9c96d902cc554ce8250f202cb7f5b)

## Updates 
### 03/22/2020
* Tested with Function runtime V3 (nodeJS 12 LTS) and Durable Extension 2.2.0
* Added file `RESTcalls.http`. This way you can use the [REST client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) of Visual Studio Code to issue the calls