import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Modal from './components/UserModal';
import useFetchUserData from "../hooks/useGetUsers";
import "./index.css";

function formatDate(isoString) {
  if (!isoString) return "--";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const UserProfile = () => {
  const { users, loading, error } = useFetchUserData();
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [activeTab, setActiveTab] = useState("Customer");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  if (error && error.includes("No authentication token found")) {
    navigate("/signin");
  }
  const mappedUsers = users
  .map(user => ({
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    mobile: user.phone_number,
    role: user.user_type === "customer" ? "Customer" : "Vendor",
    is_active: user.is_active,
    registration_date: user.registration_date,
    email: user.email,
    user_data: user,
  }))
  .filter(user => user.role === "Customer" || user.role === "Vendor");


  const filteredUsers = mappedUsers.filter(
    (user) =>
      user.role === activeTab &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile.includes(searchTerm))
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalUsers = mappedUsers.length;
  const totalCustomers = mappedUsers.filter((u) => u.role === "Customer").length;
  const totalVendors = mappedUsers.filter((u) => u.role === "Vendor").length;
  const earliestRegistrationDate =
    mappedUsers.length > 0
      ? mappedUsers.reduce((minDate, user) => {
          const userDate = new Date(user.registration_date);
          return userDate < minDate ? userDate : minDate;
        }, new Date(mappedUsers[0].registration_date))
      : null;

  if (loading) return <div className="loading">Loading...</div>;

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="dashboard">
      <main className="main-content">
        <header>
          <h1>Welcome Back</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by Name or Number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button type="button" className="search-button" aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="user-info">Admin User</div>
        </header>

        <div className="cards">
          <div className="card total-users">
            <div className="card-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            {totalUsers} Users<br />
            Total Registered<br />
            {earliestRegistrationDate ? formatDate(earliestRegistrationDate.toISOString()) : "--"}
          </div>

          <div className="card total-customers">
            <div className="card-icon">
              <i className="fas fa-user"></i>
            </div>
            {totalCustomers} Customers<br />
            Active Customers<br />
            {formatDate(new Date().toISOString())}
          </div>

          <div className="card total-vendors">
            <div className="card-icon">
              <i className="fas fa-store"></i>
            </div>
            {totalVendors} Vendors<br />
            Active Vendors<br />
            {formatDate(new Date().toISOString())}
          </div>
        </div>

        <div className="table-section">
          <div className="tabs">
            <button
              className={activeTab === "Customer" ? "active" : ""}
              onClick={() => {
                setActiveTab("Customer");
                setCurrentPage(1);
              }}
            >
              Customers
            </button>
            <button
              className={activeTab === "Vendor" ? "active" : ""}
              onClick={() => {
                setActiveTab("Vendor");
                setCurrentPage(1);
              }}
            >
              Vendors
            </button>
          </div>

          {error && <div className="error-msg">Error: {error}</div>}

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile No.</th>
                <th>Active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.mobile}</td>
                    <td>{user.is_active ? "Yes" : "No"}</td>
                    <td>
                      <button className="view-btn" onClick={() => showUserDetails(user)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {selectedUser && (
            <div className="user-details">
              <h2>{selectedUser.name}</h2>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {selectedUser.mobile}
              </p>
              <p>
                <strong>User Type:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Registration Date:</strong> {formatDate(selectedUser.registration_date)}
              </p>
              <p>
                <strong>Active:</strong> {selectedUser.is_active ? "Yes" : "No"}
              </p>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
};

export default UserProfile;