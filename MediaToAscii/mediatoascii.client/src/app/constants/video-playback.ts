export type VideoPlayback = {
  timeMs: number;
  playing: boolean;
  playbackRate: number;
};

export const INITIAL_VIDEO_PLAYBACK: VideoPlayback = {
  timeMs: 0,
  playing: false,
  playbackRate: 1,
};
