import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchExpenses, addExpense, updateExpense, deleteExpense, getExpenseReport } from '../api/expenseApi';

// Thunk action để lấy danh sách chi tiêu
export const getExpenses = createAsyncThunk(
  'expense/getExpenses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchExpenses(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách chi tiêu');
    }
  }
);

// Thunk action để thêm chi tiêu mới
export const createExpense = createAsyncThunk(
  'expense/createExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await addExpense(expenseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể thêm chi tiêu');
    }
  }
);

// Thunk action để cập nhật chi tiêu
export const editExpense = createAsyncThunk(
  'expense/editExpense',
  async ({ id, expenseData }, { rejectWithValue }) => {
    try {
      const response = await updateExpense(id, expenseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật chi tiêu');
    }
  }
);

// Thunk action để xóa chi tiêu
export const removeExpense = createAsyncThunk(
  'expense/removeExpense',
  async (id, { rejectWithValue }) => {
    try {
      await deleteExpense(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa chi tiêu');
    }
  }
);

// Thunk action để lấy báo cáo chi tiêu
export const fetchExpenseReport = createAsyncThunk(
  'expense/fetchExpenseReport',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getExpenseReport(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy báo cáo chi tiêu');
    }
  }
);

// Trạng thái ban đầu
const initialState = {
  expenses: [],
  expense: null,
  report: null,
  loading: false,
  error: null,
};

// Tạo slice
const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setExpenseToEdit: (state, action) => {
      state.expense = action.payload;
    },
    clearExpenseToEdit: (state) => {
      state.expense = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý lấy danh sách chi tiêu
      .addCase(getExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(getExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Xử lý thêm chi tiêu mới
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.push(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Xử lý cập nhật chi tiêu
      .addCase(editExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editExpense.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.expenses.findIndex(expense => expense._id === action.payload._id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
        state.expense = null;
      })
      .addCase(editExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Xử lý xóa chi tiêu
      .addCase(removeExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = state.expenses.filter(expense => expense._id !== action.payload);
      })
      .addCase(removeExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Xử lý lấy báo cáo chi tiêu
      .addCase(fetchExpenseReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenseReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(fetchExpenseReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setExpenseToEdit, clearExpenseToEdit } = expenseSlice.actions;
export default expenseSlice.reducer;