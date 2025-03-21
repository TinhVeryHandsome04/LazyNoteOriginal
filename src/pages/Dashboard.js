import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getExpenses } from '../redux/expenseSlice';
import ExpenseList from '../components/ExpenseList';

// Thêm vào trước hàm Dashboard
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
const Dashboard = () => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expense);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getExpenses());
  }, [dispatch]);

  // Tính tổng chi tiêu
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Tính chi tiêu theo danh mục
  const expenseByCategory = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});

  // Tính chi tiêu theo tháng
  const currentYear = new Date().getFullYear();
  const expenseByMonth = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    if (date.getFullYear() === currentYear) {
      const month = date.getMonth();
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += expense.amount;
    }
    return acc;
  }, {});

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Xin chào, {user?.name || 'Người dùng'}</h1>
        <p>Đây là tổng quan về chi tiêu của bạn</p>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card total-expenses">
          <h3>Tổng chi tiêu</h3>
          <p className="amount">{formatCurrency(totalExpense)}</p>
        </div>
        <div className="summary-card this-month">
          <h3>Chi tiêu tháng này</h3>
          <p className="amount">
            {formatCurrency(expenseByMonth[new Date().getMonth()] || 0)}
          </p>
        </div>
        <div className="summary-card average">
          <h3>Trung bình hàng tháng</h3>
          <p className="amount">
            {formatCurrency(totalExpense / Math.max(1, Object.keys(expenseByMonth).length))}
          </p>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Chi tiêu theo danh mục</h3>
          <div className="chart-container category-chart">
            {/* Biểu đồ category chart sẽ được render ở đây */}
            <div className="chart-placeholder">
              {Object.entries(expenseByCategory).map(([category, amount]) => (
                <div key={category} className="category-bar">
                  <div className="category-label">{category}</div>
                  <div className="category-amount">{formatCurrency(amount)}</div>
                  <div 
                    className="category-bar-fill" 
                    style={{ 
                      width: `${(amount / totalExpense) * 100}%`,
                      backgroundColor: getCategoryColor(category)
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Chi tiêu theo tháng</h3>
          <div className="chart-container monthly-chart">
            {/* Biểu đồ monthly chart sẽ được render ở đây */}
            <div className="chart-placeholder">
              {months.map((month, index) => (
                <div key={month} className="month-bar">
                  <div className="month-label">{month}</div>
                  <div className="month-amount">{formatCurrency(expenseByMonth[index] || 0)}</div>
                  <div 
                    className="month-bar-fill" 
                    style={{ 
                      height: `${(expenseByMonth[index] || 0) / Math.max(...Object.values(expenseByMonth), 1) * 100}%` 
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="recent-expenses">
        <h2>Chi tiêu gần đây</h2>
        <ExpenseList limit={5} />
      </div>

      <div className="dashboard-actions">
        <button className="action-button add-expense">
          Thêm chi tiêu mới
        </button>
        <button className="action-button view-reports">
          Xem báo cáo đầy đủ
        </button>
      </div>
    </div>
  );
};

// Hàm helper để lấy màu cho từng danh mục
function getCategoryColor(category) {
  const colors = {
    food: '#FF6384',
    transportation: '#36A2EB',
    entertainment: '#FFCE56',
    bills: '#4BC0C0',
    shopping: '#9966FF',
    others: '#FF9F40'
  };
  return colors[category] || '#C9C9C9';
}

export default Dashboard;