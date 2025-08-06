import React, { useState, useMemo, useEffect } from 'react';
import useProducts from '../hooks/useProducts';
import useUsers from '../hooks/useUsersData';
import useCategories from '../hooks/useCategories';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
const LoadingSpinner = () => (
  <div className="loading-spinner-container" role="status" aria-live="polite" aria-busy="true">
    <div className="loading-spinner-element"></div>
    <p>Loading data...</p>
  </div>
);
const ErrorMessageDisplay = ({ message }) => (
  <div role="alert" className="error-message-container" style={{ color: 'red' }}>
    <p>Error: {message}</p>
  </div>
);
const PRODUCTS_PER_PAGE = 6;
const ProductsPage = () => {
  const {
    data: products,
    loading: loadingProducts,
    error: errorProducts,
    refetch: refetchProducts,
  } = useProducts();
  const {
    data: users,
    loading: loadingUsers,
    error: errorUsers,
    refetch: refetchUsers,
  } = useUsers();
  const {
    data: categories,
    loading: loadingCategories,
    error: errorCategories,
    refetch: refetchCategories,
  } = useCategories();
  const [filters, setFilters] = useState({ searchTerm: '', categoryId: '' });
  const [page, setPage] = useState(1);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    setPage(1);
  }, [filters]);
  const vendors = useMemo(() => {
    return (users ?? []).filter((u) => u.user_type === 'mama_mboga');
  }, [users]);
  const categoryMap = useMemo(() => {
    return new Map((categories ?? []).map((c) => [String(c.category_id), c.category_name]));
  }, [categories]);
  const enrichedProducts = useMemo(() => {
    const vendorMap = new Map(vendors.map((v) => [String(v.id), v]));
    const searchLower = (filters.searchTerm ?? '').toLowerCase();
    return (products ?? [])
      .map((product) => {
        const vendor = vendorMap.get(String(product.vendor_id));
        const categoryName = categoryMap.get(String(product.category)) ?? 'Unknown';
        const vendorName = vendor
          ? `${vendor.first_name ?? ''} ${vendor.last_name ?? ''}`.trim() || `Vendor ${vendor.id}`
          : 'Unknown Vendor';
        return {
          productId: product.product_id,
          productName: product.name,
          imageUrl: product.image_url ?? null,
          pricePerUnit: Number(product.price_per_unit),
          currency: product.currency ?? 'KES',
          stockQuantity: Number(product.current_stock_quantity),
          vendorId: product.vendor_id,
          vendorName,
          categoryId: product.category,
          categoryName,
        };
      })
      .filter((item) => {
        if (filters.categoryId && String(item.categoryId) !== filters.categoryId) return false;
        if (!filters.searchTerm) return true;
        const priceStr = isNaN(item.pricePerUnit) ? '' : item.pricePerUnit.toFixed(2);
        return (
          item.productName.toLowerCase().includes(searchLower) ||
          priceStr.includes(searchLower) ||
          item.categoryName.toLowerCase().includes(searchLower) ||
          item.vendorName.toLowerCase().includes(searchLower)
        );
      });
  }, [products, vendors, categoryMap, filters]);
  const totalPages = Math.max(1, Math.ceil(enrichedProducts.length / PRODUCTS_PER_PAGE));
  const productsToShow = enrichedProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );
  const handleNextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1));
  const isLoading = loadingProducts || loadingUsers || loadingCategories;
  const combinedError = errorProducts || errorUsers || errorCategories;
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (combinedError) {
    return (
      <div className="products-page-container error-state">
        <h1>Product Management</h1>
        <ErrorMessageDisplay message={combinedError} />
        <button
          className="retry-button"
          onClick={() => {
            if (errorProducts) refetchProducts();
            if (errorUsers) refetchUsers();
            if (errorCategories) refetchCategories();
          }}
          aria-label="Retry loading data"
        >
          Try Again
        </button>
      </div>
    );
  }
  return (
    <div className="products-page-container">
      <h2>Product Lists For All Mama Mboga's</h2>
      <div className="filters-section">
        <div className="search-input-wrapper">
          <FontAwesomeIcon icon={faSearch} className="search-icon-inside-input" aria-hidden="true" />
          <input
            type="text"
            name="searchTerm"
            placeholder="Search by product name, price, category, or vendor..."
            value={filters.searchTerm}
            onChange={handleFilterChange}
            className="filter-input-field"
            aria-label="Search products"
          />
        </div>
        <select
          name="categoryId"
          value={filters.categoryId}
          onChange={handleFilterChange}
          className="filter-select-field"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {(categories ?? []).map((cat) => (
            <option key={cat.category_id} value={String(cat.category_id)}>
              {cat.category_name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setFilters({ searchTerm: '', categoryId: '' })}
          className="filter-reset-action"
          aria-label="Reset filters"
        >
          Reset Filters
        </button>
        <button
          type="button"
          onClick={() => {
            refetchProducts();
            refetchUsers();
            refetchCategories();
          }}
          className="filter-reset-action custom-refresh-icon"
          aria-label="Refresh all data"
          title="Refresh All Data"
        >
          <FontAwesomeIcon icon={faRefresh} />
        </button>
      </div>
      {productsToShow.length === 0 ? (
        <p className="no-products-message">No products found matching your criteria.</p>
      ) : (
        <div className="product-table-layout" role="table" aria-label="Products data table">
          <table className="products-data-table">
            <thead>
              <tr>
                <th scope="col">Image</th>
                <th scope="col">Product Name</th>
                <th scope="col">Price (per unit)</th>
                <th scope="col">Stock Quantity (kg or bunch)</th>
                <th scope="col">Category</th>
                <th scope="col">Vendor</th>
              </tr>
            </thead>
            <tbody>
              {productsToShow.map((item) => (
                <tr key={item.productId} className="product-table-row">
                  <td data-label="Image">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="product-image"
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td data-label="Product Name">{item.productName}</td>
                  <td data-label="Price">
                    {isNaN(item.pricePerUnit)
                      ? 'N/A'
                      : `${item.currency} ${item.pricePerUnit.toFixed(2)}`}
                  </td>
                  <td data-label="Stock Quantity">
                    {isNaN(item.stockQuantity) ? 'N/A' : item.stockQuantity.toFixed(2)}
                  </td>
                  <td data-label="Category">{item.categoryName}</td>
                  <td data-label="Vendor">{item.vendorName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {enrichedProducts.length > 0 && (
        <nav className="pagination-controls" aria-label="Product list pagination">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="pagination-button"
            aria-disabled={page === 1}
          >
            Previous
          </button>
          <span aria-live="polite" aria-atomic="true" className="pagination-status">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="pagination-button"
            aria-disabled={page === totalPages}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
};
export default ProductsPage;