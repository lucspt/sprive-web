import { _REQUIRED_STAGES } from "../../../products/constants";
import { ProductStage } from "../types";

export const getMissingProductStages = (productStages: ProductStage[]) => {
  const uniqueStages = Array.from(productStages, stage => stage.stage);
  const missingRequiredStages = _REQUIRED_STAGES.filter(
    x => !uniqueStages.includes(x)
  );
  const stagesWithoutCO2e = productStages.filter(x => x.processes?.length < 1);
  return [...missingRequiredStages, ...stagesWithoutCO2e] as string[];
};

export const addMissingProductStages = (productStages: ProductStage[]) => {
  const stagesPresent = Array.from(productStages, stage => stage.stage);
  return [
    ...productStages,
    ..._REQUIRED_STAGES.filter(
      x => !stagesPresent.includes(x)
      ).map(missingStage => ({ stage: missingStage, co2e: 0, processes: [] }))
    ];
};
