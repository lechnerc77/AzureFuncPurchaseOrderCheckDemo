import { AzureFunction, Context } from "@azure/functions"
import { CustomerDunning, BusinessPartner } from "@sap/cloud-sdk-vdm-business-partner-service"

const serviceBusTopicTrigger: AzureFunction = async function (context: Context, mySbMsg: any, outputSbMsg: any): Promise<void> {
    context.log('ServiceBus topic trigger function processed BP ID', mySbMsg.BPID)
    context.log('ServiceBus topic trigger function processed Company ID', mySbMsg.COMPANY)

    try {

        let dunningInformation = await getCustomerDunningByID({ customer: mySbMsg.BPID.toString(), companyCode: mySbMsg.COMPANY.toString(), dunningArea: ' ' })

        if (dunningInformation.dunningLevel != '0') {

            context.log('Dunning check NOT passed');
            let bpData = await getCustomerDataByID(mySbMsg.BPID.toString())

            context.log('Customer under dunning - full name: ' + bpData.businessPartnerFullName)

            let outboundMessage = JSON.stringify({ "BPID": mySbMsg.BPID, "Company": mySbMsg.COMPANY, "FullName": bpData.businessPartnerFullName, "DunningLevel": dunningInformation.dunningLevel })

            context.log('Sending out message:', outboundMessage)
            context.bindings.outputSbMsg = outboundMessage

        }
        else {
            context.log('Dunning check passed');
        }
    } catch (error) {
        context.log('Error in OData call happend: ', error)
    }
};

async function getCustomerDunningByID({ customer, companyCode, dunningArea }: { customer: string; companyCode: string; dunningArea: string; }): Promise<CustomerDunning> {
    return CustomerDunning.requestBuilder()
        .getByKey(customer, companyCode, dunningArea)
        .withCustomHeaders({ APIKey: process.env["APIHubKey"] })
        .execute({
            url: process.env["APIHubDestination"]
        });
}


async function getCustomerDataByID(customer: string): Promise<BusinessPartner> {
    return BusinessPartner.requestBuilder()
        .getByKey(customer)
        .withCustomHeaders({ APIKey: process.env["APIHubKey"] })
        .execute({
            url: process.env["APIHubDestination"]
        })
}

export default serviceBusTopicTrigger;
