import * as df from "durable-functions";
import { CircuitBreakerStateValues, CircuitState } from "../util/circuitBreakerTypes";
import { DunningDetailData, DunningLevelData } from "../util/dunningDataTypes";

const orchestrator = df.orchestrator(function* (context) {

    const entityId = new df.EntityId("CircuitBreakerEntity", process.env["CircuitBreakerTopic"]);
    const state: CircuitState = yield context.df.callEntity(entityId, "getState");
    if (state.circuitBreakerState == CircuitBreakerStateValues.Open) {
        //Circuit breaker is OPEN! => Abort the processing
        context.log(state);
        raiseCircuitError();
    }

    const retryOptions: df.RetryOptions = getRetryConfig();

    let result: DunningLevelData = yield context.df.callActivityWithRetry("PurchaseOrderCustomerDunningDataActivity", retryOptions, context.bindingData);

    /*
    Just for Demo Purposes: Leave out the second call, just for demo purposes
    context.bindingData.dunningLevel = result.dunningLevel;

    let detailData: DetailData = yield context.df.callActivity("PurchaseOrderCustomerAddDataActivity", context.bindingData.input);
     return detailData;
    */

});

export default orchestrator;

function raiseCircuitError() {
    const fireCircuitBreakerActiveError = new Error("Circuit Breaker for topic " + process.env["CircuitBreakerTopic"] + " is open");
    throw fireCircuitBreakerActiveError;
}

function getRetryConfig(): df.RetryOptions {
    const retryConfig: df.RetryOptions = new df.RetryOptions(+process.env["firstRetryIntervalInMilliseconds"], +process.env["maxNumberOfAttempts"]);
    retryConfig.maxRetryIntervalInMilliseconds = +process.env["maxRetryIntervalInMilliseconds"];
    retryConfig.retryTimeoutInMilliseconds = +process.env["retryTimeoutInMilliseconds"];

    return retryConfig;
}