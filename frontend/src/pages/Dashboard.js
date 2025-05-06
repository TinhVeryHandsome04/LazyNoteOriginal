// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import '../style/Dashboard.css';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { FaArrowRightArrowLeft, FaArrowTrendDown } from "react-icons/fa6";
import { HiShoppingBag } from "react-icons/hi";
import { RiUserReceivedLine } from "react-icons/ri";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse } from 'date-fns';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [startDate, setStartDate] = useState(parse('01-03-2025', 'dd-MM-yyyy', new Date()));
  const [endDate, setEndDate] = useState(parse('10-03-2025', 'dd-MM-yyyy', new Date()));
  const [overviewStats, setOverviewStats] = useState({
    totalIncome: 0,
    fixedExpense: 0,
    flexibleExpense: 0,
    transactionCount: 0,
  });
  const userName = "Username"; // Replace with dynamic username

  const fetchTransactions = async (start, end) => {
    try {
      const formattedStartDate = format(start, 'yyyy-MM-dd');
      const formattedEndDate = format(end, 'yyyy-MM-dd');

      // Call API endpoint with date filters
      const response = await fetch(`/api/transactions?start=${formattedStartDate}&end=${formattedEndDate}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();

      const transactionsWithType = data.transactions.map((transaction) => ({
        ...transaction,
        type: transaction.amount > 0 ? 'Thu nhập' : 'Chi tiêu',
        // Format date từ yyyy-MM-dd thành dd/MM/yyyy
        date: transaction.date.split('-').reverse().join('/')
      }));

      setTransactions(transactionsWithType);
      setSortedTransactions(transactionsWithType);

      const totalIncome = transactionsWithType
        .filter((t) => t.type === 'Thu nhập')
        .reduce((sum, t) => sum + t.amount, 0);

      const fixedExpense = transactionsWithType
        .filter((t) => t.type === 'Chi tiêu' && t.category === 'Điện nước')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const flexibleExpense = transactionsWithType
        .filter((t) => t.type === 'Chi tiêu' && t.category !== 'Điện nước')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const transactionCount = transactionsWithType.length;

      setOverviewStats({
        totalIncome,
        fixedExpense,
        flexibleExpense,
        transactionCount,
      });
    } catch (error) {
      console.error('Lỗi khi lấy giao dịch:', error);
      setTransactions([]);
      setSortedTransactions([]);
      setOverviewStats({
        totalIncome: 0,
        fixedExpense: 0,
        flexibleExpense: 0,
        transactionCount: 0,
      });
    }
  };

  useEffect(() => {
    fetchTransactions(startDate, endDate);
  }, [startDate, endDate]);

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    const sorted = [...sortedTransactions].sort((a, b) => {
      if (key === 'amount') {
        return direction === 'ascending' ? a[key] - b[key] : b[key] - a[key];
      }
      if (key === 'date') {
        const dateA = new Date(a[key].split('/').reverse().join('-'));
        const dateB = new Date(b[key].split('/').reverse().join('-'));
        return direction === 'ascending' ? dateA - dateB : dateB - dateA;
      }
      return direction === 'ascending'
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

    setSortedTransactions(sorted);
    setSortConfig({ key, direction });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Tổng quan tài chính</h1>
          <div className="date-range">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd-MM-yyyy"
              className="date-picker"
              placeholderText="DD-MM-YYYY"
            />
            {'  '}
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd-MM-yyyy"
              className="date-picker"
              placeholderText="DD-MM-YYYY"
            />
          </div>
        </div>

        <div className="overview-stats">
          <div className="stat-card">
            <span className="icon-income">
              <RiUserReceivedLine className="icon" />
            </span>
            <div>
              <h3>{overviewStats.totalIncome.toLocaleString()}đ</h3>
              <p>Tổng thu nhập</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="icon-fixed-expense">
              <FaArrowRightArrowLeft className="icon" />
            </span>
            <div>
              <h3>{overviewStats.fixedExpense.toLocaleString()}đ</h3>
              <p>Chi tiêu cố định</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="icon-flexible-expense">
              <HiShoppingBag className="icon" />
            </span>
            <div>
              <h3>{overviewStats.flexibleExpense.toLocaleString()}đ</h3>
              <p>Chi tiêu linh hoạt</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="icon-transactions">
              <FaArrowTrendDown className="icon" />
            </span>
            <div>
              <h3>{overviewStats.transactionCount}</h3>
              <p>Số giao dịch</p>
            </div>
          </div>
        </div>

        <div className="charts-section">
          <div className="chart-card">
            <h3>Biểu đồ chi tiêu</h3>
            <div className="line-chart-placeholder">
              <p>[Biểu đồ chi tiêu sẽ được hiển thị ở đây]</p>
            </div>
          </div>
          <div className="chart-card">
            <h3>Tỷ lệ chi tiêu theo danh mục</h3>
            <div className="donut-chart-placeholder">
              <div className="donut-chart"></div>
              <div className="chart-legend">
                <span className="legend-item"><span className="dot blue"></span> Sinh hoạt</span>
                <span className="legend-item"><span className="dot yellow"></span> Giải trí</span>
                <span className="legend-item"><span className="dot orange"></span> Tiết kiệm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-section">
          <div className="transactions-card">
            <h3>Giao dịch gần đây</h3>
            <table>
              <thead>
                <tr>
                  <th onClick={() => sortData('date')}>
                    <span className="th-content">
                      Ngày
                      <span className="sort-icon">
                        {sortConfig.key === 'date' ? (
                          sortConfig.direction === 'ascending' ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown className="neutral" />
                        )}
                      </span>
                    </span>
                  </th>
                  <th onClick={() => sortData('category')}>
                    <span className="th-content">
                      Danh mục
                      <span className="sort-icon">
                        {sortConfig.key === 'category' ? (
                          sortConfig.direction === 'ascending' ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown className="neutral" />
                        )}
                      </span>
                    </span>
                  </th>
                  <th onClick={() => sortData('amount')}>
                    <span className="th-content">
                      Số tiền
                      <span className="sort-icon">
                        {sortConfig.key === 'amount' ? (
                          sortConfig.direction === 'ascending' ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown className="neutral" />
                        )}
                      </span>
                    </span>
                  </th>
                  <th onClick={() => sortData('type')}>
                    <span className="th-content">
                      Loại giao dịch
                      <span className="sort-icon">
                        {sortConfig.key === 'type' ? (
                          sortConfig.direction === 'ascending' ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown className="neutral" />
                        )}
                      </span>
                    </span>
                  </th>
                  <th onClick={() => sortData('note')}>
                    <span className="th-content">
                      Ghi chú
                      <span className="sort-icon">
                        {sortConfig.key === 'note' ? (
                          sortConfig.direction === 'ascending' ? (
                            <FaCaretUp />
                          ) : (
                            <FaCaretDown />
                          )
                        ) : (
                          <FaCaretDown className="neutral" />
                        )}
                      </span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.length > 0 ? (
                  sortedTransactions.map((transaction, index) => (
                    <tr key={index}>
                      <td data-label="Ngày">{transaction.date}</td>
                      <td data-label="Danh mục">{transaction.category}</td>
                      <td
                        data-label="Số tiền"
                        className={transaction.amount > 0 ? 'positive' : 'negative'}
                      >
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}đ
                      </td>
                      <td data-label="Loại giao dịch">
                        <span
                          className={`transaction-type ${transaction.type === 'Thu nhập' ? 'income' : 'expense'}`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td data-label="Ghi chú">{transaction.note}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      Không có giao dịch nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="surplus-card">
            <h3>Tỷ lệ chi tiêu tháng</h3>
            <div className="donut-chart-placeholder">
              <div className="donut-chart">67%</div>
              <div className="chart-legend">
                <span className="legend-item"><span className="dot orange"></span> Đã chi tiêu</span>
                <span className="legend-item"><span className="dot blue"></span> Còn lại</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;