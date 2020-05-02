import path from 'path'
import store from '@store'; // eslint-disable-line
import AppSentry from './utils/sentry'

// Enable Sentry.io electron handler
AppSentry({store, source: 'main'});

import AppTray from './utils/tray'
import AppFolders from './utils/folders'
import {app, ipcMain as ipc} from 'electron'
import {AppWindowMain, AppWindowTorrent} from './utils/windows'

const appTray = new AppTray();
const appFolders = new AppFolders();


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}


app.on('ready', () => {

  // Set data folder
  //appFolders.setDataFolder();


  // Create windows
  AppWindowMain.createWindow({title: 'Aniibrix'}).loadUrl();
  AppWindowTorrent.createWindow({title: 'Aniibrix Torrent'}).loadUrl();


  // Create tray icon
  // Set data folder
  appTray
    .createTrayIcon({iconPath: path.join(__dirname, '../../build/icons/tray/icon.png')})
    .setTooltip('AniLibrix')
    .setClickEvent(() => {

      // Restore window if it is minimized
      if (AppWindowMain.getWindow().isMinimized()) AppWindowMain.getWindow().restore();

      // Focus on window
      AppWindowMain.getWindow().focus();

    });


  // Set windows communications
  const communications = [
    {channel: 'torrent:clear', window: () => AppWindowMain, payload: (payload) => payload},
    {channel: 'torrent:error', window: () => AppWindowMain, payload: (payload) => payload},
    {channel: 'torrent:start', window: () => AppWindowTorrent, payload: (payload) => payload},
    {channel: 'torrent:server', window: () => AppWindowMain, payload: (payload) => payload},
    {channel: 'torrent:destroy', window: () => AppWindowTorrent, payload: (payload) => payload},
    {channel: 'torrent:download', window: () => AppWindowMain, payload: (payload) => payload},
  ];

  // Init windows communications
  communications.forEach(communication => {
    ipc.on(communication.channel, (e, payload) =>
      communication.window().sendToWindow(communication.channel, communication.payload(payload))
    )
  });

});
