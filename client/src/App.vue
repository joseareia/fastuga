<script setup>
import { RouterView } from 'vue-router'
import { useConfigStore } from './stores/config.js'
import { useOrderStore } from './stores/order.js'

import Navbar from "@/layout/Navbar.vue"
import Sidebar from "@/layout/Sidebar.vue"
import Footer from "@/layout/Footer.vue"

const configStore = useConfigStore()
const orderStore = useOrderStore()
</script>

<template>

    <head>
        <meta name="description" content="FastugaApp">
    </head>
    <div class="wrapper">
        <Navbar v-if="configStore.showNavbar" />
        <Sidebar v-if="configStore.showSidebar" />
        <main v-if="configStore.showMain">
            <div class="content">
                <router-view />
            </div>
        </main>
        <section v-if="!configStore.showMain">
            <router-view />
        </section>
        <Footer v-if="configStore.showFooter" />
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
@import "./assets/css/master.css";
@import "./assets/css/components.css";
</style>
