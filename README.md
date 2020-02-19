# CrossSnap

CrossSnap is an iOS app that allows you to play crosswords with your friends in real time

## Installation

Once forked,

```bash
npm install
createdb crosscollab
npm run seed
```

in serverUrl.js, replace "LOCAL IP ADDRESS HERE" with your IP address (Mac users: found in
System Preferences => Network, Windows users: select the Start button => start typing View network connections => select and active network connection => select View status of this connection => select Details)

In one terminal,

```bash
node server
```

In another terminal,

```bash
npm start
```

Download Expo from the Apple Store, and then hover your phone camera over the QR code in your second terminal.

Once you have signed up, pick a puzzle from the 'All puzzles' page. Once your friends have signed up, have them place your Game Id in the 'Join Game' section of their home screen.

Have fun!
