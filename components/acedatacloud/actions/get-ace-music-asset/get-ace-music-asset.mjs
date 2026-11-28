import acedatacloud from "../../acedatacloud.app.mjs";
import { referenceText } from "../../common/acemusic.mjs";

export default {
  key: "acedatacloud-get-ace-music-asset",
  name: "Get ACE Music Asset",
  description: "Retrieve one owned reference asset by its platform ID. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    acedatacloud,
    id: {
      type: "string",
      label: "Asset ID",
      description: "Asset ID from a completed import.",
    },
  },
  async run({ $ }) {
    return this.acedatacloud.request({
      $,
      path: "/acemusic/assets",
      method: "POST",
      data: {
        action: "retrieve",
        id: referenceText(this.id, "Asset ID"),
      },
    });
  },
};
