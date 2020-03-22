import * as df from "durable-functions";
import { DunningDetailData, DunningLevelData } from "../util/dunningDataTypes";

const orchestrator = df.orchestrator(function* (context) {

    const retryOptions: df.RetryOptions = getRetryConfig();

/*    
    // For demo purposes
        if (context.df.isReplaying == true) {
            context.bindingData.input.dunningArea = " "
        }
*/    

    let result: DunningLevelData = yield context.df.callActivityWithRetry("PurchaseOrderCustomerDunningDataActivity", retryOptions, context.bindingData.input);

    context.bindingData.input.dunningLevel = result.dunningLevel;

    let detailData: DunningDetailData = yield context.df.callActivityWithRetry("PurchaseOrderCustomerAddDataActivity", retryOptions, context.bindingData.input);

    return detailData;

});

export default orchestrator;

function getRetryConfig(): df.RetryOptions {
    const retryConfig: df.RetryOptions = new df.RetryOptions(+process.env["firstRetryIntervalInMilliseconds"], +process.env["maxNumberOfAttempts"]);
    retryConfig.maxRetryIntervalInMilliseconds = +process.env["maxRetryIntervalInMilliseconds"];
    retryConfig.retryTimeoutInMilliseconds = +process.env["retryTimeoutInMilliseconds"];

    return retryConfig;
}