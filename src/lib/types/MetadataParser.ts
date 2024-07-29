export type ParseResult = {
  songId: string;
  fileName: string;
  title?: string;
  album?: string;
  artist?: string;
  albumArtist?: string;
  track?: number;
  genre?: string;
  year?: number;
}