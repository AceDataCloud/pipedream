# Ace Data Cloud

Connect an [Ace Data Cloud application API token](https://platform.acedata.cloud/console/applications) that can access the selected chat models or ACE Music. [Pipedream app registration](https://github.com/PipedreamHQ/pipedream/issues/22155) is pending.

- **List Chat Models** returns chat IDs that appear in both the account model list and the published typed catalog. It does not generate text.
- **Chat With Model** sends a text prompt through the selected model's published Chat Completions, Responses, or Messages endpoint. Check the [model catalog and pricing](https://platform.acedata.cloud/models) before running this action.

ACE Music actions generate a song from a prompt or lyrics, import a reference MP3, cover a track, or blend two tracks. Each action makes one paid submission to the [ACE Music API](https://github.com/AceDataCloud/ACEMusicAPI) and returns its task ID. Save that ID to retrieve the result from your Ace Data Cloud account. If a submission times out, check your task history before retrying.

Run `npm test` from this directory to exercise the chat and music actions with fixtures.
