export const baseUrl = "https://www.jiosaavn.com/api.php";

export const defaultParams = {
  ctx: "wap6dot0", // or "android"
  api_version: 4,
  _format: "json",
  _marker: 0,
};

export const sources: Record<string, string> = {
  song_detail: "__call=webapi.get&type=song&includeMetaTags=0",
  song_reco: "__call=reco.getreco",
  artist_songs: "__call=search.artistOtherTopSongs",
  actor_songs: "__call=search.actorOtherTopSongs",
  song_lyrics: "__call=lyrics.getLyrics",
  album_detail: "__call=webapi.get&type=album",
  album_reco: "__call=reco.getAlbumReco",
  year_albums: "__call=search.topAlbumsoftheYear",
  artist_overview: "__call=webapi.get&type=artist&includeMetaTags=0",
  playlist_detail: "__call=webapi.get&type=playlist&p=1&n=50&includeMetaTags=0",
  playlist_reco: "__call=reco.getPlaylistReco",
  mix_detail: "__call=webapi.get&type=mix&p=1&n=50&includeMetaTags=0",
  launch_data: "__call=webapi.getLaunchData",
  featured_playlists:
    "__call=content.getFeaturedPlaylists&fetch_from_serialized_files=true&p=1&n=50",
  latest_data: "__call=content.getAlbums&n=50&p=1",
  trending_data: "__call=content.getTrending",
  top_searches: "__call=content.getTopSearches",
  auto_search: "__call=autocomplete.get",
  song_search: "__call=search.getResults&n=20",
  album_search: "__call=search.getAlbumResults&n=20",
  playlist_search: "__call=search.getPlaylistResults&n=20",
  artist_search: "__call=search.getArtistResults&n=20",
  entity_station: "__call=webradio.createEntityStation&entity_type=queue&ctx=android",
  radio_songs: "__call=webradio.getSong&k=5&next=0&ctx=android",
};
