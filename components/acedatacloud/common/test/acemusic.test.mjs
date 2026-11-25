import assert from "node:assert/strict";
import test from "node:test";

const lyric = "  [Verse]\nWalk home\n\n[Chorus]  \n";
const model = "acemusic-v1.1";
const cases = [
  [
    "generate-ace-music-song",
    {
      prompt: "spring",
    },
    {
      action: "generate",
      custom: false,
      model,
      prompt: "spring",
    },
  ],
  [
    "generate-ace-music-song-from-lyrics",
    {
      title: "Home",
      lyric,
      style: "folk",
    },
    {
      action: "generate",
      custom: true,
      model,
      title: "Home",
      lyric,
      style: "folk",
    },
  ],
  [
    "import-ace-music-reference-mp3",
    {
      audio_url: "https://example.com/song.mp3",
    },
    {
      action: "upload",
      audio_url: "https://example.com/song.mp3",
    },
  ],
  [
    "cover-ace-music-track",
    {
      audio_id: "one",
      style: "folk",
      lyric,
      audio_influence: "62.5",
    },
    {
      action: "cover",
      model,
      audio_id: "one",
      style: "folk",
      lyric,
      audio_influence: 62.5,
    },
  ],
  [
    "blend-ace-music-tracks",
    {
      first_audio_id: "one",
      second_audio_id: "two",
      style: "folk",
      lyric,
    },
    {
      action: "mashup",
      model,
      mashup_audio_ids: [
        "one",
        "two",
      ],
      style: "folk",
      lyric,
      audio_influence: 60,
    },
  ],
];

async function loadAction(slug) {
  return (await import(`../../actions/${slug}/${slug}.mjs`)).default;
}

for (const [
  slug,
  inputs,
  expected,
] of cases) {
  test(`${slug} registers and submits once`, async () => {
    const action = await loadAction(slug);
    assert.equal(action.key, `acedatacloud-${slug}`);
    assert.equal(action.name.toLowerCase().replaceAll(" ", "-"), slug);
    assert.equal(action.type, "action");
    assert.equal(action.props.acedatacloud.app, "acedatacloud");
    const calls = [];
    const exports = [];
    const $ = {
      export: (...args) => exports.push(args),
    };
    const request = async ({
      path, method, data,
    }) => {
      calls.push({
        path,
        method,
        data: JSON.parse(JSON.stringify(data)),
      });
      return {
        task_id: "saved",
      };
    };
    const result = await action.run.call({
      ...action,
      ...inputs,
      acedatacloud: {
        request,
      },
    }, {
      $,
    });
    assert.deepEqual(result, {
      state: "submitted",
      task_id: "saved",
    });
    assert.deepEqual(calls, [
      {
        path: "/acemusic/audios",
        method: "POST",
        data: {
          ...expected,
          async: true,
        },
      },
    ]);
    assert.deepEqual(exports, [
      [
        "$summary",
        "Submitted ACE Music task saved.",
      ],
    ]);
  });
}

test("import maps the optional display name and owned audio ID", async () => {
  const action = await loadAction("import-ace-music-reference-mp3");
  const request = async ({ data }) => {
    assert.equal(data.name, "My reference");
    assert.equal(data.audio_id, "owned");
    return {
      task_id: "saved",
    };
  };
  await action.run.call({
    ...action,
    acedatacloud: {
      request,
    },
    audio_url: "https://example.com/song.mp3",
    displayName: "My reference",
    audio_id: "owned",
  }, {
    $: {
      export() {},
    },
  });
});

test("ambiguous submissions keep the original attempt and definite rejections retain their error", async () => {
  const action = await loadAction("generate-ace-music-song");
  for (const status of [
    undefined,
    408,
    503,
    400,
    403,
    429,
  ]) {
    const error = Object.assign(new Error("request rejected"), {
      response: {
        status,
      },
    });
    let calls = 0;
    const request = async () => {
      calls++;
      throw error;
    };
    const uncertain = !status || status === 408 || status >= 500;
    await assert.rejects(action.run.call({
      acedatacloud: {
        request,
      },
      prompt: "song",
    }, {
      $: {},
    }),
    uncertain
      ? /status is unknown.*task history/
      : (actual) => actual === error);
    assert.equal(calls, 1);
  }
  for (const task_id of [
    undefined,
    "",
    "  ",
  ]) {
    let calls = 0;
    const request = async () => {
      calls++;
      return {
        task_id,
      };
    };
    await assert.rejects(action.run.call({
      acedatacloud: {
        request,
      },
      prompt: "song",
    }, {
      $: {},
    }),
    /no task ID.*task history/);
    assert.equal(calls, 1);
  }
});

test("invalid inputs are rejected before the paid request", async () => {
  const inputs = [
    [
      "generate-ace-music-song",
      {
        prompt: "song",
        model: "unsupported",
      },
    ],
    [
      "generate-ace-music-song-from-lyrics",
      {
        title: "Song",
        lyric: "  ",
        style: "folk",
      },
    ],
    [
      "import-ace-music-reference-mp3",
      {
        audio_url: "http://example.com/song.mp3",
      },
    ],
    [
      "cover-ace-music-track",
      {
        audio_id: "one",
        lyric,
        style: "folk",
        audio_influence: 0,
      },
    ],
    [
      "blend-ace-music-tracks",
      {
        first_audio_id: "one",
        second_audio_id: "one ",
        lyric,
        style: "folk",
      },
    ],
  ];
  for (const [
    slug,
    values,
  ] of inputs) {
    const action = await loadAction(slug);
    let calls = 0;
    const request = async () => { calls++; };
    await assert.rejects(action.run.call({
      ...values,
      acedatacloud: {
        request,
      },
    }, {
      $: {},
    }));
    assert.equal(calls, 0);
  }
});
