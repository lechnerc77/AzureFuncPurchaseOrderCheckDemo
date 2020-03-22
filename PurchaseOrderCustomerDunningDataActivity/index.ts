import { AzureFunction, Context } from "@azure/functions";
import * as df from "durable-functions";
import { CustomerDunning } from "@sap/cloud-sdk-vdm-business-partner-service";
import { CircuitBreakerStateValues, CircuitState } from "../util/circuitBreakerTypes";

const activityFunction: AzureFunction = async function (
  context: Context
): Promise<JSON> {

  //Basic check if circuit breaker for topic is open
  const client = df.getClient(context);
  const entityId = new df.EntityId("CircuitBreakerEntity", process.env["CircuitBreakerTopic"]);

  const entityState = await client.readEntityState(entityId);

  if (entityState.entityExists === true) {
    const circuitBreakerState = <CircuitState>entityState.entityState;

    if (circuitBreakerState.circuitBreakerState == CircuitBreakerStateValues.Open) {
      throw new Error("Circuit breaker for topic " + process.env["CircuitBreakerTopic"] + " is OPEN");
    }

  }

  try {

    let dunningInformation = await getCustomerDunningByID({ customer: context.bindingData.input.bpId.toString(), companyCode: context.bindingData.input.companyCode.toString(), dunningArea: context.bindingData.input.dunningArea.toString() })

    const dunningData: JSON = <JSON><any>{ "dunningLevel": dunningInformation.dunningLevel };

    return dunningData;
  }
  catch (error) {

    // Signal the circuit breaker that something went wrong 
    const currentDate = Date.now();
    await client.signalEntity(entityId, "error", currentDate);

    //Re-raise error and let the orchestrator do his thing
    throw error;
  }


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