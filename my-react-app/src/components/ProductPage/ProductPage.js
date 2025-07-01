import React, { useState } from "react";
import "./ProductPage.css";
import Sidebar from "../Sidebar/Sidebar";
import bananaImg from "../../assets/images/banana.jpeg";
import watermelonImg from "../../assets/images/water melon.jpeg";
import pinaapleImg from "../../assets/images/pinaaple.jpeg";
import appleImg from "../../assets/images/apple.png";
import mangoImg from "../../assets/images/mango.jpeg";
import tomatoImg from "../../assets/images/tomato.jpeg";
import spinachImg from "../../assets/images/spinach.jpeg";
import mamambogaImg from "../../assets/images/mamamboga.webp";

const initialProducts = [
  
  {
    name: "WaterMelon",
    price: "50KSH",
    quantity: "80 bunch",
    availability: "80 bunch",
    category: "Fruits",
    description: "Juicy watermelons.",
    image: watermelonImg
  },
  {
    name: "Pinaaple",
    price: "50KSH",
    quantity: "80 bunch",
    availability: "80 bunch",
    category: "Fruits",
    description: "Fresh pineapples.",
    image: pinaapleImg
  },
  {
    name: "Mango",
    price: "50KSH",
    quantity: "80 bunch",
    availability: "80 bunch",
    category: "Fruits",
    description: "Sweet mangoes.",
    image: mangoImg
  },
  {
    name: "Tomato",
    price: "50KSH",
    quantity: "80 bunch",
    availability: "80 bunch",
    category: "Pod Vegetables",
    description: "Fresh tomatoes.",
    image: tomatoImg
  },
  {
    name: "Apple",
    price: "50KSH",
    quantity: "80 bunch",
    availability: "80 bunch",
    category: "Fruits",
    description: "Crisp apples.",
    image: appleImg
  },
  {
    name: "Spinach",
    price: "50KSH",
    quantity: "80 bunch",
    availability: "80 bunch",
    category: "Leafy Greens",
    description: "Green spinach.",
    image: spinachImg
  },
  {
    name: "Banana",
    price: "60KSH",
    quantity: "80 kg",
    availability: "80 kg",
    category: "Fruits",
    description: "Bananas are sweet, creamy fruits rich in potassium and dietary fiber.",
    image: bananaImg
  }
];

function ProductCard({ product, onClick }) {
  return (
    <div className="product-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <img src={product.image} alt={product.name} className="product-img" />
      <div className="product-name">{product.name}</div>
      <div className="product-details">
        {product.price} <span className="product-qty">{product.quantity}</span>
      </div>
    </div>
  );
}

function ProductDetailsModal({ product, open, onClose, onEdit, onDelete }) {
  if (!open || !product) return null;
  return (
    <div
      className="product-modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="product-modal-content">
        <h3>{product.name}</h3>
        <img src={product.image} alt={product.name} style={{ width: 120, height: 120, objectFit: "cover", marginBottom: 16 }} />
        <p><b>Category:</b> {product.category}</p>
        <p><b>Price:</b> {product.price}</p>
        <p><b>Availability:</b> {product.availability || product.quantity}</p>
        <p><b>Description:</b> {product.description}</p>
        <div className="product-modal-actions">
          <button className="product-modal-btn" onClick={onEdit}>Edit</button>
          <button className="product-modal-btn cancel" onClick={onClose}>Close</button>
          <button
            className="product-modal-btn"
            style={{
              background: "#e53935",
              color: "#fff",
              marginLeft: "auto"
            }}
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AddEditProductModal({ open, onClose, onSubmit, initialProduct, isEdit, products }) {
  const [form, setForm] = useState(
    initialProduct || {
      name: "",
      price: "",
      availability: "",
      quantity: "",
      category: "",
      description: "",
      image: null,
      imagePreview: null,
    }
  );
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (initialProduct) {
      setForm({
        ...initialProduct,
        imagePreview: typeof initialProduct.image === "string" ? initialProduct.image : null
      });
      setError("");
    } else {
      setForm({
        name: "",
        price: "",
        availability: "",
        quantity: "",
        category: "",
        description: "",
        image: null,
        imagePreview: null,
      });
      setError("");
    }
  }, [initialProduct, open]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError("");
  };

  const handleImage = e => {
    const file = e.target.files[0];
    setForm(f => ({
      ...f,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : null,
    }));
    setError("");
  };

  const handleSubmit = e => {
    e.preventDefault();

    const nameTrimmed = form.name.trim().toLowerCase();
    const exists = products.some(p =>
      p.name.trim().toLowerCase() === nameTrimmed &&
      (!isEdit || (isEdit && (!initialProduct || p !== initialProduct)))
    );

    if (exists) {
      setError("Product already exists!");
      return;
    }

    if (
      form.name &&
      form.price &&
      (form.availability || form.quantity) &&
      form.category &&
      form.description &&
      (form.imagePreview || (typeof form.image === "string"))
    ) {
      onSubmit({
        name: form.name,
        price: form.price,
        availability: form.availability,
        quantity: form.availability || form.quantity,
        category: form.category,
        description: form.description,
        image: form.imagePreview || form.image,
      });
      setForm({
        name: "",
        price: "",
        availability: "",
        quantity: "",
        category: "",
        description: "",
        image: null,
        imagePreview: null,
      });
      setError("");
      onClose();
    }
  };

  if (!open) return null;
  return (
    <div
      className="product-modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="product-modal-content">
        <h3>{isEdit ? "Edit Product" : "Add New Product"}</h3>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Category:</td>
                <td>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
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
                <td>
                  <input
                    name="price"
                    type="text"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Availability:</td>
                <td>
                  <input
                    name="availability"
                    type="text"
                    value={form.availability}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td>Description:</td>
                <td>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={3}
                  />
                </td>
              </tr>
              <tr>
                <td>Image:</td>
                <td>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    required={!isEdit || !form.image}
                  />
                  {(form.imagePreview || typeof form.image === "string") && (
                    <img
                      src={form.imagePreview || form.image}
                      alt="Preview"
                      style={{ width: 48, height: 48, marginLeft: 8 }}
                    />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {error && (
            <div
              style={{
                color: "#e53935",
                fontWeight: "bold",
                fontSize: "1em",
                marginBottom: 10,
                textAlign: "center"
              }}
              className="product-error-message"
            >
              {error}
            </div>
          )}
          <div className="product-modal-actions">
            <button type="submit" className="product-modal-btn">
              {isEdit ? "Save" : "Add"}
            </button>
            <button
              type="button"
              className="product-modal-btn cancel"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ open, onClose, onConfirm, product }) {
  if (!open) return null;
  return (
    <div
      className="product-modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="product-modal-content" style={{ maxWidth: 400, textAlign: "center" }}>
        <h3 style={{ color: "#e53935", marginBottom: 16 }}>Delete Product</h3>
        <p>
          Are you sure you want to <b>delete</b> <span style={{ color: "#e53935" }}>{product?.name}</span>?
        </p>
        <div className="product-modal-actions" style={{ justifyContent: "center" }}>
          <button className="product-modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="product-modal-btn"
            style={{ background: "#e53935", color: "#fff" }}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductPage() {
  const [products, setProducts] = useState([...initialProducts]);
  const [tab, setTab] = useState("In-Stock");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const filtered = products.filter((p) => {
    const searchTerm = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(searchTerm) ||
      p.price.toLowerCase().includes(searchTerm) ||
      (p.quantity && p.quantity.toLowerCase().includes(searchTerm)) ||
      (p.category && p.category.toLowerCase().includes(searchTerm))
    );
  });

  const handleAddProduct = (product) => {
    setProducts(prev => [...prev, product]);
    setShowAdd(false);
  };

  const handleEditProduct = (product) => {
    setProducts(prev =>
      prev.map((p, i) =>
        i === products.indexOf(selectedProduct) ? product : p
      )
    );
    setShowEdit(false);
    setShowDetails(false);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
  };

  const handleEditFromDetails = () => {
    setShowEdit(true);
    setShowDetails(false);
  };

  const handleDeleteFromDetails = () => {
    setShowDelete(true);
    setShowDetails(false);
  };

  const handleConfirmDelete = () => {
    setProducts(prev => prev.filter(p => p !== selectedProduct));
    setShowDelete(false);
    setSelectedProduct(null);
  };

  return (
    <div className="product-page-root">
      <Sidebar />
      <div className="products-root">
        <div className="products-header">
          <img
            src={mamambogaImg}
            alt="profile"
            className="profile-img"
          />
          <span className="products-title">Products</span>
          <span className="notify-icon" />
        </div>
        <div className="products-search-bar">
          <span className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
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
          {filtered.map((product, idx) => (
            <ProductCard key={idx} product={product} onClick={() => handleProductClick(product)} />
          ))}
        </div>
        <button className="add-btn" onClick={() => setShowAdd(true)}>
          Add
          <span className="add-icon" />
        </button>
      </div>

      {/* Add Product Modal */}
      <AddEditProductModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleAddProduct}
        isEdit={false}
        products={products}
      />

      {/* Product Details Popup (with delete button) */}
      <ProductDetailsModal
        product={selectedProduct}
        open={showDetails}
        onClose={() => setShowDetails(false)}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteFromDetails}
      />

      {/* Edit Product Modal */}
      <AddEditProductModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={handleEditProduct}
        initialProduct={selectedProduct}
        isEdit={true}
        products={products}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleConfirmDelete}
        product={selectedProduct}
      />
    </div>
  );
}

export default ProductPage;