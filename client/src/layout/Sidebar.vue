<script setup>
import { useUserStore } from '../stores/user.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const logout = () => {
    if (userStore.logout()) {
        router.push({ name: 'Login' })
    } else {
        toast.error("There was a problem logging out of the application!")
    }
}
</script>
<template>

    <div class="container-fluid">
        <nav id="sidebarMenu" class="d-md-block sidebar collapse">
            <div class="logo">
                <router-link class="nav-link" :to="{ name: 'Dashboard' }">
                    <span style="vertical-align">Fastuga.</span>
                </router-link>
            </div>
            <div class="position-sticky pt-3">
                <ul class="nav flex-column" id="nav-flex-sidebar">
                    <li class="nav-item nav-item-title">Navigation</li>
                    <li class="nav-item">
                        <router-link class="nav-link" :class="{
                            active: $route.name === 'Dashboard'
                                || $route.name === 'CustomerDashboard'
                                || $route.name === 'AnonymousDashboard'
                                || $route.name === 'ChefDashboard'
                                || $route.name === 'DeliveryDashboard'
                        }" :to="{ name: 'Dashboard' }">
                            <i class="bi bi-house-fill"></i>
                            Public Board
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="(userStore.user && userStore.user.type == 'C') || !userStore.user">
                        <router-link class="nav-link" :class="{ active: $route.name === 'Menu' }"
                            :to="{ name: 'Menu' }">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path
                                    d="M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32H8.6C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256H484.6c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28H140.2c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z" />
                            </svg>
                            Menu
                        </router-link>
                    </li>

                    <li class="nav-item nav-item-title mt-2"
                        v-if="(userStore.user && userStore.user.type != 'EM') || !userStore.user">Your Space</li>
                    <li class="nav-item" v-if="(userStore.user && userStore.user.type == 'C') || !userStore.user">
                        <router-link class="nav-link" :class="{ active: $route.name === 'NewOrder' }"
                            :to="{ name: 'NewOrder' }">
                            <div>
                                <i class="bi bi-bag-plus-fill" style="font-size: 17px!important;"></i>
                                Register an Order
                            </div>
                        </router-link>
                    </li>

                    <li class="nav-item" v-if="(userStore.user && userStore.user.type != 'EM') || !userStore.user">
                        <router-link class="nav-link"
                            :class="{ active: $route.name === 'Orders' || $route.name == 'Order' }"
                            :to="{ name: 'Orders' }">
                            <div v-if="userStore.user && userStore.user.type == 'EC'">
                                <i class="bi bi-bag-fill" style="font-size: 17px!important;"></i>
                                Order-Items
                            </div>
                            <div v-if="userStore.user && userStore.user.type == 'ED'">
                                <i class="bi bi-bag-fill" style="font-size: 17px!important;"></i>
                                Order history
                            </div>
                            <div v-if="(userStore.user && userStore.user.type == 'C') || !userStore.user">
                                <i class="bi bi-bag-fill" style="font-size: 17px!important;"></i>
                                Your Orders
                            </div>
                        </router-link>
                    </li>

                    <div v-if="userStore.user && userStore.user.type == 'EM'">
                        <li class="nav-item nav-item-title mt-3">Administration</li>
                        <li class="nav-item">
                            <router-link class="nav-link"
                                :class="{ active: $route.name === 'Orders' || $route.name == 'Order' }"
                                :to="{ name: 'Orders' }">
                                <div v-if="userStore.user && userStore.user.type == 'EM'">
                                    <i class="bi bi-bag-fill" style="font-size: 17px!important;"></i>
                                    All Orders
                                </div>
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" :class="{
                                active:
                                    $route.name === 'Products'
                                    || $route.name === 'newProduct'
                                    || $route.name === 'Product'
                            }" :to="{ name: 'Products' }">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path
                                        d="M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32H8.6C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256H484.6c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28H140.2c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z" />
                                </svg>
                                Products
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" :class="{
                                active: $route.name === 'Users' ||
                                    $route.name === 'User' ||
                                    $route.name === 'newUser'
                            }" :to="{ name: 'Users' }">
                                <i class="bi bi-people-fill"></i>
                                Users
                            </router-link>
                        </li>
                    </div>

                    <li class="nav-item" id="sharefastuga">
                        <div class="d-flex justify-content-center">
                            <a href="#"
                                class="btn btn-secondary d-flex align-items-center justify-content-center btn-share">
                                <i class="bi bi-fire me-2"></i>
                                Share Fastuga
                            </a>
                        </div>
                    </li>

                    <hr>

                    <li class="nav flex-column mb-2" id="login2">
                    <li class="nav-item nav-item-title" v-if="!userStore.user">User Space (Anonymous Customer)</li>
                    <li class="nav-item nav-item-title" v-else="!userStore.user">User Space</li>

                    <li class="nav-item" v-if="!userStore.user">
                        <router-link class="nav-link" :class="{ active: $route.name === 'Register' }"
                            :to="{ name: 'Register' }">
                            Register
                        </router-link>
                    </li>
                    <li class="nav-item" v-if="!userStore.user">
                        <router-link style="vertical-align:middle;" class="nav-link"
                            :class="{ active: $route.name === 'Login' }" :to="{ name: 'Login' }">
                            Login
                        </router-link>
                    </li>

                    <li class="nav-item dropdown nav-user" v-if="userStore.user">
                        <a class="nav-link" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            <span class="account-user-avatar">
                                <img alt="user image" :src="userStore.userPhotoUrl" class="rounded-circle img_photo">
                            </span>
                            <span>
                                <span class="account-user-name">{{ userStore.user.name }}</span>
                                <span class="account-position" v-if="userStore.user.type == 'EM'">Manager</span>
                                <span class="account-position" v-if="userStore.user.type == 'EC'">Chef</span>
                                <span class="account-position" v-if="userStore.user.type == 'ED'">Delivery</span>
                                <span class="account-position" v-if="userStore.user.type == 'C'">Customer</span>
                            </span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end py-2 px-1" aria-labelledby="navbarDropdownMenuLink">
                            <li class="p-0" style="padding:0!important;">
                                <router-link class="dropdown-item" :class="{ active: $route.name === 'ChangeProfile' }"
                                    :to="{ name: 'ChangeProfile' }">
                                    Profile
                                </router-link>
                            </li>
                            <li>
                                <router-link class="dropdown-item" :class="{ active: $route.name === 'ChangePassword' }"
                                    :to="{ name: 'ChangePassword' }">
                                    Change password
                                </router-link>
                            </li>
                            <li>
                                <hr class="dropdown-divider" />
                            </li>
                            <li>
                                <a class="dropdown-item" @click.prevent="logout" style="cursor:pointer;">Logout</a>
                            </li>
                        </ul>
                    </li>
                    </li>
                </ul>
            </div>
        </nav>
    </div>

</template>

<style scoped>
#login2 {
    display: none;
}

.img_photo {
    width: 32px;
    height: 32px;
}

.nav-user {
    padding: calc(31px * .5) 20px calc(31px * .5) 57px !important;
    text-align: left !important;
    position: relative;
    border-width: 0 1px;
    min-height: 70px;
    transition: none;
}

.nav-user .account-user-avatar {
    position: absolute;
    left: -35px;
    top: 15px;
}

.nav-user .account-user-name {
    display: block;
    font-weight: 600;
}

.nav-user .account-position {
    display: block;
    font-size: 12px;
    margin-top: -3px;
    text-align: initial;
}

.navbar {
    height: 4.375rem;
    padding: 0 12px;
    min-height: 70px;
    position: fixed;
    left: 260px;
    top: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 0 35px 0 rgba(154, 161, 171, .15) !important;
    background-color: #fff;
}

.avatar-text {
    display: flex;
}

#sidebarMenu {
    width: 260px;
    min-width: 260px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #1f2937;
    z-index: 2000;
    box-shadow: 0 0 35px 0 rgba(154, 161, 171, .15) !important;
}

.logo {
    height: 4.375rem;
    width: 260px;
    min-width: 260px;
    position: fixed;
    top: 0;
    color: #fff !important;
    text-decoration: none !important;
}

.logo .nav-link {
    height: 4.375rem;
    width: 260px;
    font-size: 1.313rem;
    font-weight: 800;
    color: #fff !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-link:hover {
    color: #f2f4f6;
    background-color: #374151;
    border-radius: 5px;
}

.nav-link:hover>svg {
    fill: #f2f4f6;
}

ul {
    padding: 3rem .75rem;
}

.nav-item-title {
    padding: 12px 20px;
    letter-spacing: .05em;
    pointer-events: none;
    cursor: default;
    font-size: .6875rem;
    text-transform: uppercase;
    color: #7e8d9f;
    font-weight: 700;
}

ul> :first-child {
    padding: 0 20px 12px 20px !important;
}

.nav-link {
    display: block;
    padding: 13px 20px;
    font-size: .9375rem;
    position: relative;
    color: #ccc;
    font-weight: 600;
}

.sidebar .nav-link.active,
.sidebar .nav-link.active svg {
    color: #f0bc74;
    font-weight: 700;
    fill: #f0bc74 !important;
}

.nav-link i {
    display: inline-block;
    line-height: 1.0625rem;
    margin: -3px 10px 0 0;
    font-size: 1.1rem;
    vertical-align: middle;
    width: 20px;
}

svg {
    fill: #ccc;
    transition: .15s ease-in-out;
    display: inline-block;
    line-height: 1.0625rem;
    margin: -3px 10px 0 0;
    font-size: 1.1rem;
    vertical-align: middle;
    width: 20px;
}

.text-gray-800,
.text-gray-800:hover {
    color: #1f2937 !important;
}

.badge-md {
    padding: .25rem .4rem;
}

.badge {
    font-size: 12px;
    font-weight: 700;
}

.bg-secondary {
    background-color: #f0bc74 !important;
}

.btn-share {
    position: fixed;
    padding: 10px 0;
    bottom: 20px;
    width: 210px;
}

.btn-secondary {
    color: #1f2937;
    font-weight: 700;
    background-color: #f0bc74;
    border-color: #f0bc74;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, .15), 0 1px 1px rgba(17, 24, 39, .075);
}

.btn-secondary:hover {
    background-color: #eeb15d;
    border-color: #eeb15d;
}

.btn-secondary:hover {
    color: #1f2937;
    background-color: #f2c689;
}

.btn-secondary:active {
    color: #1f2937 !important;
    background-color: #f0bc74 !important;
    border-color: #f0bc74 !important;
}
</style>
