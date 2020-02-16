import * as df from "durable-functions"
import { DunningDetailData, DunningLevelData } from "../util/dunningDataTypes";

const orchestrator = df.orchestrator(function* (context) {

      let result:DunningLevelData = yield context.df.callActivity("PurchaseOrderCustomerDunningDataActivity", context.bindingData.input);

      context.bindingData.input.dunningLevel = result.dunningLevel;

      let detailData:DunningDetailData = yield context.df.callActivity("PurchaseOrderCustomerAddDataActivity", context.bindingData.input);

      return detailData;

});

export default orchestrator;