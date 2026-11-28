import acedatacloud from "../../acedatacloud.app.mjs";
import {
  assetTypes, referenceUrl, submitMusic,
} from "../../common/acemusic.mjs";

export default {
  key: "acedatacloud-import-ace-music-asset",
  name: "Import ACE Music Asset",
  description: "Import one reference asset from a public HTTPS URL and return its original task ID. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    acedatacloud,
    type: {
      type: "string",
      label: "Asset Type",
      description: "Select an enabled reference type.",
      options: assetTypes,
    },
    url: {
      type: "string",
      label: "File URL",
      description: "Public HTTPS URL for the selected file.",
    },
    name: {
      type: "string",
      label: "Asset Name",
      description: "Optional display name.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!assetTypes.includes(this.type)) throw new Error("Unknown asset type.");
    return submitMusic($, this.acedatacloud, {
      action: "upload",
      type: this.type,
      url: referenceUrl(this.url, "File URL"),
      ...(this.name
        ? {
          name: this.name,
        }
        : {}),
    }, "/acemusic/assets");
  },
};
