import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState, createSharedMutations} from 'vuex-electron'
import {getInitialState} from '@utils/store'
import createPromiseAction from '@plugins/vuex-promise-action'

import app from './app'
import settings from './settings'
import releases from './releases'
import release from './release'
import search from './search'
import player from './player'
import notifications from './notifications'

Vue.use(Vuex);

const modules = {
  app,
  settings,
  releases,
  release,
  search,
  player,
  notifications
};

const debug = process.env.NODE_ENV !== 'production';
const store = new Vuex.Store({
  modules,
  plugins: [
    createPromiseAction(),
    createPersistedState({
      invertIgnored: true,
      ignoredPaths: ['settings'],
    }),
    createSharedMutations()
  ],
  strict: debug,
  mutations: {
    RESET_STORE() {
      this.replaceState(getInitialState(modules))
    }
  }
});

export default store
