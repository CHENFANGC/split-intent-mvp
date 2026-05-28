import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import ffprobe from "ffprobe-static";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const demoDir = join(rootDir, "demo");
const generatedDir = join(demoDir, "generated", "clean-female");
const framesDir = join(demoDir, "generated", "frames");
const narrationDir = join(generatedDir, "voice");
const concatPath = join(generatedDir, "frames.txt");
const subtitlesPath = join(generatedDir, "subtitles-clean-female.ass");
const narrationPath = join(generatedDir, "narration-clean-female.m4a");
const baseVideoPath = join(generatedDir, "split-intent-demo-clean-female-nosubs.mp4");
const outputPath = join(demoDir, "split-intent-demo-clean-female.mp4");
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 3002;
const baseUrl = `http://127.0.0.1:${port}`;
const totalDuration = 240;
const voiceName = "Tingting";
const voiceRate = "150";

const sections = [
  {
    start: 0,
    end: 30,
    lines: [
      {
        spoken: "这条 demo，其实想讲一件很简单的事。参与者可以从不同链上付款；而收款人只需要说清楚，最后想收到什么。",
        zh: "Split Intent 展示的是一个很简单的 Intents 场景：参与者可以从不同链付款，但收款人只定义最终想收到什么。",
        en: "Split Intent shows a simple Intents flow: participants can pay from different chains, while the receiver defines the final outcome."
      },
      {
        spoken: "所以这里不是在展示一条很复杂的路线，而是在展示一个结果：多人付款，最后统一汇总成 Base 上的 USDC。",
        zh: "这个项目不是在展示一条复杂路线，而是在展示一个结果：多人付款，最终汇总成 Base 上的 USDC。",
        en: "This project does not focus on a complex route. It focuses on one result: many payments, one Base USDC outcome."
      }
    ]
  },
  {
    start: 30,
    end: 75,
    lines: [
      {
        spoken: "场景也很日常。我们拿一次羽毛球场地和球费 AA 来举例。",
        zh: "这里用羽毛球场地和球费 AA 作为背景。",
        en: "The demo uses a badminton court and shuttle split as the scenario."
      },
      {
        spoken: "组织者创建一笔收款，总额是一百二十六 USDC，六个人参与，每个人付二十一 USDC。",
        zh: "组织者创建一次收款，总额是 126 USDC，6 个人参与，每个人 21 USDC。",
        en: "The organizer creates one collection request: 126 USDC total, 6 players, 21 USDC each."
      },
      {
        spoken: "关键点在于，每个人的钱可能在不同链上；但组织者并不想处理这些差异，只想在一个目标链上收到一种资产。",
        zh: "每个参与者可能在不同链上有资金，但组织者希望最后只在一个目标链上收到一种资产。",
        en: "Each participant may have funds on a different chain, but the organizer wants one asset on one destination chain."
      }
    ]
  },
  {
    start: 75,
    end: 135,
    lines: [
      {
        spoken: "第一屏，是创建 split。组织者看到场地费、球费、人数、总额，以及每个人应该付多少。",
        zh: "第一屏是创建 split。组织者看到场地费、球费、人数、总额和每人应付金额。",
        en: "The first screen creates the split with court cost, shuttle cost, players, total, and per-person share."
      },
      {
        spoken: "第二屏，切到参与者付款。这个参与者从 Arbitrum 付钱，但收款结果始终固定为 Base USDC。",
        zh: "第二屏是参与者付款视角。参与者从 Arbitrum 付款，但 receiver outcome 固定为 Base USDC。",
        en: "The second screen is the participant view. The payer starts from Arbitrum, while the receiver outcome stays Base USDC."
      },
      {
        spoken: "第三屏就能看到，不同参与者来自不同链，但最后都会收敛到同一个 receiver outcome。",
        zh: "第三屏展示不同参与者来自不同链，但最终目标都是同一个 receiver outcome。",
        en: "The third screen shows participants from different chains converging into the same receiver outcome."
      }
    ]
  },
  {
    start: 135,
    end: 200,
    lines: [
      {
        spoken: "这也是 LI.FI Intents 最核心的地方：用户表达的是结果，而不是手动指定路径。",
        zh: "LI.FI Intents 的核心是表达结果，而不是指定路径。",
        en: "LI.FI Intents are about expressing outcomes, not manually choosing paths."
      },
      {
        spoken: "用户真正需要确认的只有两件事：我从这条链付款，收款人最终在 Base 收到 USDC。",
        zh: "用户只需要看到：我从这条链付款，收款人最终在 Base 收到 USDC。",
        en: "The user only needs to see: I pay from this chain, and the receiver gets USDC on Base."
      },
      {
        spoken: "App 里面接了 supported chains 和 routes 数据，用来说明这个流程不是纯静态概念，而是对接真实网络能力。",
        zh: "App 使用 supported chains 和 routes 数据来证明这个 flow 对接真实网络能力。",
        en: "The app uses supported chains and routes data to ground the flow in live network capability."
      }
    ]
  },
  {
    start: 200,
    end: 240,
    lines: [
      {
        spoken: "当前版本为了演示稳定，quote 和 settlement 先用 preview lifecycle 来表达。",
        zh: "当前版本为了演示稳定性，quote 和 settlement 使用 preview lifecycle。",
        en: "For demo reliability, quote and settlement use a preview lifecycle in this version."
      },
      {
        spoken: "下一步，就可以继续接真实 quote、钱包签名、order submission，以及状态追踪。",
        zh: "下一步可以接入真实 quote、钱包签名、order submission 和 status tracking。",
        en: "The next step is real quote requests, wallet signing, order submission, and status tracking."
      },
      {
        spoken: "我想表达的是：Intents 可以让跨链支付更像一句简单的结果声明，而不是一张复杂的路线图。",
        zh: "Intents 可以让跨链支付更像一个简单的结果声明，而不是一张复杂的路线图。",
        en: "Intents can make cross-chain payments feel like a simple outcome statement, not a complex route map."
      }
    ]
  }
];

const visualScenes = [
  { screen: "create", frame: "create.png", duration: 95 },
  { screen: "pay", frame: "pay.png", duration: 25 },
  { screen: "settled", frame: "settled.png", duration: 80 },
  { screen: "settled", frame: "boundary.png", duration: 40 }
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: "inherit",
    ...options
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
}

function runQuiet(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: "utf8",
    ...options
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || `${command} ${args.join(" ")} failed`);
  }

  return result.stdout.trim();
}

function getDuration(filePath) {
  return Number(
    runQuiet(ffprobe.path, [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath
    ])
  );
}

function waitForServer(url, timeoutMs = 20000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const result = spawnSync("curl", ["-fsS", url], { encoding: "utf8" });
    if (result.status === 0) return;
    spawnSync("sleep", ["0.5"]);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function formatAssTime(seconds) {
  const centiseconds = Math.round(seconds * 100);
  const cs = centiseconds % 100;
  const totalSeconds = Math.floor(centiseconds / 100);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function assEscape(text) {
  return text.replace(/\\/g, "\\\\").replace(/\{/g, "\\{").replace(/\}/g, "\\}");
}

function createSpeech(line, index) {
  const textPath = join(narrationDir, `line-${String(index).padStart(2, "0")}.txt`);
  const audioPath = join(narrationDir, `line-${String(index).padStart(2, "0")}.aiff`);
  writeFileSync(textPath, `${line.spoken ?? line.zh}\n`);
  const existingDuration = existsSync(audioPath) ? getDuration(audioPath) : 0;
  if (!Number.isFinite(existingDuration) || existingDuration < 1) {
    rmSync(audioPath, { force: true });
    run("say", ["-v", voiceName, "-r", voiceRate, "-o", audioPath, "-f", textPath]);
  }
  return { ...line, audioPath, duration: getDuration(audioPath) };
}

function buildCues(spokenLines) {
  let lineIndex = 0;

  return sections.flatMap((section) => {
    const sectionLines = section.lines.map(() => spokenLines[lineIndex++]);
    const speechDuration = sectionLines.reduce((sum, line) => sum + line.duration, 0);
    const gap = Math.max(0.8, (section.end - section.start - speechDuration) / (sectionLines.length + 1));
    let cursor = section.start + gap;

    return sectionLines.map((line, index) => {
      const cueStart = cursor;
      const speechEnd = cueStart + line.duration;
      const nextStart = index === sectionLines.length - 1 ? section.end : speechEnd + gap;
      const cueEnd = Math.min(section.end, nextStart - 0.2);
      cursor = nextStart;
      return { ...line, start: cueStart, end: cueEnd };
    });
  });
}

function createSubtitles(cues) {
  const events = cues.map(
    (cue) =>
      `Dialogue: 0,${formatAssTime(cue.start)},${formatAssTime(cue.end)},Default,,0,0,0,,${assEscape(cue.zh)}\\N${assEscape(cue.en)}`
  );

  return `[Script Info]
ScriptType: v4.00+
PlayResX: 720
PlayResY: 1280
ScaledBorderAndShadow: yes
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,21,&H00FFFFFF,&H00FFFFFF,&H00151515,&HAA151515,-1,0,0,0,100,100,0,0,1,3,0,2,34,34,48,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${events.join("\n")}
`;
}

function takeScreenshot(scene) {
  const output = join(framesDir, scene.frame);
  run(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=720,1280",
    "--force-device-scale-factor=1",
    "--virtual-time-budget=5000",
    `--screenshot=${output}`,
    `${baseUrl}?demoScreen=${scene.screen}`
  ]);
}

function createFrames() {
  const hasAllFrames = visualScenes.every((scene) => existsSync(join(framesDir, scene.frame)));
  if (hasAllFrames) return;

  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });
  run("pnpm", ["exec", "next", "build"]);

  const server = spawn("pnpm", ["exec", "next", "start", "-p", String(port)], {
    cwd: rootDir,
    stdio: "ignore"
  });

  try {
    waitForServer(baseUrl);
    visualScenes.forEach(takeScreenshot);
  } finally {
    server.kill("SIGTERM");
  }
}

function createFramesConcat() {
  const lines = visualScenes.flatMap((scene) => {
    const framePath = join(framesDir, scene.frame);
    if (!existsSync(framePath)) throw new Error(`Missing frame ${framePath}`);
    return [`file '${framePath.replace(/'/g, "'\\''")}'`, `duration ${scene.duration}`];
  });
  const lastFrame = join(framesDir, visualScenes.at(-1).frame);
  lines.push(`file '${lastFrame.replace(/'/g, "'\\''")}'`);
  writeFileSync(concatPath, `${lines.join("\n")}\n`);
}

function createNarration(cues) {
  const audioConcatPath = join(generatedDir, "audio-parts.txt");
  const parts = [];
  let cursor = 0;

  cues.forEach((cue, index) => {
    const silenceDuration = Math.max(0, cue.start - cursor);
    if (silenceDuration > 0.02) {
      const silencePath = join(generatedDir, `silence-${String(index).padStart(2, "0")}.wav`);
      run(ffmpegPath, [
        "-y",
        "-f",
        "lavfi",
        "-i",
        `anullsrc=channel_layout=mono:sample_rate=44100`,
        "-t",
        silenceDuration.toFixed(3),
        "-c:a",
        "pcm_s16le",
        silencePath
      ]);
      parts.push(silencePath);
    }

    const normalizedSpeechPath = join(generatedDir, `speech-${String(index).padStart(2, "0")}.wav`);
    run(ffmpegPath, [
      "-y",
      "-i",
      cue.audioPath,
      "-af",
      "aresample=44100",
      "-ac",
      "1",
      "-ar",
      "44100",
      "-c:a",
      "pcm_s16le",
      normalizedSpeechPath
    ]);
    parts.push(normalizedSpeechPath);
    cursor = cue.start + cue.duration;
  });

  const tailSilenceDuration = Math.max(0, totalDuration - cursor);
  if (tailSilenceDuration > 0.02) {
    const tailSilencePath = join(generatedDir, "silence-tail.wav");
    run(ffmpegPath, [
      "-y",
      "-f",
      "lavfi",
      "-i",
      "anullsrc=channel_layout=mono:sample_rate=44100",
      "-t",
      tailSilenceDuration.toFixed(3),
      "-c:a",
      "pcm_s16le",
      tailSilencePath
    ]);
    parts.push(tailSilencePath);
  }

  writeFileSync(audioConcatPath, `${parts.map((part) => `file '${part.replace(/'/g, "'\\''")}'`).join("\n")}\n`);

  run(ffmpegPath, [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    audioConcatPath,
    "-t",
    String(totalDuration),
    "-ac",
    "1",
    "-ar",
    "44100",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-ar",
    "44100",
    narrationPath
  ]);
}

function createVideo() {
  const escapedSubtitles = subtitlesPath.replace(/'/g, "'\\''");
  run(ffmpegPath, [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatPath,
    "-i",
    narrationPath,
    "-vf",
    "setpts=PTS-STARTPTS,scale=720:1280",
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-r",
    "30",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    "-ar",
    "44100",
    "-shortest",
    baseVideoPath
  ]);

  run(ffmpegPath, [
    "-y",
    "-i",
    baseVideoPath,
    "-vf",
    `subtitles='${escapedSubtitles}'`,
    "-map",
    "0:v:0",
    "-map",
    "0:a:0",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-r",
    "30",
    "-c:a",
    "copy",
    outputPath
  ]);
}

function main() {
  if (!ffmpegPath || !existsSync(ffmpegPath)) throw new Error("ffmpeg-static binary is unavailable");
  mkdirSync(generatedDir, { recursive: true });
  mkdirSync(narrationDir, { recursive: true });

  const spokenLines = sections.flatMap((section) => section.lines).map(createSpeech);
  const cues = buildCues(spokenLines);

  writeFileSync(subtitlesPath, createSubtitles(cues));
  createFrames();
  createFramesConcat();
  createNarration(cues);
  createVideo();

  console.log(`Wrote ${outputPath}`);
  console.log(`Duration ${getDuration(outputPath).toFixed(2)}s`);
}

main();
