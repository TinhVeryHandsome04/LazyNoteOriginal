import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getExpenses, removeExpense } from '../redux/expenseSlice';

// Thêm hàm formatCurrency vào trong component
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

const ExpenseList = () => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expense);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoản chi tiêu này?')) {
      dispatch(removeExpense(id));  // Thay deleteExpense bằng removeExpense
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredExpenses = expenses.filter((expense) => {
    if (filter === 'all') return true;
    return expense.category === filter;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2>Danh sách chi tiêu</h2>
        <div className="filter-container">
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">Tất cả</option>
            <option value="food">Ăn uống</option>
            <option value="transportation">Di chuyển</option>
            <option value="entertainment">Giải trí</option>
            <option value="bills">Hóa đơn</option>
            <option value="shopping">Mua sắm</option>
            <option value="others">Khác</option>
          </select>
        </div>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="no-expenses">Không có khoản chi tiêu nào.</div>
      ) : (
        <div className="expense-table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('date')}>
                  Ngày {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('description')}>
                  Mô tả {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('category')}>
                  Danh mục {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('amount')}>
                  Số tiền {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                </th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{new Date(expense.date).toLocaleDateString('vi-VN')}</td>
                  <td>{expense.description}</td>
                  <td>
                    <span className={`category-badge ${expense.category}`}>{expense.category}</span>
                  </td>
                  <td className="amount">{formatCurrency(expense.amount)}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick={() => /* handleEdit(expense) */{}}>
                      Sửa
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(expense._id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;