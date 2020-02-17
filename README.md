# Purchase Order Demo
The basic intention of this code is described in the blog post [“A Serverless Extension Story – From ABAP to Azure”](https://blogs.sap.com/2019/12/09/a-serverless-extension-story-from-abap-to-azure/). 
This code is the second enhancement as described in the blog post ["A Serverless Extension Story II – Bringing State to the Stateless"](https://blogs.sap.com/2020/02/17/a-serverless-extension-story-ii-bringing-state-to-the-stateless/). It contains a first error handling of the HTTP calls by introducing the retry functionality of Durable Functions. 
## Branch
You are on the durablefuncV2retry branch.
## Setup
* Execute a `npm install` in the project directory
* Execute a `npm run build` to build the project
## Calling the project
To trigger the  project you issue an HTTP GET/POST call to the endpoint ` http://localhost:7071/api/orchestrators/PurchaseOrderCheckOrchestratorJS`.

The body of the successful call must contain the following data:
```
{
	"bpId": "17100001",
	"companyCode": "1710",
	"dunningArea": " "
}
```
The body of the unsuccessful call must contain the following data:
```
{
	"bpId": "17100001",
	"companyCode": "1710",
	"dunningArea": "1234"
}
```
## Demo Setup
The orchestration function contains a commented peace of code that can be used to first issue a wrong call and then adopt the data to make it successful in the first replay. The code is given by:
```
 if (context.df.isReplaying == true) {
            context.bindingData.input.dunningArea = " "
        }
```

## Local Setting
If you want to develop locally, you need to create a local.settings.json file. You find a template in my [gist](https://gist.github.com/lechnerc77/2da9c96d902cc554ce8250f202cb7f5b)