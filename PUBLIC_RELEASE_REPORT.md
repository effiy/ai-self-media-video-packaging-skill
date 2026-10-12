# Public-lite 0.3.0 verification

## Current scope

New CLI jobs default to public-lite: three basic layouts (title/card/flow), two styles (dark/paper), optional bounded 1.06x presenter emphasis, original continuous voice, complete source-based captions and artifact verification. No learner multi-window or complex choreography templates were copied. Historical V2 code remains readable and stays accessible in Git history.

The approximately 70% positioning is an intended capability split, not a measured aesthetic score or user acceptance.

## Verification performed

- 108 automated tests passed; TypeScript checks, composition build, Skill format and public-file scan passed.
- Refreshed vulnerable transitive dependencies and Vitest to 4.1.11; npm audit reports zero vulnerabilities. Overlay argument tests accept native path separators on Windows and Linux.
- Real local comparison used the same original video and SRT as the learner delivery, verified against their recorded hashes.
- Public-lite output: 1920x1080, 30fps, H.264/AAC, 1197 video frames, 39.914667 seconds, one audio track.
- Output SHA-256: `43B81A03FDC78799F3ACC318848E71847E3FAF9BE6EC2EC26DD58051A7BEAF5D`.
- All three layouts were used with one consistent palette. Dark and paper style stills and a 1280x720 still were checked.
- Full FFmpeg decode passed; no black intervals detected. All layout stills, eight timeline samples and first/last frames were inspected.
- No full continuous playback review or user acceptance is claimed. Private comparison videos, source files, subtitles and screenshots remain outside the public candidate set.

## Historical report

The following report describes the old release, not the current public-lite output.

# Public release report

## Scope

- Repository target: `zhouyuechuan2025-ui/ai-self-media-video-packaging-skill`.
- Visibility target: public.
- Default renderer: Remotion.
- Optional adapter: HyperFrames.
- Public capabilities: 18 visual structures, 10 deterministic motion primitives, and 6 programmatic line-illustration scenarios.
- Workflow: plan first, wait for explicit confirmation, then implement; export remains separately gated.

## Real invocation evidence

- Case: `auto-editing-0`.
- Source video: 49.272993 seconds, HEVC/AAC, 1920×1080, 30fps.
- SRT: 21 cues; burned-in subtitle mode.
- Director plan: 21 beats, 6 palettes, 13 structures, 9 left placements, 8 right placements, and 4 short full-screen placements.
- Final local output: H.264/AAC, 1920×1080, 30fps, 49.322667 seconds, 38,520,178 bytes.
- Output SHA-256: `57D909FAABE95A68862C0418A4E110EC9BD557B79D3FDEE07FC0545C847679A8`.
- Full FFmpeg decode: pass.
- Black-frame scan: no black interval detected.
- Six README previews and a ten-frame contact sheet: extracted from that exact output and individually hashed in `examples/auto-editing-0/preview-manifest.json`.

The source MP4, source SRT, full output MP4, local paths, and private assets are intentionally absent from the public candidate set.

## Independent renderer checks

### Remotion

- Real authorized case render: pass.
- Repository synthetic fixture render: pass, 120/120 frames.
- Composition discovery/build: pass.

### HyperFrames 0.7.99

- Generated from the repository synthetic fixture.
- Lint: 0 errors, 0 warnings.
- Dynamic check: `ok=true` using installed system Chrome after the bundled headless shell failed to launch on this Windows host.
- Runtime: 0 errors.
- Layout: 9 samples, 0 findings.
- Motion: enabled, 81 samples, 0 findings.
- Contrast: 10/10 passed.
- Snapshots: 5 generated, 0 finding crops.

## Publication safety

- Public candidate scan checks source media, local absolute paths, credentials, private keys, files over 20MB, unfinished markers, and non-public terminology.
- Production dependencies audit: 0 vulnerabilities.
- README final line is locked by test to the approved current business WeChat `nanaya093`.
- Original media is ignored and not present in Git candidates.
- Repository stays `private: true` at the npm package level to prevent accidental npm publication; this does not affect GitHub visibility.

## Current state

Published publicly at <https://github.com/zhouyuechuan2025-ui/ai-self-media-video-packaging-skill>.

- Initial public commit: `4e5d98a595f98d8b387cf0e8476df2d9c159d3b2`.
- Default branch: `main`.
- Repository visibility: public.
- Remote read-back: completed for the repository metadata, README, `SKILL.md`, package manifest, real-case preview manifest, and public file tree.
- Publication boundary: pushed to GitHub only; not deployed, released to npm, or published elsewhere.
