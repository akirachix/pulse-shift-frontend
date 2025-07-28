import React, { useState, useMemo, useEffect } from 'react';
import useProducts from '../hooks/useProducts';
import useUsers from '../hooks/useUsersData';
import useCategories from '../hooks/useCategories';
import useStockRecords from '../hooks/useStockRecords';

import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';

const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <div className="loading-spinner-element"></div>
    <p>Loading data...</p>
  </div>
);

const ErrorMessageDisplay = ({ message }) => (
  <div className="error-message-container">
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

  const {
    data: stockRecords,
    loading: loadingStock,
    error: errorStock,
    refetch: refetchStockRecords,
  } = useStockRecords();

  const [filters, setFilters] = useState({
    searchTerm: '',
    categoryId: '',
  });

  const [page, setPage] = useState(1);

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const vendors = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => user.user_type === 'mama_mboga');
  }, [users]);

  const categoryMap = useMemo(() => {
    if (!categories) return new Map();
    return new Map(categories.map((c) => [String(c.category_id), c.category_name]));
  }, [categories]);

  const enrichedProducts = useMemo(() => {
    if (!stockRecords || !products || !vendors || !categories) return [];

    const productMap = new Map(products.map((p) => [String(p.product_id), p]));
    const vendorMap = new Map(vendors.map((v) => [String(v.id), v]));

    const searchLower = filters.searchTerm.toLowerCase();

    return stockRecords
      .map((stock) => {
        const product = productMap.get(String(stock.product));
        const vendor = vendorMap.get(String(stock.mama_mboga));
        if (!product || !vendor) return null;

        const categoryName = categoryMap.get(String(product.category)) || 'Unknown';
        const vendorName = `${vendor.first_name ?? ''} ${vendor.last_name ?? ''}`.trim() || `Vendor ${vendor.id}`;

        return {
          listingId: stock.inventory_id,
          productId: product.product_id,
          productName: product.name,
          imageUrl: product.image_url || null,
          pricePerUnit: Number(stock.price_per_unit),
          currency: stock.currency || 'KES',
          stockQuantity: Number(stock.current_stock_quantity),
          vendorId: vendor.id,
          vendorName,
          categoryId: product.category,
          categoryName,
        };
      })
      .filter(Boolean)
      .filter((item) => {
        if (filters.categoryId && String(item.categoryId) !== filters.categoryId) {
          return false;
        }

        if (!filters.searchTerm) return true;

        const priceStr = isNaN(item.pricePerUnit) ? '' : item.pricePerUnit.toFixed(2);
        const search = searchLower;

        return (
          item.productName.toLowerCase().includes(search) ||
          priceStr.includes(search) ||
          item.categoryName.toLowerCase().includes(search) ||
          item.vendorName.toLowerCase().includes(search)
        );
      });
  }, [stockRecords, products, vendors, categories, filters, categoryMap]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const totalPages = Math.ceil(enrichedProducts.length / PRODUCTS_PER_PAGE) || 1;
  const productsToShow = enrichedProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const handleNextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const isLoading = loadingProducts || loadingUsers || loadingCategories || loadingStock;
  const combinedError = errorProducts || errorUsers || errorCategories || errorStock;

  if (isLoading) return <LoadingSpinner />;

  if (combinedError)
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
            if (errorStock) refetchStockRecords();
          }}
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="products-page-container">
      <h2>Product Lists For All Mama Mboga's</h2>

      <div className="filters-section">
        <div className="search-input-wrapper">
          <FontAwesomeIcon icon={faSearch} className="search-icon-inside-input" />
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
          {categories.map((cat) => (
            <option key={cat.category_id} value={String(cat.category_id)}>
              {cat.category_name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setFilters({ searchTerm: '', categoryId: '' })}
          className="filter-reset-action"
          aria-label="Reset filters"
        >
          Reset Filters
        </button>

        <button
          onClick={() => {
            refetchProducts();
            refetchUsers();
            refetchCategories();
            refetchStockRecords();
          }}
          className="filter-reset-action custom-refresh-icon"
          aria-label="Refresh all data"
          title="Refresh All Data"
          type="button"
        >
          <FontAwesomeIcon icon={faRefresh} />
        </button>
      </div>

      {productsToShow.length === 0 ? (
        <p className="no-products-message">No products found matching your criteria.</p>
      ) : (
        <div className="product-table-layout">
          <table className="products-data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price (per unit)</th>
                <th>Stock Quantity(kg or bunch)</th>
                <th>Category</th>
                <th>Vendor</th>
              </tr>
            </thead>
            <tbody>
              {productsToShow.map((item) => (
                <tr key={item.listingId} className="product-table-row">
                  <td data-label="Image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="product-image" />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td data-label="Product Name">{item.productName}</td>
                  <td data-label="Price">
                    {isNaN(item.pricePerUnit) ? 'N/A' : `${item.currency} ${item.pricePerUnit.toFixed(2)}`}
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
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={page === 1} className="pagination-button">
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={page === totalPages} className="pagination-button">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
