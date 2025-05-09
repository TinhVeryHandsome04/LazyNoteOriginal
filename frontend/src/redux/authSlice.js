import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, logout, checkAuthStatus } from '../api/authApi';

// Thunk action để đăng nhập
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Đăng nhập thất bại'
      );
    }
  }
);

// Thunk action để đăng ký
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Dữ liệu gửi lên server:", userData);
      const response = await register(userData);
      console.log("Phản hồi từ server:", response.data);
      return response.data;
    } catch (error) {
      console.error("Chi tiết lỗi:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 'Đăng ký thất bại'
      );
    }
  }
);

// Thunk action để đăng xuất
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Đăng xuất thất bại'
      );
    }
  }
);

// Thunk action để kiểm tra trạng thái đăng nhập
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkAuthStatus();
      return response.data;
    } catch (error) {
      // Không cần rejectWithValue cho lỗi 404 khi kiểm tra auth
      if (error.response && error.response.status === 404) {
        console.log("API auth/status không tồn tại - người dùng chưa đăng nhập");
        return { isAuthenticated: false, user: null };
      }
      return rejectWithValue(
        error.response?.data?.message || 'Kiểm tra trạng thái thất bại'
      );
    }
  }
);

// Trạng thái ban đầu
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Tạo slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý đăng nhập
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Xử lý đăng ký
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Chỉ cập nhật isAuthenticated nếu server trả về trạng thái đã xác thực
        if (action.payload && action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          // Nếu đăng ký thành công nhưng chưa đăng nhập
          state.isAuthenticated = false;
        }
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload || "Đăng ký thất bại. Vui lòng thử lại.";
})

      // Xử lý đăng xuất
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })

      // Xử lý kiểm tra trạng thái đăng nhập
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.user) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;