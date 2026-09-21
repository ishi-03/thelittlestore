import { useEffect, useState } from "react";
import {
  getAgeGroups,
  createAgeGroup,
  deleteAgeGroup,
} from "../../api/ageGroupApi";

const AgeGroups = () => {
  const [ageGroups, setAgeGroups] = useState([]);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAgeGroups();
  }, []);

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

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!label.trim()) {
      alert("Please enter an age group");
      return;
    }

    try {
      setLoading(true);

      await createAgeGroup(label.trim());

      setLabel("");

      await fetchAgeGroups();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Failed to add age group"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this age group? Existing products will keep their saved value."
    );

    if (!confirmDelete) return;

    try {
      await deleteAgeGroup(id);
      await fetchAgeGroups();
    } catch (error) {
      console.log(error);
      alert("Failed to delete age group");
    }
  };

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Age Groups
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          These show up in the product variant dropdown
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="flex flex-wrap gap-3 mb-6"
      >
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. 6-12 Months"
          className="flex-1 min-w-[220px] border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-pink-400 hover:bg-pink-500 disabled:bg-pink-200 text-white px-5 py-2.5 rounded-lg transition"
        >
          {loading ? "Adding..." : "Add Age Group"}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">

        {ageGroups.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No age groups yet
          </p>
        ) : (
          ageGroups.map((ageGroup) => (
            <div
              key={ageGroup._id}
              className="flex justify-between items-center px-5 py-4 border-b last:border-b-0"
            >
              <span className="font-medium text-gray-700">
                {ageGroup.label}
              </span>

              <button
                onClick={() => handleDelete(ageGroup._id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default AgeGroups;