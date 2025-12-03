"use client";

import { useEffect, useState } from "react";
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

  // Fetch patients from API
  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data));
  }, []);

  // CREATE PATIENT
  const handleAddPatient = async (formData: any) => {
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const newPatient = await res.json();
      setPatients((prev) => [...prev, newPatient]);
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to create patient:", err);
    }
  };

  // OPEN EDIT MODAL
  const handleEdit = (patient: any) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };

  // UPDATE PATIENT
  const handleUpdatePatient = async (formData: any) => {
    try {
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
      setSelectedPatient(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // DELETE PATIENT
  const handleDeletePatient = async (patient_id: number) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    try {
      await fetch(`/api/patients?patient_id=${patient_id}`, {
        method: "DELETE",
      });

      // Remove from UI
      setPatients((prev) => prev.filter((p) => p.patient_id !== patient_id));
    } catch (err) {
      console.error("Failed to delete patient:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Patients</h1>

      {/* Create button → opens Add modal */}
      <CreateButton
        onClick={() => setShowAddModal(true)}
        className="bg-red-500 hover:bg-red-600 mb-4"
      />

      {/* Add Patient Modal */}
      <AddPatientModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddPatient}
      />

      {/* Edit Patient Modal */}
      {selectedPatient && (
        <EditPatientModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdatePatient}
          patient={selectedPatient}
        />
      )}

      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <ul className="space-y-4">
          {patients.map((p) => (
            <li key={p.patient_id} className="border p-4 rounded">
              <strong>
                {p.first_name} {p.last_name}
              </strong>
              <br />
              Age: {p.age} | Gender: {p.gender}
              <br />
              Contact: {p.contact}

              <div className="mt-2 flex gap-2">
                <EditButton onClick={() => handleEdit(p)} />
                <DeleteButton onClick={() => handleDeletePatient(p.patient_id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
