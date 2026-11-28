import acedatacloud from "../../acedatacloud.app.mjs";
import {
  assetTypes, models, musicModel, submitMusic,
} from "../../common/acemusic.mjs";
import { requiredText } from "../../common/utils.mjs";

export default {
  key: "acedatacloud-generate-ace-music-song",
  name: "Generate ACE Music Song",
  description: "Create a song from an idea and return its task ID. Each submission uses account credits. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    acedatacloud,
    assetId: {
      type: "string",
      label: "Reference Asset ID",
      description: "Owned asset ID for optional v1.1 idea generation.",
      optional: true,
    },
    assetType: {
      type: "string",
      label: "Reference Asset Type",
      description: "Type returned for the owned asset.",
      options: assetTypes,
      optional: true,
    },
    prompt: {
      type: "string",
      label: "Song Idea",
      description: "Describe the song or lyrics you would like to generate.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "The ACE Music model used to generate the song.",
      optional: true,
      options: models,
      default: models[0],
    },
  },
  async run({ $ }) {
    const model = musicModel(this.model);
    const hasReference = Boolean(this.assetId || this.assetType);
    const validReference = this.assetId?.trim() && assetTypes.includes(this.assetType);
    if (hasReference && (!validReference || model !== models[0])) {
      throw new Error("Provide an asset ID and matching type with ACE Music v1.1.");
    }
    return submitMusic($, this.acedatacloud, {
      action: "generate",
      custom: false,
      prompt: requiredText(this.prompt, "Music or lyrics idea"),
      model,
      ...(hasReference
        ? {
          asset_id: this.assetId.trim(),
          asset_type: this.assetType,
        }
        : {}),
    });
  },
};
