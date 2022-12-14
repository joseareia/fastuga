<script setup>
import { ref, watch, computed, inject } from "vue";
import avatarNoneUrl from '@/assets/product-none.png'

const serverBaseUrl = inject("serverBaseUrl")

var previewImage = null

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
    errors: {
        type: Object,
        required: false
    },
})

const emit = defineEmits(["save", "cancel", "add"])
const editingProduct = ref(props.product)
const errors = ref(null)

const handleUpload = (e) => {
    const image = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(image)
    reader.onload = e => {
        previewImage = e.target.result
    }
}

watch(() => props.product, (newProduct) => {
    editingProduct.value = newProduct
})

const validations = (data) => {
    errors.value = {}
    data.forEach((item, i) => {
        switch (i) {
            case "name":
                if (item.length === 0) errors.value.name = ["Enter a valid name."]
                break;
            case "price":
                if (item.length === 0 || (item.length > 0 && item <= 0)) errors.value.price = ["Enter a valid price."]
                break;
            case "type":
                if (item.length === 0 || (item.length > 0 && (item != "hot dish" && item != "cold dish" && item != "drink" && item != "dessert"))) errors.value.type = ["Select a valid type."]
                break;
            case "description":
                if (item.length === 0) errors.value.description = ["Enter a valid description."]
                break;
        }
    })
    return Object.keys(errors.value).length === 0 ? true : false
}

const save = () => {
    let formData = new FormData()
    formData.append('name', editingProduct.value.name)
    formData.append('price', editingProduct.value.price)
    formData.append('type', editingProduct.value.type)
    formData.append('description', editingProduct.value.description)

    if (previewImage) { formData.append('photo_url', previewImage) }
    if (validations(formData)) emit("save", formData)
}

const add = () => {
    let formData = new FormData()
    formData.append('name', editingProduct.value.name)
    formData.append('price', editingProduct.value.price)
    formData.append('type', editingProduct.value.type)
    formData.append('description', editingProduct.value.description)
    if (previewImage) { formData.append('photo_url', previewImage) }
    if (validations(formData)) emit("add", formData)
}

const cancel = () => { emit("cancel", editingProduct.value) }

const photoFullUrl = computed(() => {
    return editingProduct.value.photo_url ? serverBaseUrl + '/storage/products/' + editingProduct.value.photo_url : avatarNoneUrl
})


</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="d-flex p-title-box">
                    <h4 class="p-title me-auto" v-if="$route.name == 'Product'">Editing Product #{{ editingProduct.id }}
                        - {{ editingProduct.name }}</h4>
                    <h4 class="p-title me-auto" v-if="$route.name == 'newProduct'">Adding New Product</h4>
                </div>
            </div>
        </div>
        <form class="pe-2 needs-validation" novalidate enctype="multipart/form-data">
            <div class="row mb-3">
                <div class="col-md-8 col-sm-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row mb-2">
                                <div class="row mb-3">
                                    <div class="col">
                                        <div class="mb-3">
                                            <label for="inputName" class="form-label">Name <span
                                                    class="text-danger">*</span></label>
                                            <input type="text" class="form-control" id="inputName"
                                                placeholder="Insert a name" required v-model="editingProduct.name" />
                                            <field-error-message :errors="errors"
                                                fieldName="name"></field-error-message>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="mb-3">
                                            <label for="inputPrice" class="form-label">Price <span
                                                    class="text-danger">*</span></label>
                                            <input type="text" class="form-control" id="inputPrice"
                                                placeholder="Product Price" required v-model="editingProduct.price" />
                                            <field-error-message :errors="errors"
                                                fieldName="price"></field-error-message>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="mb-3">
                                            <label for="type" class="form-label">Type <span
                                                    class="text-danger">*</span></label>
                                            <select id="type" name="type" class="form-select"
                                                v-model="editingProduct.type" required>
                                                <option value="hot dish">Hot Dish</option>
                                                <option value="cold dish">Cold Dish</option>
                                                <option value="drink">Drink</option>
                                                <option value="dessert">Dessert</option>
                                            </select>
                                            <field-error-message :errors="errors"
                                                fieldName="type"></field-error-message>
                                        </div>
                                    </div>
                                </div>
                                <div class="col pe-4">
                                    <div class="mb-3 px-1">
                                        <label for="inputDescription" class="form-label">Description <span
                                                class="text-danger">*</span></label>
                                        <textarea class="form-control" id="inputDescription" rows="4"
                                            v-model="editingProduct.description" required></textarea>
                                        <field-error-message :errors="errors"
                                            fieldName="description"></field-error-message>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 col-sm-12">
                    <div class="card">
                        <div class="card-body">
                            <div>
                                <div class="mb-3">
                                    <label class="form-label">Photo</label>
                                    <input type="file" class="form-control" name='upload' @change="handleUpload"
                                        required>
                                    <br>
                                    <img :src="photoFullUrl" class="img-thumbnail" v-if="$route.name == 'Product'" />
                                    <field-error-message :errors="errors" fieldName="photo_url"></field-error-message>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mb-3 d-flex justify-content-end">
                <div class="mb-3 px-1">
                    <button type="button" class="btn btn-warning px-4 btn-add" @click="add"
                        v-if="$route.name == 'newProduct'">
                        Add Product
                    </button>
                    <button type="button" class="btn btn-warning px-4 btn-add" @click="save"
                        v-if="$route.name == 'Product'">
                        Save Product
                    </button>
                </div>
                <div class="mb-3 px-1">
                    <button type="button" class="btn btn-light px-4" @click="cancel">
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.total_hours {
    width: 26rem;
}

#label {
    background-color: orange;
    color: white;
    padding: 0.5rem;
    font-family: sans-serif;
    border-radius: 0.3rem;
    cursor: pointer;
    margin-top: 1rem;
}
</style>
