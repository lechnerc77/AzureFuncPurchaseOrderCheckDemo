import { AzureFunction, Context } from "@azure/functions"
import { BusinessPartner } from "@sap/cloud-sdk-vdm-business-partner-service"

const activityFunction: AzureFunction = async function (context: Context): Promise<JSON> {

    let bpData = await getCustomerDataByID(context.bindingData.bpId.toString())

    const detailData: JSON = <JSON><any>{ "bpId": context.bindingData.bpId, "company": context.bindingData.companyCode, "fullName": bpData.businessPartnerFullName, "dunningLevel": context.bindingData.dunningLevel };

    return detailData;

};

async function getCustomerDataByID(customer: string): Promise<BusinessPartner> {
    return BusinessPartner.requestBuilder()
        .getByKey(customer)
        .withCustomHeaders({ APIKey: process.env["APIHubKey"] })
        .execute({
            url: process.env["APIHubDestination"]
        })
}

export default activityFunction;