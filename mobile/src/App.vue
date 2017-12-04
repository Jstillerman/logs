<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <q-layout ref="layout" view="lHh Lpr fff" :left-class="{'bg-grey-2': true}">
      <q-toolbar slot="header">
        <q-btn flat @click="$refs.layout.toggleLeft()">
          <q-icon name="menu" />
        </q-btn>
        Logs
      </q-toolbar>
      <div slot="left">
        <q-list no-border link inset-delimiter>
          <q-list-header>Navigate</q-list-header>
          <q-side-link item to='/entry'>
            <q-item-side icon="fa-pencil" />
            <q-item-main label="Entry"/>
          </q-side-link>
          <q-side-link item to='/timeline'>
            <q-item-side icon="fa-list" />
            <q-item-main label="Timeline"/>
          </q-side-link>
          <q-side-link item to='/days'>
            <q-item-side icon="fa-sun-o" />
            <q-item-main label="Days"/>
          </q-side-link>
          <q-side-link item to='/ongoing'>
            <q-item-side icon="fa-clock" />
            <q-item-main label="Ongoing"/>
          </q-side-link>
          <q-side-link item to='/calendar'>
            <q-item-side icon="fa-calendar" />
            <q-item-main label="Calendar"/>
          </q-side-link>
          <q-side-link item to='/stats'>
            <q-item-side icon="fa-bar-chart" />
            <q-item-main label="Stats"/>
          </q-side-link>
        </q-list>
      </div>
      <router-view />
    </q-layout>

  </div>
</template>

<script>
/*
 * Root component
 */
import {QBtn, QToolbar, QLayout, QIcon, QList, QItem, QItemSide, QItemMain, QListHeader, QDatetime, QChipsInput, QInput, LocalStorage, QSideLink, QAutocomplete} from 'quasar'
export default {
  components: {QBtn, QToolbar, QLayout, QIcon, QList, QItem, QItemSide, QItemMain, QListHeader, QDatetime, QChipsInput, QInput, LocalStorage, QSideLink, QAutocomplete}
}
</script>

<style></style>
