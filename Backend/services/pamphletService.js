// services/pamphletService.js

import { AIPamphlet } from "../models/aiPumphletModel.js";
export const savePamphlet = async ({
  advertisementId,
  organizationId,
  generatedImageUrl,
  template,
  colors,
  brandingPreference,
  logoSize,
  headingSize,
}) => {
  return await AIPamphlet.findOneAndUpdate(
    { advertisementId },
    {
      advertisementId,
      organizationId,
      generatedImageUrl,
      template,
      colors,
      brandingPreference,
      logoSize,
      headingSize,
    },
    {
   returnDocument: "after", //   new: true,
      upsert: true,
      runValidators: true,
    }
  );
};