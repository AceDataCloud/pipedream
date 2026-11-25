import acedatacloud from "../../acedatacloud.app.mjs";
import {
  influence, referenceText, submitMusic,
} from "../../common/acemusic.mjs";
import { requiredText } from "../../common/utils.mjs";

export default {
  key: "acedatacloud-cover-ace-music-track",
  name: "Cover ACE Music Track",
  description: "Create a cover of a compatible track from your Ace Data Cloud account using new lyrics and style. Each submission uses account credits. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
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
    audio_id: {
      type: "string",
      label: "Track ID",
      description: "The platform audio ID of a track owned by the connected account.",
    },
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
      optional: true,
    },
    audio_influence: {
      type: "string",
      label: "Audio Influence",
      description: "How closely the result follows the reference audio, from 1 to 100 (for example, 62.5).",
      optional: true,
      default: "60",
    },
  },
  async run({ $ }) {
    return submitMusic($, this.acedatacloud, {
      action: "cover",
      model: "acemusic-v1.1",
      audio_id: referenceText(this.audio_id, "Owned track ID"),
      lyric: requiredText(this.lyric, "Lyrics"),
      style: requiredText(this.style, "Musical style"),
      title: this.title
        ? requiredText(this.title, "Title")
        : undefined,
      audio_influence: influence(this.audio_influence),
    });
  },
};
