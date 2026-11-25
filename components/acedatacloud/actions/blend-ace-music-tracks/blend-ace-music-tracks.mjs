import acedatacloud from "../../acedatacloud.app.mjs";
import {
  influence, submitMusic, twoTracks,
} from "../../common/acemusic.mjs";
import { requiredText } from "../../common/utils.mjs";

export default {
  key: "acedatacloud-blend-ace-music-tracks",
  name: "Blend ACE Music Tracks",
  description: "Blend two distinct, compatible tracks from your Ace Data Cloud account with new lyrics and style. Each submission uses account credits. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
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
    first_audio_id: {
      type: "string",
      label: "First Track ID",
      description: "The platform audio ID of the first owned reference track.",
    },
    second_audio_id: {
      type: "string",
      label: "Second Track ID",
      description: "The platform audio ID of a different owned reference track.",
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
      action: "mashup",
      model: "acemusic-v1.1",
      mashup_audio_ids: twoTracks(this.first_audio_id, this.second_audio_id),
      lyric: requiredText(this.lyric, "Lyrics"),
      style: requiredText(this.style, "Musical style"),
      title: this.title
        ? requiredText(this.title, "Title")
        : undefined,
      audio_influence: influence(this.audio_influence),
    });
  },
};
