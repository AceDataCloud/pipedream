import acedatacloud from "../../acedatacloud.app.mjs";
import {
  models, musicModel, submitMusic,
} from "../../common/acemusic.mjs";
import { requiredText } from "../../common/utils.mjs";

export default {
  key: "acedatacloud-generate-ace-music-song",
  name: "Generate ACE Music Song",
  description: "Create a song from an idea and return its task ID. Each submission uses account credits. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
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
    return submitMusic($, this.acedatacloud, {
      action: "generate",
      custom: false,
      prompt: requiredText(this.prompt, "Music or lyrics idea"),
      model: musicModel(this.model),
    });
  },
};
