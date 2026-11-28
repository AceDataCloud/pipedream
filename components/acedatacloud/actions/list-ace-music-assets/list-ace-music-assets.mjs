import acedatacloud from "../../acedatacloud.app.mjs";
import { assetTypes } from "../../common/acemusic.mjs";

export default {
  key: "acedatacloud-list-ace-music-assets",
  name: "List ACE Music Assets",
  description: "Retrieve a page of owned reference assets with an optional type filter. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
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
    type: {
      type: "string",
      label: "Asset Type",
      description: "Optional type filter.",
      options: assetTypes,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number starting at one.",
      default: 1,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Assets per page, up to 100.",
      default: 20,
      optional: true,
    },
  },
  async run({ $ }) {
    const page = this.page ?? 1, pageSize = this.pageSize ?? 20;
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100 || (page - 1) * pageSize > 10000) throw new Error("Invalid page or page size.");
    if (this.type && !assetTypes.includes(this.type)) throw new Error("Unknown asset type.");
    return this.acedatacloud.request({
      $,
      path: "/acemusic/assets",
      method: "POST",
      data: {
        action: "retrieve",
        page,
        page_size: pageSize,
        ...(this.type
          ? {
            type: this.type,
          }
          : {}),
      },
    });
  },
};
