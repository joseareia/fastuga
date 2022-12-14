import { ref, inject, computed } from "vue";
import { defineStore } from "pinia";

export const useProductStore = defineStore("products", () => {
  const axios = inject("axios");
  const products = ref([]);
  const pagination = ref([]);
  const best_products = ref([]);

  async function load_products(page, type) {
    try {
      const response = await axios({
        method: "GET",
        url: `products?page=${page}`,
        params: {
          type: type,
        },
      });
      products.value = response.data.data;
      pagination.value = response.data;
      return products.value;
    } catch (error) {
      clear_orders();
      throw error;
    }
  }

  const get_page = () => {
    return pagination.value;
  };
  const total_products = computed(() => {
    return products.value.length;
  });
  const get_products = () => {
    return products.value;
  };

  async function load_best_products() {
    try {
      const response = await axios({
        method: "GET",
        url: "products/best-selling",
      });
      best_products.value = response.data.data;
      return best_products.value;
    } catch (error) {
      throw error;
    }
  }

  return {
    products,
    pagination,
    get_page,
    best_products,
    load_products,
    load_best_products,
    total_products,
    get_products,
  };
});
