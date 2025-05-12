import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactions, addTransaction } from "../../api";

export const fetchTransactions = createAsyncThunk(
    "transactions/fetchTransactions",
    async (_, thunkAPI) => {
        try {
            const data = await getTransactions();
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Ошибка при загрузке транзакций");
        }
    }
);

export const createTransaction = createAsyncThunk(
    "transactions/createTransaction",
    async (newTransaction, thunkAPI) => {
        try {
            await addTransaction(newTransaction);
            thunkAPI.dispatch(fetchTransactions());
        } catch (error) {
            return thunkAPI.rejectWithValue("Ошибка при добавлении транзакции");
        }
    }
);

const transactionSlice = createSlice({
    name: "transactions",
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default transactionSlice.reducer;
