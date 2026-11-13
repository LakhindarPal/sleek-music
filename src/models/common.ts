import LANGUAGES from "src/consts/languages";
import QUALITIES from "src/consts/qualities";

export enum MediaType {
  Artist = "artist",
  Radio = "radio_station",
  Album = "album",
  Playlist = "playlist",
  Song = "song",
  Mix = "mix",
  Channel = "channel",
}

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
export type Quality = (typeof QUALITIES)[number];

export interface Module<T = undefined> {
  source: string;
  position: number;
  score?: string;
  bucket?: string;
  scroll_type: "Cells_Standard" | "SS_Basic" | "SS_Condensed" | "SS_Condensed_Double";
  title: string;
  subtitle?: string;
  highlight: null;
  simpleHeader: boolean;
  noHeader: boolean;
  source_api?: boolean;
  source_params?: T;
  view_more?:
    | {
        api: string;
        page_param: "p";
        size_param: "n";
        default_size: number;
        scroll_type: "SS_Basic_Double";
      }
    | [];
  is_JT_module: false;
}
