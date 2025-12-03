"use client";

import { useEffect, useState } from "react";

export default function AddEditPatientModal({
  open,
  onClose,
  onSubmit,
  initialData = null, // 👈 If provided → edit mode
}: any) {
  const [form, setForm] = useState({
    patient_id: null,
    first_name: "",
    last_name: "",
    birthdate: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
    philhealth_num: "",
  });

  // Load initialData into form (for editing)
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        birthdate: initialData.birthdate?.substring(0, 10), // format yyyy-mm-dd
      });
    }
  }, [initialData]);

  const handleChange = (e: any) => {
    const value = e.target.value;
    const name = e.target.name;

    setForm({ ...form, [name]: value });

    if (name === "birthdate") {
      const birth = new Date(value);
      const now = new Date();
      const diff = now.getFullYear() - birth.getFullYear();
      setForm((prev) => ({ ...prev, age: diff }));
    }
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  if (!open) return null;

  const isEdit = !!initialData;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Patient" : "Add Patient"}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <div className="col-span-2">
            <label className="text-sm text-gray-500">Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={form.birthdate}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <input
            name="age"
            placeholder="Age"
            value={form.age}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            name="contact"
            placeholder="Contact"
            value={form.contact}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <input
            name="philhealth_num"
            placeholder="Philhealth Number"
            value={form.philhealth_num}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isEdit ? "Save Changes" : "Add Patient"}
          </button>
        </div>
      </div>
    </div>
  );
}
