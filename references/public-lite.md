# Public Lite boundary

New CLI jobs set `edition: public-lite`. Source timing, continuous voice, caption modes, face protection and artifact QA remain intact. Three layouts are available: `title` (one headline on an opaque background), `card` (one compact presenter-safe side card), and `flow` (two or three literal source items in simple cards, without invented steps).

Styles are `dark` and `paper`, fixed for the entire video. Layered art direction, flexible split screens, offset double windows, presenter-window handoffs, 3D layouts, integrated drawings and complex choreography stay outside the current public product.

The capability split derives from the learner edition's workflow. Its private templates, installer, recordings and subtitles are not redistributed. Approximately 70% is an intended product position, not a computed result. Compare the same source locally; publication does not include private media unless separately authorized.

## Captions and camera

Default camera `off` leaves source framing unchanged. `--presenter-motion subtle` on composite MP4 applies a 1.06× deterministic focus pulse to side-card beats, returning to 1× at both rounded beat boundaries. Short beats remain still. There is one continuous video/audio track; no blending of differently scaled body images.

With `burned-in`, source captions are clipped during the enabled camera treatment and redrawn once from the current SRT. Opaque title/flow scenes also redraw covered captions in composite output. Generated captions explicitly use the SRT; `none` adds none. Confirm SRT accuracy and alignment before rendering. Reserve the bottom 18%. Source movement is rejected for transparent output.

New public-lite jobs require Remotion. Historical V2 storyboards without the `edition` field retain their original renderer; capabilities already published cannot be recalled from Git history. The HyperFrames adapter remains for those historical inputs, without silently dropping public-lite features.

## QA

Eight review frames sample the timeline rather than requiring eight structures. Inspect every layout actually used, first/last frames, movement entry/peak/return, transitions, complete caption text and original face color. Technical checks and full decode do not prove full playback review or user acceptance.

For an engineering check use `npm run make:synthetic` then `npm run verify:lite`. A private comparison can use `npm run verify:lite -- INPUT.mp4 INPUT.srt OUTPUT` with a new local output folder. The helper renders a real dark-style video, both-style review stills, full decode, black-frame detection and a contact sheet. Outputs default to ignored `.tmp/`; do not commit private input media or comparison frames. Engineering tests do not replace production job approvals. Public-lite currently supports 16:9 horizontal input only.
