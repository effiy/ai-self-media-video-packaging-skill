import type {CSSProperties, ReactElement} from 'react';
import {Video} from '@remotion/media';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import type {Storyboard, StoryboardBeat} from '../../core/src/schema';
import type {SrtCue} from '../../core/src/types';

type Rect = {x: number; y: number; w: number; h: number; r: number};
type Mode = NonNullable<StoryboardBeat['liteDirection']>['mode'];
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => {const t = clamp(n); return t * t * (3 - 2 * t);};
const out = (n: number) => 1 - (1 - clamp(n)) ** 4;
const full: Rect = {x: 0, y: 0, w: 1920, h: 886, r: 0};
const rectFor = (mode: Mode): Rect => mode === 'hero' ? {x: 96, y: 156, w: 760, h: 704, r: 24}
  : mode === 'split' ? {x: 1032, y: 156, w: 792, h: 704, r: 24}
  : mode === 'process' ? {x: 1256, y: 240, w: 568, h: 620, r: 24} : full;
export const presenterMode = (beat: StoryboardBeat, index: number, count: number): Mode =>
  beat.liteDirection?.mode ?? (index === 0 ? 'hero' : index === count - 1 ? 'closing' : beat.liteLayout === 'flow' ? 'process' : index % 2 ? 'focus' : 'split');

/** One continuously mounted media element; rectangle changes never restart its clock. */
export const presenterRectAt = (s: Storyboard, frame: number): Rect => {
  let index = s.beats.findIndex((b) => frame >= Math.round(b.start * s.fps) && frame < Math.round(b.end * s.fps));
  if (index < 0) index = s.beats.length - 1;
  const beat = s.beats[index]; const mode = presenterMode(beat, index, s.beats.length);
  const before = index ? rectFor(presenterMode(s.beats[index - 1], index - 1, s.beats.length)) : full;
  const target = rectFor(mode);
  const transitionFrames = Math.min(s.fps * .45, (beat.end - beat.start) * s.fps * .28);
  const k = smooth((frame - Math.round(beat.start * s.fps)) / Math.max(1, transitionFrames));
  return {x: before.x + (target.x - before.x) * k, y: before.y + (target.y - before.y) * k,
    w: before.w + (target.w - before.w) * k, h: before.h + (target.h - before.h) * k,
    r: before.r + (target.r - before.r) * k};
};
const weight = (text: string) => Array.from(text).reduce((n, char) => n + (char.charCodeAt(0) > 255 ? 1 : .58), 0);
const fontSize = (text: string, width: number, maximum: number) => Math.max(20, Math.min(maximum, Math.floor(width / Math.max(1, weight(text)))));
const font = '"Microsoft YaHei","Noto Sans SC",Arial,system-ui,sans-serif';

const Emphasis = ({lines, highlight, width, size, local, fps, color, ink}: {
  lines: string[]; highlight: number; width: number; size: number; local: number; fps: number; color: string; ink: string;
}) => <div style={{width}}>{lines.map((text, index) => {
  const k = out((local - fps * (.28 + index * .11)) / (fps * .38));
  return <div key={index} style={{overflow: 'hidden', paddingBottom: 12}}>
    <div style={{fontSize: fontSize(text, width, size), fontWeight: 900, lineHeight: 1.2, letterSpacing: '-.035em',
      color: index === highlight ? color : ink, whiteSpace: 'nowrap', transform: `translateY(${(1 - k) * 108}%)`}}>{text}</div>
  </div>;
})}</div>;

export const EditorialPresenterVideo = ({storyboard: s, cues}: {storyboard: Storyboard; cues: SrtCue[]}): ReactElement => {
  const frame = useCurrentFrame();
  if (s.captionsMode !== 'none' && !cues.length) throw new Error('Presenter layouts require matching SRT captions');
  let index = s.beats.findIndex((b) => frame >= Math.round(b.start * s.fps) && frame < Math.round(b.end * s.fps));
  if (index < 0) index = s.beats.length - 1;
  const beat = s.beats[index]; const mode = presenterMode(beat, index, s.beats.length);
  const local = frame - Math.round(beat.start * s.fps);
  const duration = Math.round((beat.end - beat.start) * s.fps);
  const leave = index === s.beats.length - 1 ? 1 : smooth((duration - local) / (s.fps * .16));
  const ready = out((local - s.fps * .22) / (s.fps * .28)) * leave;
  const paper = s.publicStyle === 'paper';
  const c = paper ? {bg: '#F3F1FA', panel: '#FFFFFF', ink: '#201D32', muted: '#615974', main: '#6342C7', sub: '#007477', line: '#D5CEE5'}
    : {bg: '#080B16', panel: '#151A2D', ink: '#F6F7FF', muted: '#ADB6CF', main: '#B7A1FF', sub: '#58E1FF', line: '#2B344E'};
  const rect = presenterRectAt(s, frame);
  const focus = mode === 'focus' && s.liteCamera ? .06 * Math.min(smooth(local / (s.fps * .4)), smooth((duration - 1 - local) / (s.fps * .4))) : 0;
  const sourceScale = Math.max(rect.w / 1920, rect.h / 886) * (1 + focus);
  const videoWidth = 1920 * sourceScale; const videoHeight = 1080 * sourceScale;
  const direction = beat.liteDirection;
  const lines = direction?.lines ?? (beat.liteLayout === 'flow' ? (beat.liteItems ?? []).map((text) => Array.from(text).slice(0, 24).join('')) : [beat.content.structure === 'thesis-and-proof' ? beat.content.thesis : beat.text]);
  const label = direction?.eyebrow ?? '';
  const cue = cues.find((q) => q.start <= frame / s.fps && q.end > frame / s.fps);
  const textStyle: CSSProperties = {position: 'absolute', opacity: ready, zIndex: 3};
  const x = mode === 'hero' ? 984 : 120;
  const width = mode === 'hero' ? 820 : mode === 'focus' || mode === 'closing' ? 500 : 820;
  return <AbsoluteFill style={{width: 1920, height: 1080, right: 'auto', bottom: 'auto', transform: `scale(${s.width / 1920})`,
    transformOrigin: '0 0', background: c.bg, overflow: 'hidden', fontFamily: font, color: c.ink}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at ${75 + Math.sin(frame / 150) * 5}% 20%, ${c.main}20, transparent 58%), radial-gradient(ellipse at 15% 82%, ${c.sub}12, transparent 60%)`}}/>
    <svg width="1920" height="886" style={{position: 'absolute', left: 0, top: 0}} aria-hidden>
      {Array.from({length: 13}, (_, i) => <line key={i} x1={i * 160} x2={i * 160} y1="0" y2="886" stroke={c.line} opacity=".3"/>)}
      <path d="M96 660 Q840 110 1824 240" fill="none" stroke={c.main} strokeWidth="1" opacity=".18"/>
      <path d="M96 790 Q1180 420 1824 770" fill="none" stroke={c.sub} strokeWidth="1" opacity=".16"/>
    </svg>
    <div style={{position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, borderRadius: rect.r,
      overflow: 'hidden', zIndex: 2, boxShadow: rect.r ? '0 32px 80px #00000050' : undefined,
      outline: rect.r ? `1px solid ${c.line}` : undefined}}>
      <Video src={staticFile(s.source.video)} disallowFallbackToOffthreadVideo
        style={{position: 'absolute', width: videoWidth, height: videoHeight,
          left: (rect.w - videoWidth) / 2, top: -focus * 250, maxWidth: 'none'}}/>
    </div>
    <div style={{position: 'absolute', left: 96, right: 96, top: 58, display: 'flex', justifyContent: 'space-between',
      fontSize: 20, letterSpacing: '.12em', color: c.muted, zIndex: 4, opacity: ready,
      textShadow: mode === 'focus' || mode === 'closing' ? '0 2px 10px #000' : undefined}}>
      <span style={{color: mode === 'focus' || mode === 'closing' ? '#FFFFFF' : c.muted}}>{String(index + 1).padStart(2, '0')} / {String(s.beats.length).padStart(2, '0')}</span>
      <span style={{color: c.main}}>{label}</span>
    </div>
    {mode === 'process' ? <div style={{...textStyle, left: 120, top: 226, width: 1000}}>
      <div style={{height: 4, width: 130 * ready, background: c.main, marginBottom: 32}}/>
      {lines.map((text, i) => {
        const k = out((local - s.fps * (.3 + i * .14)) / (s.fps * .36));
        return <div key={i} style={{display: 'flex', alignItems: 'center', gap: 32, borderBottom: `1px solid ${c.line}`,
          padding: '26px 0', opacity: k, transform: `translateX(${(1 - k) * -40}px)`}}>
          <span style={{fontSize: 24, color: c.sub}}>0{i + 1}</span>
          <div style={{fontSize: fontSize(text, 820, 100), fontWeight: 900, lineHeight: 1.22, whiteSpace: 'nowrap', color: i === (direction?.highlight ?? lines.length - 1) ? c.main : c.ink}}>{text}</div>
        </div>;
      })}
    </div> : <div style={{...textStyle, left: x, top: mode === 'closing' ? 640 : mode === 'focus' ? 230 : 285,
      ...(mode === 'focus' || mode === 'closing' ? {background: `${c.bg}ED`, padding: 30, borderLeft: `4px solid ${c.main}`, borderRadius: '0 16px 16px 0'} : {})}}>
      {label && <div style={{fontSize: 24, color: c.sub, marginBottom: 28, letterSpacing: '.04em'}}>{label}</div>}
      <Emphasis lines={lines} highlight={direction?.highlight ?? lines.length - 1} width={width} size={mode === 'focus' || mode === 'closing' ? 74 : 132}
        local={local} fps={s.fps} color={c.main} ink={c.ink}/>
      <div style={{width: 160 * ready, height: 4, background: c.main, marginTop: 28}}/>
    </div>}
    <div style={{position: 'absolute', left: 96, right: 96, top: 914, height: 2, background: c.line, zIndex: 4}}>
      <div style={{height: '100%', width: `${clamp(frame / (Math.ceil(s.duration * s.fps) - 1)) * 100}%`, background: c.main}}/>
    </div>
    {s.captionsMode !== 'none' && cue ? <div style={{position: 'absolute', left: '5%', right: '5%', bottom: 25, textAlign: 'center', zIndex: 5}}>
      <span style={{display: 'inline-block', maxWidth: '100%', background: c.panel, color: c.ink, borderRadius: 14,
        padding: '16px 28px', fontSize: fontSize(cue.text, 1670, 46), fontWeight: 700, lineHeight: 1.3}}>{cue.text}</span>
    </div> : null}
  </AbsoluteFill>;
};
