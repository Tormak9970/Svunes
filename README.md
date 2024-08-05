<h1 align="center">
  <a name="logo" href="https://svunes.org/"><img src="./public/github-banner.png" /></a>
</h1>

<p align="center">
  <a href="https://github.com/Tormak9970/svunes/releases"><img src="https://img.shields.io/github/v/release/Tormak9970/Svunes?label=version&style=flat-square" /></a>
  <img src="https://img.shields.io/github/downloads/Tormak9970/Svunes/total?style=flat-square" />
  <a href="https://www.gnu.org/licenses/gpl-3.0.en.html"><img src="https://img.shields.io/github/license/Tormak9970/Svunes?style=flat-square" /></a>
  <a href="https://crowdin.com/project/tunistic"><img src="https://img.shields.io/badge/-translate-brightgreen?style=flat-square&logo=Crowdin" /></a>
  <br>
  <br>
</p>

# Svunes

An offline-first music player for your music library. Allows you to make playlists, view artists/albums, and more! Made with Svelte, Tauri, Rust, and Material Design 3.

# Installation

<!-- TODO: Android -->
<!-- TODO: iOS -->
<!-- TODO: Windows -->
<!-- TODO: Linux -->
<!-- TODO: Mac -->

# Features

## Fast Load Times
Svunes leverages the performance of Rust and multi-threading to quickly load libraries with thousands of songs.

## Intuitive Navigation
You can browse by your albums, genres, artists, songs or search all of them. Its easy to customize the order of the navigation bar, as well as which pages are displayed.
| <img src="public/readme-images/home.png" width="200"/>	|<img src="public/readme-images/playlists.png" width="200"/>|   <img src="public/readme-images/search.png" width="200"/>  	|    <img src="public/readme-images/songs.png" width="200"/> 	|
|:-----:|   :-----:   | :-----:	|:-----:|
| Home 	| Playlists 	| Search 	| Songs |

| <img src="public/readme-images/albums.png" width="200"/>	|<img src="public/readme-images/artists.png" width="200"/>|   <img src="public/readme-images/genres.png" width="200"/>  	|    <img src="public/readme-images/settings.png" width="200"/> 	|
|:-----: | :-----:	| :-----:	| :-----:	  |
| Albums | Artists 	| Genres 	| Settings 	|

## Now Playing Themes
There are four different Now Playing Themes to pick from, as well as whether to use a solid, gradient, or blurred background.
| <img src="public/readme-images/np_normal_blurr.png" width="200"/>	|<img src="public/readme-images/np_card_gradient.png" width="200"/>|   <img src="public/readme-images/np_simple_solid.png" width="200"/>  	|    <img src="public/readme-images/np_full_solid.png" width="200"/> 	|
| :-----: |      :-----:      |    :-----:     |:-----: |
| Normal (Blurr) 	| Card (Gradient) 	| Simple (Solid) | Full 	|

## Other Features
 - Customize the look of Svunes by choosing the app's primary color
 - AMOLED Dark Theme

 - Apple CarPlay / Android Auto Support
 - Bulk Share your songs

 - Personalized Home screen

 - Driving Mode (with an option to start/stop automatically)
 - Sleep Timer
 - Volume Controls

 - Create your own playlists
 - Import/Export playlists

 - Tag Editing for Songs and Albums
 - Bulk Tag Editing
 - Filename -> Metadata Parser
 - Album Info and Cover Art Lookup (requires an internet connection)


# Frequently Asked Questions

**Q: Does Svunes report metrics or track anaylitics?**
No, everything stays on your device. The only tracking the app does is when songs have been played (for the History feature). This can be disabled in settings if you don't like it.

**Q: It says this is an offline music player, why does it need wifi for some features?**
The Album Info and Cover lookup require internet by nature, and are useful when trying to edit albums/songs.

# Translations
If you're native language (or a language you speak) is not currently supported, please consider contributing to Svunes's translations! You can help by heading to [https://crowdin.com/project/svunes](https://crowdin.com/project/svunes) and submitting translations. If a language is not listed there, please submit a GitHub issue and I will add it asap.


# Acknowledgements
APIs Used:
 - [MetaBrainz](https://beta.musicbrainz.org/doc/About) - Used for automatic song/album information lookup and covers.

References:
 - [How Spotify's Shuffle Works](https://engineering.atspotify.com/2014/02/how-to-shuffle-songs/) - An explanation of how pseudo-randomness can make shuffling feel more random.
 - [Metro](https://github.com/MuntashirAkon/Metro) - Inspired the UI scheme and the project as a whole.
 - [Svelte Md3](https://ktibow.github.io/m3-svelte/) - Many of the base components are heavily modified version of components from Svelte Md3.

Libraries:
 - [Material Icons](https://fonts.google.com/icons) - All of the app's icons came from here.
 - [Fontawesome Icons](https://fontawesome.com/) - The app's logo uses one of fontawesome's icons.

# License
 - This program is licensed under the [GNU General Public License Version 3](https://www.gnu.org/licenses/#GPL)
 - Additionally, if you use Svunes for any projects, add it to a package manager, etc, please let me know!
 - Lastly, please provide appropriate credit for code usage

Copyright Travis Lane