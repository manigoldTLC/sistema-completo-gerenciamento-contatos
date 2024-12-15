import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Ações assíncronas
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
    const response = await api.get("/users");
    return response.data;
});

export const addUser = createAsyncThunk("users/addUser", async (user) => {
    const response = await api.post("/users", user);
    return response.data;
});

export const editUser = createAsyncThunk("users/editUser", async (user) => {
    const response = await api.patch(`/users/${user.id}`, user);
    return response.data;
});

export const deleteUser = createAsyncThunk("users/deleteUser", async (userId) => {
    await api.delete(`/users/${userId}`);
    return userId;
});

// Slice
const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add User
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            // Edit User
            .addCase(editUser.fulfilled, (state, action) => {
                const index = state.users.findIndex((u) => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user.id !== action.payload);
            });
    },
});

export default usersSlice.reducer;
