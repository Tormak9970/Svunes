export type Tag = {
  count: number;
  name: string;
}


export type MediaTrack = {
  id: string;
  title: string;
  number: string;
  recording: ReleaseRecording;
  "artist-credit": ArtistInfo[];
}

export type Media = {
  tracks: MediaTrack[];
  format: string;
  "disc-count": number;
  "track-count": number;
  title: string;
  "format-id": string;
}


export type ArtistAlias = {
  name: string;
  "sort-name": string;
  locale?: string;
  type?: string;
  primary?: string;
  "begin-date"?: string;
  "end-date"?: string;
}

export type ArtistInfo = {
  name?: string;
  artist: {
    id: string;
    name: string;
    "sort-name": string;
    disambiguation: string;
    aliases: ArtistAlias[];
  }
}


export type ReleaseGroupRelease = {
  id: string;
  title: string;
  status: string;
  "status-id": string;
}

export type ReleaseGroup = {
  id: string;
  title: string;
  "primary-type": string;
  "primary-type-id": string;
  releases: ReleaseGroupRelease[];
}

export type ReleaseGroupResponse = {
  created: string;
  count: number;
  offset: number;
  "release-groups": ReleaseGroup[];
}


export type ReleaseEvent = {
  date: string;
  area: {
    id: string;
    name: string;
    "sort-name": string;
    "iso-3166-1-codes": string[];
  }
}

export type ReleaseRecording = {
  id: string;
  title: string;
  "artist-credit": ArtistInfo[];
  "first-release-date": string;
}

export type Release = {
  id: string;
  score: number;
  count: number;
  title: string;
  "status-id": string;
  status: string;
  packaging: string;
  "text-representation": {
    language: string;
    script: string;
  };
  "cover-art-archive": {
    count: number;
    back: boolean;
    artwork: boolean;
    front: boolean;
    darkened: boolean;
  };
  "artist-credit": ArtistInfo[];
  "release-group": {
    id: string;
    "primary-type": string;
  };
  date: string;
  country: string;
  "release-events": ReleaseEvent[];
  "track-count": number;
  media: Media[];
  tags: Tag[];
}


export type RecordingRelease = {
  id: string;
  score: number;
  count: number;
  title: string;
  "status-id": string;
  status: string;
  "artist-credit": ArtistInfo[];
  "release-group": {
    id: string;
    "primary-type": string;
  };
  date: string;
  country: string;
  "release-events": ReleaseEvent[];
  "track-count": number;
  media: Media[];
  tags: Tag[];
}

export type Recording = {
  id: string;
  score: number;
  title: string;
  length: number;
  "artist-credit": ArtistInfo[];
  releases: RecordingRelease[];
}

export type RecordingResponse = {
  created: string;
  count: number;
  offset: number;
  recordings: Recording[];
  "artist-credit": ArtistInfo[];
  "first-release-date": string;
  tags: Tag[];
}