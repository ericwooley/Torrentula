# Mission statement
Build a chrome app that acts similarly to a download manager, which intercepts link clicks and downloads
the files using webtorrent, if seeders are available for that file.

# Intro to web torrent (so were all on the the same page)
Torrents are peer to peer file sharing. Someone with a file creates a hash of that file and sends it to others.
Those others use the hash to find other peers who have that file, request pieces of the file from each of them,
combine the pieces and check it's correct by validating the hash. Once you have a piece of the file, you advertise
to other peers that you can share that piece.

Web torrent does this with webRTC, it has the limitation of not being able to share with regular torrent clients.
Once you close the page, you stop seeding all files.

# Download manager
The download manager should accept links, and download the urls data using webtorrent and begin seeding it.
For this to happen someone needs to be seeding the file at that url and we need a hash of that file to begin
the downloading process. The solution is to use a centralized server to store urls, and a hash of the file at that
location.

The download manager should get a link, and check if a hash of that file is known.
 - If the hash is known, check for peers then download file using webtorrent
 - If hash is not known, download a blob from the url, seed it, and report the url/hash combo to the server. (Security is an issue here, but we won't be able to solve that in a day)

## Limitations
- Chrome has a 500mb blob limitation that is actively being fixed, so our max file size, for the time being, is 500mb.

#### Extension Limitations
- Chrome packaged apps don't allow you to interact with active tabs.

- Chrome extensions don't allow you access the filesystem.

We need both, so we are going to have to have an extension which provides a context menu to links, and sends the url to the App.
The app will download the blob and seed it. Store it in the file system, and reload it when the app is restarted.

# Implementation
* Use firebase for the centralized server.
* Use react for displaying file downloads in the browser.
* Use chrome file system api for disk access.
