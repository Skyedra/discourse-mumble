# Mumble plugin for Discourse
A 2024 revival of [nunof07's discourse-mumble plugin](https://github.com/nunof07/discourse-mumble).

![Discourse Mumble Plugin Screenshot](https://github.com/Skyedra/discourse-mumble/blob/master/discourse-mumble-screenshot.png?raw=true)

Mumble Viewer plugin for Discourse that displays channel and user information.
- [Discourse] is an open source discussion platform.
- [Mumble] is an open source voice chat software.

## New Features

I have added the following *new* features:
* Compatability with [Discourse's changes to how the header is rendered](https://meta.discourse.org/t/upcoming-header-changes-preparing-themes-and-plugins/296544/), so it can run on 2024 Discourse
* Show mute or deafened status in user list.
* Include connection info to guide user on how to install Mumble and connect to your server.
* Optional ability to set a time when your group meets every day, this will be converted to the local time and shown to 
the user.
* Increase polling updates to every 20 seconds.
* For better or worse, I rewrote almost the whole javascript frontend part of this.  I do not know much about Discourse
coding or anything about Glimmer, so I am sure I wrote it in a sub-optimal way.  Further forking and improvement is welcomed :)

## Old Features
The plugin adds a button to the header.
- The button displays the number of users connected to the Mumble server.
- Clicking the button opens a menu with the list of channels and users.
- Idle users have a toned down icon.
- Information is refreshed periodically (configurable).

## Backend

The Mumble server needs to support the [Channel Viewer Protocol][cvp]. Most Mumble servers support this. If you manage your own server you can install a [3rd party application][cvpapp] to do this.

[discourse]: http://www.discourse.org/
[mumble]: https://www.mumble.info/
[cvp]: https://web.archive.org/web/20240526062123/http://wiki.mumble.info/wiki/Channel_Viewer_Protocol
[cvpapp]: https://web.archive.org/web/20240529024803/https://wiki.mumble.info/wiki/3rd_Party_Applications#Channel_Viewers

(Currently the mumble wiki is down, but the above links are still available via Way Back Machine)

The CVP server I used specifically was [mumble-fastapi](https://github.com/ajmandourah/mumble-fastapi) -- however, be 
warned that as of 11/6/24 the author has not updated their [docker image](https://hub.docker.com/r/ajmandourah/mumblecvp) 
to be in sync with the repo.  This means the CVP can't connect to the latest mumble version.  
Fortunately, the author updated the github repo with a fix, so it's just a matter of pulling the github repo and 
rebuilding the docker file.

I have some general [Mumble install tips / configs](https://gist.github.com/Skyedra/4879542bf3e4e85d2d5c5912e28eb2e5) 
that may be helpful to you if you are setting up a Mumble server for the first time.

## How to install
Follow the guide on how to [Install a Plugin][plugin] for Discourse but add this repository URL instead.

Then go to Admin > Plugins and choose Mumble settings:
- *mumble_interval*: the interval between information refreshes
- *mumble_cvp*: the URL to the [Channel Viewer Protocol][cvp] service
- *mumble_xml*: whether the URL to the CVP service is for XML, otherwise will use JSON

NOTE:  I have found that the plugin likes to be installed into the 'mumble' folder for the settings to show up when you
click settings in the admin panel plugins list.  So you may wish to use the syntax in your app.yml to add 'mumble' at the end 
(`sudo -E -u discourse git clone <url> mumble`)

[plugin]: https://meta.discourse.org/t/install-a-plugin/19157

## Contributors

- [Skye](https://github.com/skyedra)
- [nunof07](https://github.com/nunof07)
- [muhlisbc](https://github.com/muhlisbc)
- [Adorfer](https://github.com/Adorfer)
- [ArwedSchmidt](https://github.com/ArwedSchmidt)
