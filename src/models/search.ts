import type { Language, MediaType } from "./common";
import type { AlbumBase, AlbumResult, ArtistResult, PlaylistResult, Song } from "./music";

export interface TopSearchItem {
  id: string;
  title: string;
  subtitle: string;
  type: "song" | "album" | "artist";
  image: string;
  perma_url: string;
  more_info: {
    artistMap: [];
    album: string;
  };
  is_jiotune_available: "true" | "false";
  explicit_content: "0" | "1";
  mini_obj: true;
}

export interface AutoSearchResponse {
  albums: Albums;
  songs: Songs;
  playlists: Playlists;
  artists: Artists;
  topquery: TopQuery;
  shows: Shows;
  episodes: Albums;
}

interface Albums {
  data: AutoSearchAlbum[];
  position: number;
}

export interface AutoSearchAlbum extends Omit<
  AlbumBase,
  "language" | "more_info" | "button_tooltip_info"
> {
  description: string;
  mini_obj: "true" | "false";
  more_info: SearchAlbumMoreInfo;
}

interface SearchAlbumMoreInfo {
  music: string;
  ctr: number;
  year: string;
  is_movie: "1" | "0";
  language: Language;
  song_pids: string; //comma separated
}

interface Artists {
  data: AutoSearchArtist[];
  position: number;
}

export interface AutoSearchArtist {
  id: string;
  title: string;
  image: string;
  extra: string;
  type: MediaType.Artist;
  mini_obj: boolean;
  isRadioPresent: boolean;
  ctr: number;
  entity: number;
  description: string;
  position: number;
}

interface Playlists {
  data: AutoSearchPlaylist[];
  position: number;
}

export interface AutoSearchPlaylist extends Omit<
  AlbumBase,
  "language" | "more_info" | "button_tooltip_info" | "list_count" | "list"
> {
  description: string;
  mini_obj: "true" | "false";
  more_info: SearchPlaylistMoreInfo;
}

interface SearchPlaylistMoreInfo {
  firstname: "Saavn" | string;
  artist_name: null;
  entity_type: MediaType.Playlist;
  entity_sub_type: string;
  video_available: boolean;
  is_dolby_content: boolean;
  sub_types: null;
  images: null;
  lastname: "Editor" | string;
  language: Language;
}

interface Shows {
  data: AutoSearchShow[];
  position: number;
}

export interface AutoSearchShow {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  image: string;
  perma_url: string;
  more_info: SearchShowsMoreInfo;
  explicit_content: string;
  mini_obj: boolean;
  description: string;
}

interface SearchShowsMoreInfo {
  season_number: number;
}

interface Songs {
  data: AutoSearchSong[];
  position: number;
}

export interface AutoSearchSong extends Omit<
  Song,
  "language" | "year" | "play_count" | "list_count" | "more_info" | "button_tooltip_info"
> {
  mini_obj: boolean;
  description: string;
  more_info: SearchSongMoreInfo;
}

interface SearchSongMoreInfo {
  album: string;
  album_id: string;
  ctr: 1452;
  score: string;
  vcode: string;
  vlink: string;
  primary_artists: string;
  singers: string;
  video_available: null;
  triller_available: boolean;
  language: Language;
}

interface TopQuery {
  data: AutoSearchTopItem[];
  position: number;
}

export type AutoSearchTopItem =
  | AutoSearchSong
  | AutoSearchAlbum
  | AutoSearchPlaylist
  | AutoSearchShow;

export interface SearchAlbumResponse {
  total: number;
  start: number;
  results: AlbumResult[];
}

export interface SearchSongResponse {
  total: number;
  start: number;
  results: Song[];
}

export interface SearchPlaylistResponse {
  total: number;
  start: number;
  results: PlaylistResult[];
}

export interface SearchArtistResponse {
  total: number;
  start: number;
  results: ArtistResult[];
}
