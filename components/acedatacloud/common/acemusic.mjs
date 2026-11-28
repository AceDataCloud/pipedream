import { requiredText } from "./utils.mjs";

export const models = [
  "acemusic-v1.1",
  "acemusic-v1",
];

export function referenceText(value, label) {
  const text = requiredText(value, label);
  if (Array.from(text).length > 20000) throw new Error(`${label} must be at most 20000 characters.`);
  return text;
}

export function musicModel(value = models[0]) {
  if (!models.includes(value)) throw new Error("Choose a supported ACE Music model.");
  return value;
}

export const assetTypes = [
  "midi",
  "image",
  "video",
];

export function referenceUrl(value, label = "Public MP3 URL") {
  const url = new URL(referenceText(value, label));
  if (url.protocol !== "https:" || url.username || url.password || !url.hostname) {
    throw new Error("Provide a public HTTPS URL.");
  }
  return url.href;
}

export function influence(value = 60) {
  const strength = typeof value === "string"
    ? Number(value)
    : value;
  if (!Number.isFinite(strength) || strength < 1 || strength > 100) {
    throw new Error("Audio influence must be between 1 and 100.");
  }
  return strength;
}

export function twoTracks(first, second) {
  const ids = [
    referenceText(first, "First track ID").trim(),
    referenceText(second, "Second track ID").trim(),
  ];
  if (ids[0] === ids[1]) throw new Error("Provide two distinct reference track IDs.");
  return ids;
}

/**
 * Start one paid ACE Music task and return the original task ID.
 * @param {Object} $ - Pipedream step context.
 * @param {Object} app - Connected Ace Data Cloud app.
 * @param {Object} data - Fields for this audio action.
 * @returns {Promise<Object>} The submitted task ID and state.
 */
export async function submitMusic($, app, data, path = "/acemusic/audios") {
  let response;
  try {
    response = await app.request({
      $,
      path,
      method: "POST",
      data: {
        ...data,
        async: true,
      },
      timeout: 20000,
    });
  } catch (error) {
    const status = error?.response?.status || error?.status;
    if (status >= 400 && status < 500 && status !== 408) throw error;
    const detail = status
      ? ` (HTTP ${status})`
      : "";
    throw new Error(`ACE Music submission status is unknown${detail}. Check your task history before submitting again.`);
  }
  if (typeof response?.task_id !== "string" || !response.task_id.trim()) {
    throw new Error("ACE Music returned no task ID. Check your task history before submitting again.");
  }
  $.export("$summary", `Submitted ACE Music task ${response.task_id}.`);
  return {
    ...response,
    state: "submitted",
  };
}
