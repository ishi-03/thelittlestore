import React, { useEffect, useState } from "react";
import {
  getAllCategories as getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categoryApi";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(
        Array.isArray(data)
          ? data
          : data.categories || []
      );
    } catch (error) {
      console.log("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Please enter category name");
      return;
    }

    try {
      setLoading(true);

      await createCategory(categoryName.trim());

      setCategoryName("");

      await fetchCategories();

      alert("Category added successfully!");
    } catch (error) {
      console.log(error);

      if (error.response?.status === 11000) {
        alert("Category already exists");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to add category"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Rename / activate / deactivate
  const handleUpdate = async (category, changes) => {
    try {
      const updated = await updateCategory(category._id, changes);
      setCategories((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update category"
      );
    }
  };

  const handleRename = (category) => {
    const name = window.prompt("Rename category", category.name);
    if (name === null || !name.trim() || name.trim() === category.name) return;
    handleUpdate(category, { name: name.trim() });
  };

  // Delete category
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCategory(id);

      setCategories((prev) =>
        prev.filter((category) => category._id !== id)
      );

      alert("Category deleted successfully!");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Categories
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage product categories
        </p>
      </div>

      {/* Add Category */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add Category
        </h2>

        <form
          onSubmit={handleAddCategory}
          className="flex gap-3"
        >
          <input
            type="text"
            value={categoryName}
            onChange={(e) =>
              setCategoryName(e.target.value)
            }
            placeholder="Enter category name"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-pink-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-pink-400 hover:bg-pink-500 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-lg transition"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Existing Categories
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No categories found
          </div>
        ) : (
          <div className="divide-y">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
              >
                <span className="text-gray-700 font-medium">
                  {category.name}
                  {category.isActive === false && (
                    <span className="ml-2 text-xs text-gray-400">(Inactive)</span>
                  )}
                </span>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleRename(category)}
                    className="text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleUpdate(category, { isActive: category.isActive === false })
                    }
                    className="text-gray-500 hover:text-gray-700 font-medium"
                  >
                    {category.isActive === false ? "Activate" : "Deactivate"}
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(category._id)
                    }
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;