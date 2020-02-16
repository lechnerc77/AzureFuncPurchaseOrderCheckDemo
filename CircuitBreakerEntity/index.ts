import * as df from "durable-functions";
import { CircuitBreakerStateValues, CircuitState } from "../util/circuitBreakerTypes";

module.exports = df.entity(function (context) {

    const initialCircuitState: JSON = <JSON><any>{ "circuitBreakerState": CircuitBreakerStateValues.Closed, "lastErrorUTC": 0, "errorCounter": 0 };
    const currentCircuitState: CircuitState = <CircuitState>context.df.getState(() => initialCircuitState);

    switch (context.df.operationName) {
        case "error":
            context.log("Circuit Breaker: Error is recorded")

            let currentErrorTime = <number>context.df.getInput();

            context.log("Circuit Breaker: Error is recorded")

            if (isErrorInTimeWindow(currentErrorTime, currentCircuitState.lastErrorUTC) || currentCircuitState.lastErrorUTC == 0) {
                currentCircuitState.errorCounter += 1;
                context.log("TimeWindow constraint met; Error Counter is " + currentCircuitState.errorCounter)
            }
            else {
                currentCircuitState.errorCounter = 0;
                context.log("TimeWindow Constraint is NOT met; Error Counter is reset")
            }

            if (currentCircuitState.errorCounter > +process.env["errorCounterThreshold"]) {
                currentCircuitState.circuitBreakerState = CircuitBreakerStateValues.Open
                context.log("Circuit Breaker opens NOW ...")

            }
            currentCircuitState.lastErrorUTC = currentErrorTime;

            context.df.setState(currentCircuitState);
            break;
        case "reset":
            //context.df.setState(initialCircuitState);
            context.df.setState(initialCircuitState);
            break;
        case "getState":
            context.df.return(currentCircuitState)
            break;
    }
});

function isErrorInTimeWindow(currentErrorTime: number, lastErrorTime: number): boolean {

    return (currentErrorTime - lastErrorTime < +process.env["timeWindowThresholdInMilliSeconds"]) ? true : false;

}