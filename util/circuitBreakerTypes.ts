export enum CircuitBreakerStateValues {
    Open, 
    Closed,
} ;
export interface CircuitState {
    circuitBreakerState: CircuitBreakerStateValues;
    lastErrorUTC: number;
    errorCounter: number;
}