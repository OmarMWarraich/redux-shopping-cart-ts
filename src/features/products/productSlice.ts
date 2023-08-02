import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../app/api";

export interface ProductState {
    products: { [id: string]: Product };
}

const initialState: ProductState = {
    products: {
        "1": {
            name: "Product 1",
        }
    },
};

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {}
});

export default productSlice.reducer;
        