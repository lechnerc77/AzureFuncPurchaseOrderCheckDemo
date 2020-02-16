import { AzureFunction, Context } from "@azure/functions";
import { CustomerDunning } from "@sap/cloud-sdk-vdm-business-partner-service";

const activityFunction: AzureFunction = async function (
  context: Context
): Promise<JSON> {

  let dunningInformation = await getCustomerDunningByID({ customer: context.bindingData.bpId.toString(), companyCode: context.bindingData.companyCode.toString(), dunningArea: context.bindingData.dunningArea.toString() })

  const dunningData: JSON = <JSON><any>{ "dunningLevel": dunningInformation.dunningLevel };

  return dunningData;

};

async function getCustomerDunningByID({
  customer,
  companyCode,
  dunningArea
}: {
  customer: string;
  companyCode: string;
  dunningArea: string;
}): Promise<CustomerDunning> {
  return CustomerDunning.requestBuilder()
    .getByKey(customer, companyCode, dunningArea)
    .withCustomHeaders({ APIKey: process.env["APIHubKey"] })
    .execute({
      url: process.env["APIHubDestination"]
    });
}

export default activityFunction;
