import { createSlice, createAsyncThunk ,createSelector, PayloadAction } from "@reduxjs/toolkit";
import { checkout, CartItems } from "../../app/api";
import { RootState } from "../../app/store";

type CheckoutState = "LOADING" | "READY" | "ERROR";

export interface CartState {
    items: { [productID: string]: number };
    checkoutState?: CheckoutState;
    errorMessage: string;
}

const initialState: CartState = {
    items: {},
    checkoutState: "READY",
    errorMessage: ""
};

export const checkoutCart = createAsyncThunk(
    "cart/checkout",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const items: CartItems = state.cart.items;
        const response = await checkout(items);
        return response;
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<string>) {
            const id = action.payload;
            if (state.items[id]) {
                state.items[id] ++;
            } else {
                state.items[id] = 1;
            }
        },
        removeFromCart(state, action: PayloadAction<string>) {
            delete state.items[action.payload];
        },
        updateQuantity(state, action: PayloadAction<{id: string, quantity: number}>){
            const {id, quantity} = action.payload;
            if (quantity <= 0){
                delete state.items[id];
            } else {
                state.items[id] = quantity;
            }
        }         
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkoutCart.pending, (state) => {
                state.checkoutState = "LOADING";
            })
             .addCase(checkoutCart.fulfilled, (state, action: PayloadAction<{ success: boolean }>) => {
                const { success } = action.payload;
                if (success) {
                    state.checkoutState = "READY";
                    state.items = {};
                } else {
                    state.checkoutState = "ERROR";
                }
            })
            .addCase(checkoutCart.rejected, (state, action) => {
                state.checkoutState = "ERROR";
                state.errorMessage = action.error.message || "";
            });
    }
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;

export const getMemoizedNumItems = createSelector(
    (state: RootState) => state.cart.items,
    (items) => {
        console.log("Calling Memoized Num Items.")
        let numItems = 0;
        for (let id in items){
            numItems += items[id];
        }
        return numItems;
    }
)

export const getTotalPrice = createSelector(
    (state: RootState) => state.cart.items,
    (state: RootState) => state.products.products,
    (items, products) => {
        let total = 0;
        for (let id in items){
            total += products[id].price * items[id];
        }
        return total.toFixed(2);
    }
)