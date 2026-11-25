import acedatacloud from "../../acedatacloud.app.mjs";
import {
  models, musicModel, submitMusic,
} from "../../common/acemusic.mjs";
import { requiredText } from "../../common/utils.mjs";

export default {
  key: "acedatacloud-generate-ace-music-song-from-lyrics",
  name: "Generate ACE Music Song From Lyrics",
  description: "Create a song with your lyrics, style and title and return its task ID. Each submission uses account credits. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
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
    lyric: {
      type: "string",
      label: "Lyrics",
      description: "The lyrics to sing, including any section markers and line breaks.",
    },
    style: {
      type: "string",
      label: "Musical Style",
      description: "Describe the genre, instrumentation, or mood for the song.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the song.",
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
      custom: true,
      lyric: requiredText(this.lyric, "Lyrics"),
      style: requiredText(this.style, "Musical style"),
      title: requiredText(this.title, "Title"),
      model: musicModel(this.model),
    });
  },
};
