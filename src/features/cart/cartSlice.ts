import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../../app/store";

type CheckoutState = "LOADING" | "READY" | "ERROR";

export interface CartState {
    items: { [productID: string]: number };
    checkoutState?: CheckoutState;
}

const initialState: CartState = {
    items: {},
    checkoutState: "READY"
};

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
            .addCase("cart/checkout/pending", (state) => {
                state.checkoutState = "LOADING";
            })
             .addCase("cart/checkout/fulfilled", (state) => {
                state.items = {};
                state.checkoutState = "READY";
            })
    }
});

export function checkout() {
    return function checkoutThunk(dispatch: AppDispatch) {
        dispatch({ type: "cart/checkout/pending" });
        setTimeout(() => {
            dispatch({ type: "cart/checkout/fulfilled" });
        }, 1000);
    }
}

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;

export function getNumItems(state: RootState){
    console.log("Calling Num Items.")
    let numItems = 0;
    for (let id in state.cart.items){
        numItems += state.cart.items[id];
    }
    return numItems;
}

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