# Changelog

## [1.5.0] - 2017-07-25
### Added
- `.playnext` command, move a song from the queue up to play next
- `.playnext` in aliases, `.pn`

### Changed
- Voice channel checks in `.play` and `.playlist`
- `.queue` now works both with a space or without, e.g. `.queue 2` = `.queue2`


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


## [1.3.1] - 2017-07-20
### Fixed
- AutoPlay now disables if chat is empty rather than leaving it
- Bot cutting out links if it contains dashes
- AutoPlay only queues if it's the last song in queue


## [1.3.0] - 2017-07-20
### Added
- AutoPlay! Add `-auto` or `--autoplay` to `.play` to let the bot queue songs relative to yours


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