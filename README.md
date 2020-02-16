# Purchase Order Demo
The basic intention of this code is described in the blog post [“A Serverless Extension Story – From ABAP to Azure”](https://blogs.sap.com/2019/12/09/a-serverless-extension-story-from-abap-to-azure/). 
## Branch
You are on the MASTER branch.
## Setup
* Execute a `npm install` in the project directory
* Execute a `npm run build` to build the project
## Calling the project
To trigger the  project you must setup a service bus in Azure and call it via the ABAP SDK for Azure as described in the above mentioned blog.
## Local Setting
If you want to develop locally, you need to create a local.settings.json file. You find a template in my [gist](https://gist.github.com/lechnerc77/479a69842f1f4d9652baa007524e99cf)