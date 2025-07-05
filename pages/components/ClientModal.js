// components/ClientModal.js
import { useState, useEffect } from "react";

export default function ClientModal({ isOpen, onClose, onSave, mode = "add", initialData = {} }) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "In Discussion"
  });

  // 🔁 When editing, pre-fill the form
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);  // ✅ Calls either add or update
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {mode === "edit" ? "Edit Client" : "Add New Client"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full p-2 border rounded"
            name="name"
            placeholder="Client Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 border rounded"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 border rounded"
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 border rounded"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <select
            name="status"
            className="w-full p-2 border rounded"
            value={formData.status}
            onChange={handleChange}
          >
            <option>In Discussion</option>
            <option>Active</option>
            <option>Completed</option>
          </select>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {mode === "edit" ? "Update" : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
