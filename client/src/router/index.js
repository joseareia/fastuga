import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/user.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Dashboard",
            component: () => import("../views/Dashboard.vue"),
        },
        {
            path: "/",
            name: "CustomerDashboard",
            component: () => import("../views/CustomerDashboard.vue"),
        },
        {
            path: "/",
            name: "DeliveryDashboard",
            component: () => import("../views/DeliveryDashboard.vue"),
        },
        {
            path: "/",
            name: "AnonymousDashboard",
            component: () => import("../views/AnonymousDashboard.vue"),
        },
        {
            path: "/",
            name: "ChefDashboard",
            component: () => import("../views/ChefDashboard.vue"),
        },
        {
            path: "/users",
            name: "Users",
            component: () => import("../components/users/Users.vue"),
        },
        {
            path: "/products",
            name: "Products",
            component: () => import("../components/products/Products.vue"),
        },
        {
            path: "/menu",
            name: "Menu",
            component: () => import("../components/menu/Menu.vue"),
        },
        {
            path: "/users/:id",
            name: "User",
            component: () => import("../components/users/User.vue"),
            props: (route) => ({ id: parseInt(route.params.id) }),
        },
        {
            path: "/login",
            name: "Login",
            component: () => import("../components/auth/Login.vue"),
        },
        {
            path: "/password",
            name: "ChangePassword",
            component: () => import("../components/auth/ChangePassword.vue"),
        },
        {
            path: "/profile",
            name: "ChangeProfile",
            component: () => import("../components/auth/ChangeProfile.vue"),
        },
        {
            path: "/register",
            name: "Register",
            component: () => import("../components/auth/Register.vue"),
        },
        {
            path: "/orders",
            name: "Orders",
            component: () => import("../components/orders/Orders.vue"),
        },
        {
            path: "/orders/current",
            name: "CurrentOrder",
            component: () => import("../components/orders/Orders.vue"),
            props: { onlyCurrentOrders: true, ordersTitle: "Current Order" },
        },
        {
            path: "/order/new",
            name: "NewOrder",
            component: () => import("../components/orders/Order.vue"),
            props: { id: -1 },
        },
        {
            path: "/products/new",
            name: "newProduct",
            component: () => import("../components/products/Product.vue"),
            props: { id: -1 },
        },
        {
            path: "/users/new",
            name: "newUser",
            component: () => import("../components/users/User.vue"),
            props: { id: -1 },
        },
        {
            path: "/orders/:id",
            name: "Order",
            component:() => import("../components/orders/Order.vue"),
            props: (route) => ({ id: parseInt(route.params.id) }),
        },
        {
            path: "/products/:id",
            name: "Product",
            component: () => import("../components/products/Product.vue"),
            props: (route) => ({ id: parseInt(route.params.id) }),
        },

        {
            path: "/:pathMatch(.*)*",
            name: "Forbidden",
            component: () => import("@/views/Forbidden.vue"),
        },
    ],
})

let handlingFirstRoute = true

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    if (handlingFirstRoute) {
        handlingFirstRoute = false
        await userStore.restoreToken()
    }
    
    if (to.name == "Dashboard") {
        if (!userStore.user) { next({ name: "AnonymousDashboard" }); return }

        switch (userStore.user.type) {
            case "C":
                next({ name: "CustomerDashboard" }); return
                break;

            case "ED":
                next({ name: "DeliveryDashboard" }); return
                break;

            case "EC":
                next({ name: "ChefDashboard" }); return
                break;
        }
    }

    if (to.name == "Login") {
        next()
        return
    }

    if (to.name == "newProduct") {
        if (userStore.user === null || userStore.user.type != "EM") {
            next({
                name: "Forbidden",
                params: { pathMatch: to.path.substring(1).split("/") },
                query: to.query,
                hash: to.hash,
            })
            return
        }
    }

    if (to.name == "Products") {
        if (userStore.user === null || userStore.user.type != "EM") {
            next({
                name: "Forbidden",
                params: { pathMatch: to.path.substring(1).split("/") },
                query: to.query,
                hash: to.hash,
            })
            return
        }
    }

    if (to.name == "Product") {
        if (userStore.user.type == "EM") {
            next()
            return
        }
        next({
            name: "Forbidden",
            params: { pathMatch: to.path.substring(1).split("/") },
            query: to.query,
            hash: to.hash,
        })
        return
    }

    if (to.name == "Order") {
        if ((userStore.user && (userStore.user.type == "EM" || userStore.user.type == "C")) || !userStore.user) {
            next()
            return
        }
        next({
            name: "Forbidden",
            params: { pathMatch: to.path.substring(1).split("/") },
            query: to.query,
            hash: to.hash,
        })
        return
    }

    if (to.name == "Users") {
        if (userStore.user === null || userStore.user.type != "EM") {
            next({
                name: "Forbidden",
                params: { pathMatch: to.path.substring(1).split("/") },
                query: to.query,
                hash: to.hash,
            })
            return
        }
    }

    if (to.name == "NewOrder") {
        if (userStore.user === null) {
            next()
            return
        }
        if (userStore.user.type == "EC" || userStore.user.type == "ED") {
            next({
                name: "Forbidden",
                params: { pathMatch: to.path.substring(1).split("/") },
                query: to.query,
                hash: to.hash,
            })
            return
        }
    }

    if (to.name == "User") {
        if (userStore.user === null ||userStore.user.type != "EM" /*|| userStore.user.id == to.params.id*/ ) {
            next({
                name: "Forbidden",
                params: { pathMatch: to.path.substring(1).split("/") },
                query: to.query,
                hash: to.hash,
            });
            return
        }
        if (userStore.user.type == "EM" || userStore.user.id == to.params.id) {
            next()
            return
        }
    }

    next()
})

export default router
