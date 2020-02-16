import * as df from "durable-functions";
import moment from "moment";
import { DunningDetailData, DunningLevelData } from "../util/dunningDataTypes";


const orchestrator = df.orchestrator(function* (context) {

    const retryOptions: df.RetryOptions = getRetryConfig();

    /*
    Introducing a racing condition for the first OData call
    Even in case of no error, we might want to trigger a timeout
    */
    const dunningLevelTask = context.df.callActivityWithRetry("PurchaseOrderCustomerDunningDataActivity", retryOptions, context.bindingData.input);
    const deadline = moment.utc(context.df.currentUtcDateTime).add(+process.env["timeoutInMilliseconds"], "ms");
    const timeoutTask1 = context.df.createTimer(deadline.toDate());

    const winner = yield context.df.Task.any([dunningLevelTask, timeoutTask1]);

    if (winner === dunningLevelTask) {
        timeoutTask1.cancel();
        let result: DunningLevelData = <DunningLevelData>dunningLevelTask.result;
        context.bindingData.input.dunningLevel = result.dunningLevel;
        context.log("Dunning level fetched before timeout")
    }
    else {
        context.log("Dunning level call timed out ...")
        throw new Error('Timeout during processing of OData call');
    }

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