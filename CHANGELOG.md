# Changelog

## [1.7.0] - 2017-07-28
### Added
- DJs have the ability to bypass the playlist queue limit with `[-number]` for a specific ammount or `[-full]` for the whole playlist

### Changed
- `.play` and `.playlist` now return 10 results
- AutoMode now looks for 4 relevant songs rather than 8

### Removed
- The ability to queue playlists with `.play`, use `.playlist` instead

### Fixed
- `.play` and `.playlist` showing incorrect selection number bracket


## [1.6.1] - 2017-07-28
### Changed
- Version is now displayed on profile along with the `.help` command
- `.changelog` now also shows unreleased versions and defaults to current released one

### Fixed
- Missing mention in `.queue` if bot queues song due to AutoMode


## [1.6.0] - 2017-07-28
### Added
- `.changelog` command. Check bot's changes in each released version
- `.changelog` in aliases, `.cl`
- `.play` Regex for future use
- Bot self restarts if there's an update to push and no streams are playing

### Changed
- Temp DJ is now shown as a mention
- Optimized YT key checks
- `.dj` and `.queue` now use mentions instead of text to better highlight users


## [1.5.0] - 2017-07-25
### Added
- `.playnext` command, move a song up the queue to play next
- `.playnext` in aliases, `.pn`

### Changed
- Voice channel checks in `.play` and `.playlist`
- `.queue` now works both with a space or without, e.g. `.queue 2` = `.queue2`

### Deprecated
- Queueing playlists with `.play`, use `.playlist` instead


## [1.4.3] - 2017-07-24
### Added
- Saving VCID in guild object for future use

### Changed
- Added Admin perms to DJ command
- Disabled the ability to pass DJ perms to users with no music perms
- Increased delay to when streams are paused and resumed
- Increased the ammount of related songs bot looks for in AutoMode

### Fixed
- Bot not disconnecting if `.play` is called on empty queue and timing out
- Accumulative delay between songs on big queue or long sessions
- Unknown DJ happening after AutoMode was added


## [1.4.1] - 2017-07-24
### Added
- `.dj` command, Now able to check who's the current VC DJ and, if perms are met, ability to transfer it

### Changed
- Help command now contains legend for AutoPlay and Repeat icons
- `.play` and `.playlist` use regexp formated strings than just strings
- AutoPlay now disables if chat is empty rather than leaving it


## [1.3.1] - 2017-07-20
### Fixed
- Bot cutting out links if it contains dashes
- AutoPlay filling up the queue rather than waiting for last song


## [1.3.0] - 2017-07-20
### Added
- AutoPlay! Add `[-auto]` or `[--autoplay]` to `.play` to let the bot queue songs relative to yours


## [1.2.6] - 2017-07-19
### Changed
- `.stats` now shows current version

### Fixed
- Args fixes in `.help`


## [1.2.5] - 2017-07-19
### Added
- The ability to pre-select when searching YT for songs and playlists. Use `.help play` for details

### Changed
- Split arguments into options, selection and args for better use of commands

### Fixed
- Minor streamHandler fixes


## [1.2.0] - 2017-07-19
### Added
- Temporary DJ perms. First to queue gets DJ commands, revoked and transfered once they leave chat


## [1.1.7] - 2017-07-19
### Added
- Perp for temp VC DJ

### Fixed
- Disable events


## [1.1.6] - 2017-07-17
### Changed
- Rearranged aliases
- Volume display

### Fixed
- Help [command]
- Workaround for stream halting on random users when bot disconnects from a voice channel
- `.play` and `.playlist` collector


## [1.1.0] - 2017-07-08
### Added
- Volume command


## [1.0.0] - 2017-07-06
### Added
- Playlist command
- Queue manipulation
- Buffering

### Changed
- Infrastructure overhaul
- Forced to play opus streams only

### Removed
- On-the-fly encoding of .mp3 files
- Full download of file before playing