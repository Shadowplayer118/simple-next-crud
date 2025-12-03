"use client";

import { useEffect, useState, useMemo } from "react";
import CreateButton from "@/components/CreateButton";
import EditButton from "@/components/EditButton";
import DeleteButton from "@/components/DeleteButton";
import AddPatientModal from "@/components/AddPatientModal";
import EditPatientModal from "@/components/EditPatientModal";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // 🔍 Search + Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"name" | "age">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 📄 Pagination
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data));
  }, []);

  // 🔍 Filter + Sort
  const filteredPatients = useMemo(() => {
    return patients
      .filter((p) => {
        const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) ||
               p.contact?.toLowerCase()?.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        if (sortField === "name") {
          const A = `${a.first_name} ${a.last_name}`.toLowerCase();
          const B = `${b.first_name} ${b.last_name}`.toLowerCase();
          return sortOrder === "asc" ? A.localeCompare(B) : B.localeCompare(A);
        }
        return sortOrder === "asc" ? a.age - b.age : b.age - a.age;
      });
  }, [patients, searchQuery, sortField, sortOrder]);

  // 📄 Pagination Logic
  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleAddPatient = async (formData: any) => {
    const res = await fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const newPatient = await res.json();
    setPatients((prev) => [...prev, newPatient]);
    setShowAddModal(false);
  };

  const handleEdit = (patient: any) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };

  const handleUpdatePatient = async (formData: any) => {
    const res = await fetch("/api/patients", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const updated = await res.json();
    setPatients((prev) =>
      prev.map((p) => (p.patient_id === updated.patient_id ? updated : p))
    );

    setShowEditModal(false);
  };

  const handleDeletePatient = async (id: number) => {
    if (!confirm("Delete this patient?")) return;
    await fetch(`/api/patients?patient_id=${id}`, { method: "DELETE" });
    setPatients((prev) => prev.filter((p) => p.patient_id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Patients</h1>

      {/* ➕ CREATE */}
      <CreateButton
        onClick={() => setShowAddModal(true)}
        className="bg-red-500 hover:bg-red-600 mb-4"
      />

      {/* 🔍 SEARCH & SORT */}
      <div className="flex gap-3 mb-4">
        <input
          className="border p-2 rounded w-64"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
        />
        <select className="border p-2 rounded" value={sortField} onChange={(e) => setSortField(e.target.value as any)}>
          <option value="name">Name</option>
          <option value="age">Age</option>
        </select>
        <button
          className="border px-3 rounded bg-gray-200"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? "⬆" : "⬇"}
        </button>
      </div>

      <AddPatientModal open={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddPatient} />
      {selectedPatient && (
        <EditPatientModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdatePatient}
          patient={selectedPatient}
        />
      )}

      {/* 📄 PATIENT LIST */}
      {paginatedPatients.length === 0 ? (
        <p>No results.</p>
      ) : (
        <ul className="space-y-4">
          {paginatedPatients.map((p) => (
            <li key={p.patient_id} className="border p-4 rounded">
              <strong>{p.first_name} {p.last_name}</strong><br/>
              Age: {p.age} | Gender: {p.gender}<br/>
              Contact: {p.contact}
              <div className="mt-2 flex gap-2">
                <EditButton onClick={() => handleEdit(p)} />
                <DeleteButton onClick={() => handleDeletePatient(p.patient_id)} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 📍 PAGINATION CONTROLS */}
      <div className="flex gap-2 mt-6">
        <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}
          className="border px-3 py-1 rounded disabled:opacity-40">Prev</button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => changePage(i + 1)}
            className={`border px-3 py-1 rounded ${currentPage === i + 1 ? "bg-gray-300 font-bold" : ""}`}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}
          className="border px-3 py-1 rounded disabled:opacity-40">Next</button>
      </div>

    </div>
  );
}
