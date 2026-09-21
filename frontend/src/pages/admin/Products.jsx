import { useEffect, useMemo, useRef, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import { getAgeGroups } from "../../api/ageGroupApi";
import { uploadImages } from "../../api/uploadApi";

const emptyForm = {
  name: "",
  price: "",
  description: "",
  category: "",
  color: "",
  images: [],
  isActive: true,
  variants: [{ age: "", stock: "" }],
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadEverything();
  }, []);

  const loadEverything = async () => {
    setLoading(true);

    await Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchAgeGroups(),
    ]);

    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();

      setProducts(
        Array.isArray(data) ? data : data.products || []
      );
    } catch (error) {
      console.log("Failed to fetch products:", error);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(
        Array.isArray(data) ? data : data.categories || []
      );
    } catch (error) {
      console.log("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  const fetchAgeGroups = async () => {
    try {
      const data = await getAgeGroups();

      setAgeGroups(
        Array.isArray(data) ? data : data.ageGroups || []
      );
    } catch (error) {
      console.log("Failed to fetch age groups:", error);
      setAgeGroups([]);
    }
  };

  // ---------- form handlers ----------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { age: "", stock: "" }],
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedVariants = [...prev.variants];

      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value,
      };

      return { ...prev, variants: updatedVariants };
    });
  };

  const removeVariant = (index) => {
    setFormData((prev) => {
      if (prev.variants.length === 1) return prev;

      return {
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      };
    });
  };

  // ---------- image upload ----------

  const handleImageSelect = async (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    if (formData.images.length + files.length > 5) {
      alert("Maximum 5 images allowed per product");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const urls = await uploadImages(files, setUploadProgress);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Failed to upload image"
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ---------- modal open/close ----------

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name || "",
      price: product.price ?? "",
      description: product.description || "",
      category: product.category || "",
      color: product.color || "",
      images: product.images || [],
      isActive: product.isActive !== false,
      variants:
        product.variants && product.variants.length > 0
          ? product.variants.map((variant) => ({
              age: variant.age || "",
              stock: variant.stock ?? "",
            }))
          : [{ age: "", stock: "" }],
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  // ---------- submit ----------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const invalidVariant = formData.variants.some(
      (variant) =>
        !variant.age ||
        variant.stock === "" ||
        Number(variant.stock) < 0
    );

    if (invalidVariant) {
      alert("Please enter age and stock for all variants.");
      return;
    }

    const duplicateAge =
      new Set(formData.variants.map((v) => v.age)).size !==
      formData.variants.length;

    if (duplicateAge) {
      alert("Same age group is added more than once.");
      return;
    }

    const payload = {
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      category: formData.category,
      color: formData.color,
      images: formData.images,
      isActive: formData.isActive,
      variants: formData.variants.map((variant) => ({
        age: variant.age,
        stock: Number(variant.stock),
      })),
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateProduct(editingId, payload);
        alert("Product updated successfully!");
      } else {
        await createProduct(payload);
        alert("Product added successfully!");
      }

      closeModal();
      await fetchProducts();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          (editingId
            ? "Failed to update product"
            : "Failed to add product")
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Failed to delete product");
    }
  };

  const toggleActive = async (product) => {
    try {
      await updateProduct(product._id, {
        ...product,
        isActive: !product.isActive,
      });

      await fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    }
  };

  // ---------- derived ----------

  const getTotalStock = (variants) => {
    if (!variants || !Array.isArray(variants)) return 0;

    return variants.reduce(
      (total, variant) => total + Number(variant.stock || 0),
      0
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = search
        ? (product.name || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;

      const matchesCategory = categoryFilter
        ? product.category === categoryFilter
        : true;

      const matchesStatus = statusFilter
        ? statusFilter === "active"
          ? product.isActive !== false
          : product.isActive === false
        : true;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Products
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {loading
              ? "Loading..."
              : `${filteredProducts.length} of ${products.length} products`}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-pink-400 hover:bg-pink-500 text-white px-5 py-2.5 rounded-lg transition"
        >
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product..."
          className="flex-1 min-w-[200px] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {(search || categoryFilter || statusFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setCategoryFilter("");
              setStatusFilter("");
            }}
            className="text-sm text-gray-500 hover:text-gray-700 px-3"
          >
            Clear
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">

        <table className="w-full min-w-[820px]">

          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 align-top"
                >

                  {/* Image */}
                  <td className="p-4">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-pink-50 text-pink-300 text-xs flex items-center justify-center">
                        No image
                      </div>
                    )}
                  </td>

                  {/* Name */}
                  <td className="p-4 font-medium">
                    {product.name}

                    {product.color && (
                      <div className="text-xs text-gray-400 mt-1">
                        {product.color}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="p-4 text-gray-600">
                    {product.category}
                  </td>

                  {/* Price */}
                  <td className="p-4">₹{product.price}</td>

                  {/* Total Stock */}
                  <td className="p-4">
                    <span className="font-medium">
                      {getTotalStock(product.variants)}
                    </span>

                    <div className="text-xs text-gray-500 mt-1">
                      {product.variants?.map((variant, index) => (
                        <div key={index}>
                          {variant.age}: {variant.stock}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`text-xs px-3 py-1 rounded-full ${
                        product.isActive !== false
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.isActive !== false ? "Active" : "Inactive"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-4 whitespace-nowrap">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-blue-500 mr-4"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-semibold">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>

              <button
                onClick={closeModal}
                className="text-gray-500 text-xl"
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-2 gap-4">

                {/* Name */}
                <div className="col-span-2">
                  <label className="block text-sm mb-1">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Pink Cotton Nightsuit"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm mb-1">Price</label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="799"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm mb-1">Category</label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {categories.length === 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      No categories yet — add one from the Categories page.
                    </p>
                  )}
                </div>

                {/* Color */}
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Color</label>

                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Pink"
                  />
                </div>

                {/* Images */}
                <div className="col-span-2">

                  <label className="block text-sm mb-1">
                    Product Images
                    <span className="text-gray-400"> (max 5)</span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    disabled={uploading || formData.images.length >= 5}
                    className="hidden"
                  />

                  <div
                    onClick={() =>
                      !uploading &&
                      formData.images.length < 5 &&
                      fileInputRef.current?.click()
                    }
                    className={`border-2 border-dashed rounded-xl px-4 py-6 text-center transition ${
                      uploading || formData.images.length >= 5
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-pink-200 text-pink-500 hover:bg-pink-50 cursor-pointer"
                    }`}
                  >
                    {uploading
                      ? `Uploading... ${uploadProgress}%`
                      : formData.images.length >= 5
                      ? "Image limit reached"
                      : "Click to upload images (JPG, PNG, WEBP · max 5 MB each)"}
                  </div>

                  {uploading && (
                    <div className="w-full h-1.5 bg-pink-100 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-pink-400 transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {formData.images.map((url, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border"
                        >
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs leading-none flex items-center justify-center"
                          >
                            ×
                          </button>

                          {index === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                              Main
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                </div>

                {/* Variants */}
                <div className="col-span-2">

                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium">
                      Age & Stock
                    </label>

                    <button
                      type="button"
                      onClick={addVariant}
                      className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                    >
                      + Add Variant
                    </button>
                  </div>

                  <div className="space-y-3">

                    {formData.variants.map((variant, index) => (
                      <div key={index} className="flex items-end gap-3">

                        {/* Age */}
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">
                            Age
                          </label>

                          <select
                            value={variant.age}
                            onChange={(e) =>
                              handleVariantChange(index, "age", e.target.value)
                            }
                            required
                            className="w-full border rounded-lg px-3 py-2"
                          >
                            <option value="">Select Age</option>

                            {ageGroups.map((ageGroup) => (
                              <option
                                key={ageGroup._id}
                                value={ageGroup.label}
                              >
                                {ageGroup.label}
                              </option>
                            ))}

                            {/* Keep old value selectable even if it was removed later */}
                            {variant.age &&
                              !ageGroups.some(
                                (a) => a.label === variant.age
                              ) && (
                                <option value={variant.age}>
                                  {variant.age}
                                </option>
                              )}
                          </select>
                        </div>

                        {/* Stock */}
                        <div className="w-32">
                          <label className="block text-xs text-gray-500 mb-1">
                            Stock
                          </label>

                          <input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "stock",
                                e.target.value
                              )
                            }
                            required
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="10"
                          />
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          disabled={formData.variants.length === 1}
                          className="px-3 py-2 text-red-500 disabled:text-gray-300"
                        >
                          ×
                        </button>

                      </div>
                    ))}

                  </div>

                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-sm mb-1">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Describe your product..."
                  />
                </div>

                {/* Active */}
                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-4 h-4 accent-pink-400"
                    />
                    Show this product on the store
                  </label>
                </div>

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 bg-pink-400 hover:bg-pink-500 disabled:bg-pink-200 text-white rounded-lg"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Add Product"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Products;