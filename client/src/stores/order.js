import { ref, inject, computed } from "vue";
import { defineStore } from "pinia";
import { useUserStore } from "./user.js";

export const useOrderStore = defineStore("orders", () => {
    const userStore = useUserStore()

    const socket = inject("socket")
    const axios = inject("axios")
    const toast = inject("toast")

    const orders = ref([])
    const anonymous_orders = ref([])
    const number_orders = ref([])
    const number_orders_this_month = ref([])
    const revenue_orders = ref([])
    const pagination = ref([])
    const pagination_preparation = ref([])
    const order_items = ref([])
    const order_items_preparing = ref([])
    const count_orders = ref(null)

    let url = null;

    async function load_orders(page, status) {
        if (userStore.user && userStore.user.type == "EM") {
            url = `orders?page=${page}`;
        }

        if (userStore.user && (userStore.user.type == "ED" || userStore.user.type == "C") ) {
            url = `users/${userStore.userId}/orders?page=${page}`;
        }

        try {
            const response = await axios({
                method: "GET",
                url: url,
                params: {
                    status: status,
                },
            });

            orders.value = response.data.data;
            pagination.value = response.data;
            return orders.value;
        } catch (error) {
            clear_orders();
            throw error;
        }
    }

    async function loadNumberOrdersMonth() {
        try {
            const response = await axios({
                method: "GET",
                url: "orders/numbers",
            });
            number_orders.value = response.data;
            return number_orders.value;
        } catch (error) {
            throw error;
        }
    }

    async function count_orders_by_status(status) {
        try {
            const response = await axios({
                method: "GET",
                url: "orders/status",
                params: { status },
            });
            count_orders.value = response.data;
            return number_orders.value;
        } catch (error) {
            throw error;
        }
    }

    async function loadNumberOrdersThisMonth() {
        try {
            const response = await axios({
                method: "GET",
                url: "orders/this_month",
            });
            number_orders_this_month.value = response.data;
            return number_orders_this_month.value;
        } catch (error) {
            throw error;
        }
    }

    async function loadRevenueOrders() {
        try {
            const response = await axios({
                method: "GET",
                url: "orders/revenue",
            });
            revenue_orders.value = response.data;
            return revenue_orders.value;
        } catch (error) {
            throw error;
        }
    }

    async function loadOrderItems(page, status) {
        try {
            const response = await axios({
                method: "GET",
                url: "users/" + userStore.user.id + "/order-items?page=" + page,
                params: {
                    status: status,
                },
            });
            order_items.value = response.data.data;
            pagination.value = response.data;
            return order_items.value;
        } catch (error) {
            throw error;
        }
    }

    async function loadOrderItemsWaiting(page) {
        try {
            const response = await axios({
                method: "GET",
                url: "order-items/waiting?page=" + page,
            });
            order_items.value = response.data.data;
            pagination.value = response.data;
            return order_items.value;
        } catch (error) {
            throw error;
        }
    }

    async function loadOrderItemsPreparing(page) {
        try {
            const response = await axios({
                method: "GET",
                url:
                "users/" + userStore.user.id + "/order-items/preparing?page=" + page,
            });
            order_items_preparing.value = response.data.data;
            pagination_preparation.value = response.data;
            return order_items_preparing.value;
        } catch (error) {
            throw error;
        }
    }

    async function insert_order(order) {
        const response = await axios.post("/orders", order);

        if (userStore.user) {
            orders.value.push(response.data.data);
        } else {
            anonymous_orders.value.push(response.data.data);
            sessionStorage.setItem('order', JSON.stringify(anonymous_orders.value))
        }

        socket.emit("newOrder", response.data.data);
        return response.data.data;
    }

    const remove_order = (order) => {
        let i = orders.value.findIndex((t) => t.id === order.id);
        if (i >= 0) orders.value.splice(i, 1);
    };

    const remove_order_item = (order_item, order_items) => {
        let i = order_items.value.findIndex((t) => t.id === order_item.id);
        if (i >= 0) order_items.value.splice(i, 1);
    };

    async function delete_order(order) {
        if (userStore.user && userStore.user.type == "EM") {
            data = {
                status: "C",
            };
        }

        const response = await axios({
            method: "PATCH",
            url: "orders/" + order.id + "/status",
            params: data,
        });
        remove_order(response.data.data);
        socket.emit("deleteOrder", response.data.data);
        return response.data.data;
    }

    let data = {};
    async function update_order_status(order, status) {
        if (userStore.user && userStore.user.type == "ED") {
            data = {
                status: status,
                delivered_by: userStore.user.id,
            };
        }
        const response = await axios({
            method: "PATCH",
            url: "orders/" + order.id + "/status",
            params: data,
        });
        remove_order(response.data.data);
        socket.emit("deliveredOrder", response.data.data);
        return response.data.data;
    }

    async function restoreToken() {
        anonymous_orders.value = []
        let ordersToken = sessionStorage.getItem("order")
        if (ordersToken) {
            JSON.parse(ordersToken).forEach((i) => {
                anonymous_orders.value.push(i)
            })
        }
    }

    async function update_order_items_status(order_item, status) {
        if (userStore.user && userStore.user.type == "EC") {
            data = {
                status: status,
                prepared_by: userStore.user.id,
            };
        }

        const response = await axios({
            method: "PATCH",
            url: "order-items/" + order_item.id + "/status",
            params: data,
        });

        if (status == "P") {
            remove_order_item(response.data.data, order_items);
            loadOrderItemsPreparing();
        }

        if (status == "R") {
            remove_order_item(response.data.data, order_items_preparing);
            socket.emit("updatedOrderChef", response.data.data.order);
        }

        return response.data.data;
    }

    socket.on("updatedOrderChef", (order) => {
        orders.value.push(order);
        toast.info(`The Order (#${order.id}) was updated to status ready!`);
    });

    socket.on("deliveredOrder", (order) => {
        remove_order(order);
        orders.value.push(order);
        toast.info(`The Order (#${order.id}) was updated to status delivered!`);
    });

    socket.on("newOrder", (order) => {
        console.log("HEEEEERE")
      if (order.status == "R") {
        orders.value.push(order);
        toast.info(
          `A new order has arrived. Check your order menu. (#${order.id})`
        );
      } else {
        order.order_item.forEach((item) => {
          if (item.product.type == "hot dish") {
            order_items.value.push(item);
          }
        });
        toast.info(
          `A new order has arrived. Check your order menu. (#${order.id})`
        );
      }
    });

    socket.on("deleteOrder", (order) => {
        remove_order(order);
        toast.info(`The Order (#${order.id}) was deleted!`);
    });

    const get_order_items_preparing = () => {
        return order_items_preparing.value;
    };
    const get_orders = () => {
        return orders.value;
    };
    const get_anonymous_orders = computed(() => {
        return anonymous_orders.value;
    });
    const get_order_items = () => {
        return order_items.value;
    };
    const get_order_items_waiting = () => {
        return order_items.value;
    };
    const get_orders_this_month = () => {
        return number_orders_this_month.value;
    };
    const get_revenue_orders = () => {
        return revenue_orders.value;
    };
    const get_page = () => {
        return pagination.value;
    };
    const get_page_preparation = () => {
        return pagination_preparation.value;
    };
    const clear_orders = () => {
        orders.value = [];
    };
    const total_orders = computed(() => {
        return orders.value.length;
    });
    const my_orders = computed(() => {
        return orders.value.filter((or) => userStore.customer.id);
    });
    const my_orders_delivery = computed(() => {
        return orders.value.filter((or) => userStore.userId);
    });
    const total_my_orders = computed(() => {
        return my_orders.value.length;
    });

    return {
        orders,
        my_orders,
        total_my_orders,
        anonymous_orders,
        get_anonymous_orders,
        loadNumberOrdersMonth,
        load_orders,
        get_page,
        get_orders,
        total_orders,
        insert_order,
        delete_order,
        restoreToken,
        loadNumberOrdersMonth,
        loadRevenueOrders,
        get_revenue_orders,
        loadNumberOrdersThisMonth,
        get_orders_this_month,
        loadOrderItems,
        get_order_items,
        loadOrderItemsWaiting,
        get_order_items_waiting,
        my_orders_delivery,
        update_order_status,
        count_orders,
        count_orders_by_status,
        loadOrderItemsPreparing,
        get_order_items_preparing,
        update_order_items_status,
        get_page_preparation,
    };
});
