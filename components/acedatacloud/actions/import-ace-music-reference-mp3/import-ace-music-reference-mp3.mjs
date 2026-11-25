import acedatacloud from "../../acedatacloud.app.mjs";
import {
  referenceText, referenceUrl, submitMusic,
} from "../../common/acemusic.mjs";

export default {
  key: "acedatacloud-import-ace-music-reference-mp3",
  name: "Import ACE Music Reference MP3",
  description: "Import a publicly accessible HTTPS MP3 and return its task ID. Each import uses account credits. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
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
    audio_url: {
      type: "string",
      label: "Public MP3 URL",
      description: "An HTTPS URL from which ACE Music can fetch the reference MP3.",
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "A name for the imported audio.",
      optional: true,
    },
    audio_id: {
      type: "string",
      label: "Track ID",
      description: "The platform audio ID of a track owned by the connected account.",
      optional: true,
    },
  },
  async run({ $ }) {
    return submitMusic($, this.acedatacloud, {
      action: "upload",
      audio_url: referenceUrl(this.audio_url),
      name: this.displayName
        ? referenceText(this.displayName, "Display name")
        : undefined,
      audio_id: this.audio_id
        ? referenceText(this.audio_id, "Owned track ID")
        : undefined,
    });
  },
};
