import React, { useState, useEffect, useRef } from "react";
import "./style.css"; // Ensure your CSS is linked

// Helper to generate unique IDs for new products
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

// Initial products array (you can populate this)
const initialProducts = [
  // Example:
  // {
  //   id: generateId(),
  //   name: "Spinach",
  //   price: 50,
  //   currency: "KES",
  //   quantity: "10 bunch", // Example quantity format
  //   category: "Leafy Greens",
  //   description: "Fresh spinach bunches.",
  //   image: "/images/spinach.jpg", // Placeholder image path
  //   status: "in-stock", // Can be "in-stock", "out-of-stock", "draft"
  // },
];

// Determines product status based on quantity and category rules
const getProductCalculatedStatus = (product) => {
  if (product.status === "draft") return "draft"; // Drafts always remain drafts until promoted

  // Extract numeric value and unit from quantity string (e.g., "10 kg", "5 bunch")
  const quantityMatch = product.quantity.match(/(\d+)\s*(kg|bunch)/i);
  if (!quantityMatch) return "in-stock"; // Default if quantity format is unreadable

  const value = parseInt(quantityMatch[1], 10);
  const unit = quantityMatch[2].toLowerCase();

  // Define categories that use 'kg' or 'bunch' for stock calculation
  const isKgBased = [
    "fruits",
    "root vegetables",
    "bulb vegetables",
    "pod vegetables",
  ].includes(product.category.toLowerCase());
  const isBunchBased = ["leafy greens"].includes(product.category.toLowerCase());

  // Apply stock thresholds (e.g., <= 5 means out-of-stock)
  if (isKgBased && unit === "kg") return value > 5 ? "in-stock" : "out-of-stock";
  if (isBunchBased && unit === "bunch") return value > 5 ? "in-stock" : "out-of-stock";

  return "in-stock"; // Default for other cases or if rules don't apply
};

// --- Product Card Component ---
function ProductCard({ product, onClick }) {
  return (
    <div
      className="product-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <img src={product.image} alt={product.name} className="product-img" />
      <div className="product-name">{product.name}</div>
      <div className="product-details">
        {`${product.currency} ${product.price} `}
        <span className="product-qty">{product.quantity}</span>
      </div>
    </div>
  );
}

// --- Product Details Modal Component (for live products) ---
function ProductDetailsModal({ product, open, onClose, onEdit, onDelete }) {
  if (!open || !product) return null;
  return (
    <div
      className="product-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="product-modal-content">
        <h3>{product.name}</h3>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: 120, height: 120, objectFit: "cover", marginBottom: 16 }}
        />
        <p><b>Category:</b> {product.category}</p>
        <p><b>Price:</b> {`${product.currency} ${product.price}`}</p>
        <p><b>Availability:</b> {product.availability || product.quantity}</p>
        <p><b>Description:</b> {product.description}</p>
        <div className="product-modal-actions" style={{ gap: 8 }}>
          <button className="product-modal-btn" onClick={onEdit}>Edit</button>
          <button
            className="product-modal-btn"
            style={{ background: "#e53935", color: "#fff", marginLeft: "auto" }}
            onClick={onDelete}
          >
            Delete
          </button>
          <button className="product-modal-btn cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// --- Product Details Modal Component (for draft products) ---
function ProductDetailsModalDraft({
  product,
  open,
  onClose,
  onMoveProduct, // This prop handles moving product from draft to live
  onDelete,
  errorAddToProduct,
}) {
  if (!open || !product) return null;

  return (
    <div
      className="product-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="product-modal-content">
        <h3>{product.name}</h3>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: 120, height: 120, objectFit: "cover", marginBottom: 16 }}
        />
        <p><b>Category:</b> {product.category}</p>
        <p><b>Price:</b> {`${product.currency} ${product.price}`}</p>
        <p><b>Availability:</b> {product.availability || product.quantity}</p>
        <p><b>Description:</b> {product.description}</p>

        {errorAddToProduct && (
          <div style={{ color: "#e53935", fontWeight: "bold", fontSize: "1em", marginBottom: 10, textAlign: "center" }}>
            {errorAddToProduct}
          </div>
        )}

        <div className="product-modal-actions" style={{ gap: 8 }}>
          <button className="product-modal-btn" onClick={onMoveProduct}>
            Move Product {/* Changed from "Add to Product" */}
          </button>
          <button className="product-modal-btn cancel" onClick={onClose} style={{ marginLeft: "auto" }}>
            Cancel
          </button>
          <button
            className="product-modal-btn"
            style={{ background: "#e53935", color: "#fff" }}
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Add/Edit Product Modal Component ---
function AddEditProductModal({
  open,
  onClose,
  onSubmit, // For saving changes or adding new non-draft product
  onSaveDraft, // For saving as a draft
  initialProduct,
  isEdit, // true if editing an existing product
  isDraftEditMode, // true if currently editing a product that was a draft
  onAddToProductClick, // For promoting a draft to live product from this modal
}) {
  const [form, setForm] = useState(
    initialProduct || {
      name: "",
      price: "",
      currency: "KES",
      availability: "",
      quantity: "",
      category: "",
      description: "",
      image: null,
      imagePreview: null,
      status: "in-stock" // Default status for new products
    }
  );
  const [error, setError] = useState("");

  // Effect to reset form when modal opens or initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setForm({
        ...initialProduct,
        imagePreview: typeof initialProduct.image === "string" ? initialProduct.image : null,
      });
      setError("");
    } else {
      setForm({
        name: "",
        price: "",
        currency: "KES",
        availability: "",
        quantity: "",
        category: "",
        description: "",
        image: null,
        imagePreview: null,
        status: "in-stock"
      });
      setError("");
    }
  }, [initialProduct, open]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleImage = e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, image: file, imagePreview: URL.createObjectURL(file) }));
    setError("");
  };

  // Validates form and prepares product object for submission
  const validateAndPrepareProduct = () => {
    if (
      !form.name || !form.price || !form.currency || !(form.availability || form.quantity) ||
      !form.category || !form.description || !(form.imagePreview || typeof form.image === "string")
    ) {
      setError("Please fill in all required fields and provide an image.");
      return null;
    }
    // Determines status based on current mode (draft edit or regular)
    const status = isDraftEditMode
      ? form.status // Keep draft status if editing a draft, unless promoted
      : getProductCalculatedStatus({ ...form, quantity: form.availability || form.quantity });

    return {
      ...form,
      id: form.id || generateId(),
      price: Number(form.price),
      quantity: form.availability || form.quantity,
      image: form.imagePreview || form.image,
      status,
    };
  };

  // Handles "Save Changes" or "Add New Product" submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const product = validateAndPrepareProduct();
    if (!product) return;
    onSubmit(product, isDraftEditMode);
    setError("");
    onClose();
  };

  // Handles "Save as Draft" button click
  const handleSaveDraftClick = () => {
    // Ensures status is explicitly "draft" when saving as draft
    onSaveDraft({ ...form, status: "draft" });
    onClose();
  };

  // Handles "Add to Product" button click (for promoting drafts from this modal)
  const handleAddToProductClick = () => {
    if (
      !form.name || !form.price || !form.currency || !(form.availability || form.quantity) ||
      !form.category || !form.description || !(form.imagePreview || typeof form.image === "string")
    ) {
      setError("Please fill in all required fields and provide an image.");
      return;
    }
    const promotedProduct = {
      ...form,
      id: form.id || generateId(),
      price: Number(form.price),
      quantity: form.availability || form.quantity,
      image: form.imagePreview || form.image,
      status: getProductCalculatedStatus({ ...form, quantity: form.availability || form.quantity }), // Calculate final status
    };
    if (onAddToProductClick) onAddToProductClick(promotedProduct);
    setError("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="product-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`product-modal-content ${isEdit ? "edit-mode" : "add-mode"}`}>
        <h3>{isEdit ? (isDraftEditMode ? "Edit Draft Product" : "Edit Product") : "Add New Product"}</h3>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td>Name:</td>
                <td><input name="name" type="text" value={form.name} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td>Category:</td>
                <td>
                  <select name="category" value={form.category} onChange={handleChange} required>
                    <option value="">-- Select Category --</option>
                    <option value="Leafy Greens">Leafy Greens (e.g spinach, kale, lettuce)</option>
                    <option value="Root Vegetables">Root Vegetables (e.g carrot, potato)</option>
                    <option value="Bulb Vegetables">Bulb Vegetables (e.g onions, garlic)</option>
                    <option value="Pod Vegetables">Pod Vegetables (e.g peas, beans)</option>
                    <option value="Fruits">Fruits</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Price:</td>
                <td><input name="price" type="number" value={form.price} onChange={handleChange} required min="0" step="0.01" /></td>
              </tr>
              <tr>
                <td>Currency:</td>
                <td><input name="currency" type="text" value={form.currency} readOnly maxLength={5} placeholder="KES" /></td>
              </tr>
              <tr>
                <td>Availability:</td>
                <td><input name="availability" type="text" value={form.availability} onChange={handleChange} required /></td>
              </tr>
              <tr>
                <td>Description:</td>
                <td><textarea name="description" value={form.description} onChange={handleChange} required rows={3} /></td>
              </tr>
              <tr>
                <td>Image:</td>
                <td>
                  <input type="file" accept="image/*" onChange={handleImage} required={!isEdit || !form.imagePreview} />
                  {(form.imagePreview || typeof form.image === "string") && (
                    <img src={form.imagePreview || form.image} alt="Preview" style={{ width: 48, height: 48, marginLeft: 8 }} />
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {error && (
            <div className="product-error-message" style={{ color: "#e53935", fontWeight: "bold", fontSize: "1em", marginBottom: 10, textAlign: "center" }}>
              {error}
            </div>
          )}

          <div className="product-modal-actions" style={{ gap: 8 }}>
            <button type="submit" className="product-modal-btn">Save Changes</button>
            {isDraftEditMode && (
              <button
                type="button"
                className="product-modal-btn"
                style={{ background: "#4caf50", color: "#fff" }}
                onClick={handleAddToProductClick}
              >
                Add to Product
              </button>
            )}
            {!isDraftEditMode && !isEdit && (
              <button
                type="button"
                className="product-modal-btn"
                style={{ background: "#f0ad4e", color: "#fff" }}
                onClick={handleSaveDraftClick}
              >
                Save as Draft
              </button>
            )}
            <button type="button" className="product-modal-btn cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Confirm Delete Modal Component ---
function ConfirmDeleteModal({ open, onClose, onConfirm, product }) {
  if (!open) return null;

  return (
    <div className="product-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="product-modal-content" style={{ maxWidth: 400, textAlign: "center" }}>
        <h3 style={{ color: "#e53935", marginBottom: 16 }}>Delete Product</h3>
        <p>
          Are you sure you want to <b>delete</b> <span style={{ color: "#e53935" }}>{product?.name}</span>?
        </p>
        <div className="product-modal-actions" style={{ justifyContent: "center" }}>
          <button className="product-modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="product-modal-btn" style={{ background: "#e53935", color: "#fff" }} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Product Page Component ---
function ProductPage() {
  const [products, setProducts] = useState(() =>
    initialProducts.map((p) => ({ ...p, status: p.status || getProductCalculatedStatus(p) }))
  );
  const [tab, setTab] = useState("In-Stock");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false); // Controls visibility of ProductDetailsModal
  const [selectedProduct, setSelectedProduct] = useState(null); // Product selected for details/edit
  const [selectedDraft, setSelectedDraft] = useState(null); // Draft selected for details/move
  const [showDraftEdit, setShowDraftEdit] = useState(false); // Controls visibility of ProductDetailsModalDraft
  const [errorAddToProduct, setErrorAddToProduct] = useState(""); // Error message for draft promotion validation
  const notificationRef = useRef(null);
  const [showNotification, setShowNotification] = useState(false); // Controls visibility of out-of-stock notification

  // Effect to handle clicking outside the notification to close it
  useEffect(() => {
    function handleClickOutside(e) {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotification(false);
      }
    }
    if (showNotification) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotification]);

  // Filters out-of-stock products for notification display
  const outOfStockProducts = products
    .filter((p) => p.status !== "draft" && getProductCalculatedStatus(p) === "out-of-stock")
    .map((p) => `${p.name} is out of stock`);

  // Filters products based on current tab and search query
  const filteredProducts = products.filter((p) => {
    const st = search.toLowerCase();
    const matches =
      p.name.toLowerCase().includes(st) ||
      String(p.price).toLowerCase().includes(st) ||
      (p.currency && p.currency.toLowerCase().includes(st)) ||
      (p.quantity && p.quantity.toLowerCase().includes(st)) ||
      (p.category && p.category.toLowerCase().includes(st));

    if (tab === "In-Stock") {
      return matches && p.status !== "draft" && getProductCalculatedStatus(p) === "in-stock";
    }
    if (tab === "Out-of-Stock") {
      return matches && p.status !== "draft" && getProductCalculatedStatus(p) === "out-of-stock";
    }
    if (tab === "Drafts") {
      return matches && p.status === "draft";
    }
    return matches; // Fallback for 'All Products' or similar tab (if added)
  });

  // Handler for adding a new product (either live or promoting a draft to live)
  const handleAddProduct = (newProduct) => {
    // This handler promotes a product out of draft (if it was a draft) or adds a brand new live product.
    setProducts((prev) => [...prev.filter((p) => p.id !== newProduct.id), newProduct]);
    setShowAdd(false);
    setShowEdit(false); // Close edit modal if it was open for draft promotion
    setSelectedDraft(null); // Clear selected draft if it was promoted
    setSelectedProduct(newProduct); // Select the newly added/promoted product
    setShowDetails(true); // Show its details
    setTab(newProduct.status); // Switch to the relevant tab
  };

  // Handler for editing an existing product (live or draft)
  const handleEditProduct = (editedProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === editedProduct.id ? editedProduct : p)));
    setShowEdit(false);
    setSelectedProduct(null);
    setSelectedDraft(null);
  };

  // Handler for saving a product as a draft
  const handleSaveDraft = (draftProduct) => {
    const productToSave = { ...draftProduct, status: "draft" }; // Force status to "draft"
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === productToSave.id);
      if (idx !== -1) return prev.map((p, i) => (i === idx ? productToSave : p)); // Update existing draft
      return [...prev, productToSave]; // Add new draft
    });
    setShowAdd(false);
    setShowDraftEdit(false); // Close relevant modals
  };

  // Handler for clicking a product card (opens details modal)
  const handleProductClick = (product) => {
    if (product.status === "draft") {
      setSelectedDraft(product);
      setShowDraftEdit(true); // Open draft details modal
    } else {
      setSelectedProduct(product);
      setShowDetails(true); // Open regular product details modal
    }
  };

  // Handler to open edit modal from product details modal
  const handleEditFromDetails = () => {
    setShowEdit(true);
    setShowDetails(false);
  };

  // Handler to open delete confirmation modal from product details modal
  const handleDeleteFromDetails = () => {
    setShowDelete(true);
    setShowDetails(false);
  };

  // Handler to confirm product deletion
  const handleConfirmDelete = () => {
    setProducts((prev) =>
      prev.filter(
        (p) => p.id !== selectedProduct?.id && p.id !== selectedDraft?.id // Delete selected live product or draft
      )
    );
    setShowDelete(false); // Close delete confirmation
    setSelectedProduct(null); // Clear selected
    setSelectedDraft(null); // Clear selected
  };

  // Handler for "Move Product" button in Draft Details Modal
  const handleMoveProductFromDraft = () => {
    if (!selectedDraft) return;

    // Basic validation before moving
    if (
      !(
        selectedDraft.name &&
        selectedDraft.price &&
        selectedDraft.currency &&
        (selectedDraft.availability || selectedDraft.quantity) &&
        selectedDraft.category &&
        selectedDraft.description &&
        (selectedDraft.image || selectedDraft.imagePreview)
      )
    ) {
      setErrorAddToProduct(
        "Please complete all required fields and provide an image before moving this product."
      );
      return;
    }

    // Calculate the final status for the promoted product (in-stock or out-of-stock)
    const promotedStatus = getProductCalculatedStatus({
      ...selectedDraft,
      quantity: selectedDraft.availability || selectedDraft.quantity,
    });
    const promotedProduct = { ...selectedDraft, status: promotedStatus };

    // Update the products state: remove the old draft, add the newly promoted product
    setProducts((prev) => [
      ...prev.filter((p) => p.id !== promotedProduct.id),
      promotedProduct,
    ]);

    // Clear state and close draft modal
    setErrorAddToProduct("");
    setShowDraftEdit(false);
    setSelectedDraft(null);

    // Set promoted product as selected for immediate viewing/editing and open edit modal
    setSelectedProduct(promotedProduct);
    setShowEdit(true); // Opens edit modal for the newly promoted product
    setTab(promotedStatus); // Changes tab to display the promoted product
  };

  // Handler for "Add to Product" button in the AddEditProductModal when editing a draft
  // This promotes the draft product from within the edit modal itself
  const handleAddToProductFromEditModal = (promotedProduct) => {
    const newStatus = getProductCalculatedStatus(promotedProduct);
    const product = { ...promotedProduct, status: newStatus }; // Assign calculated status
    setProducts((prev) => [...prev.filter((p) => p.id !== product.id), product]); // Update products list
    setShowEdit(false);
    setSelectedProduct(product);
    setShowDetails(true);
    setTab(newStatus);
  };

  return (
    <div className="product-page-root">
      <div className="products-root">
        <div className="products-header">
          <img
            src="/images/mamamboga.webp"
            alt="profile"
            className="profile-img"
          />
          <span className="products-title">Products</span>
          <span
            className="notify-icon"
            title="Show Out-of-stock Notifications"
            onClick={() => setShowNotification(!showNotification)}
            style={{ cursor: "pointer" }}
          />
        </div>

        {showNotification && (
          <div
            ref={notificationRef}
            style={{
              position: "absolute",
              top: 60,
              right: 25,
              background: "#fff8e1",
              border: "1px solid #ffd54f",
              padding: 16,
              borderRadius: 5,
              maxWidth: 320,
              color: "#d84315",
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              zIndex: 1000,
              fontWeight: 500,
              fontSize: "0.9em",
            }}
          >
            <b>Out of Stock Alerts:</b>
            <div style={{ marginTop: 8 }}>
              {outOfStockProducts.length === 0
                ? "No products are currently out of stock."
                : outOfStockProducts.map((msg, i) => (
                    <div key={i}>{msg}</div>
                  ))}
            </div>
          </div>
        )}

        <div className="products-search-bar">
          <span className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="products-tabs">
          {["In-Stock", "Out-of-Stock", "Drafts"].map((t) => (
            <div
              key={t}
              onClick={() => setTab(t)}
              className={`products-tab${tab === t ? " active" : ""}`}
            >
              {t}
            </div>
          ))}
        </div>

        <div className="products-grid">
          {(tab === "Drafts" // Filter for "Drafts" tab
            ? filteredProducts.filter((p) => p.status === "draft")
            : filteredProducts // Filter for "In-Stock" or "Out-of-Stock" tabs
          ).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>

        <button className="add-btn" onClick={() => setShowAdd(true)}>
          Add <span className="add-icon" />
        </button>
      </div>

      {/* Add Product Modal (used for adding brand new products) */}
      <AddEditProductModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAddProduct} // Add new product to live inventory
        onSaveDraft={handleSaveDraft} // Save new product as draft
        isEdit={false}
        products={products}
      />

      {/* Edit Product Modal (used for editing live products or promoting drafts) */}
      <AddEditProductModal
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
          setErrorAddToProduct("");
        }}
        onSubmit={handleEditProduct} // Save changes to existing product
        onSaveDraft={handleSaveDraft} // Save as draft (if editing a non-draft product, can save a copy as draft)
        initialProduct={selectedProduct}
        isEdit={true}
        products={products}
        isDraftEditMode={selectedProduct?.status === "draft"} // Tells modal if currently editing a draft
        onAddToProductClick={handleAddToProductFromEditModal} // Promotes draft to live from edit modal
      />

      {/* Product Details Modal (for live products) */}
      {showDetails && selectedProduct && (
        <ProductDetailsModal
          open={!!selectedProduct && !showEdit}
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setShowDetails(false);
          }}
          onEdit={handleEditFromDetails}
          onDelete={handleDeleteFromDetails}
        />
      )}

      {/* Draft Product Details Modal (for draft products) */}
      {showDraftEdit && selectedDraft && (
        <ProductDetailsModalDraft
          open={!!selectedDraft && !showEdit}
          product={selectedDraft}
          onClose={() => {
            setShowDraftEdit(false);
            setSelectedDraft(null);
          }}
          onMoveProduct={handleMoveProductFromDraft} // Handler for "Move Product" button
          onDelete={() => {
            setProducts((p) => p.filter((pr) => pr.id !== selectedDraft.id)); // Delete draft directly
            setShowDraftEdit(false);
            setSelectedDraft(null);
          }}
          errorAddToProduct={errorAddToProduct}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
        product={selectedProduct || selectedDraft} // Deletes whichever is selected
      />
    </div>
  );
}

export default ProductPage;
