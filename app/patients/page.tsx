"use client";

import { useEffect, useState } from "react";
import CreateButton from "@/components/CreateButton";
import EditButton from "@/components/EditButton";
import DeleteButton from "@/components/DeleteButton";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);

  // Fetch patients from API
  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        console.log("API response:", data);
        setPatients(data);
      });
  }, []);

  // Dummy handlers — replace with real API calls
  const handleCreate = () => {
    console.log("Create button clicked");
  };

  const handleEdit = (id: number) => {
    console.log("Edit button clicked for patient", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete button clicked for patient", id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Patients</h1>

      {/* Create button at the top */}
      <CreateButton onClick={handleCreate} className="bg-red-500 hover:bg-red-600 mb-4" />

      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <ul>
          {patients.map((p) => (
            <li key={p.patient_id} style={{ marginBottom: 15 }}>
              <strong>
                {p.first_name} {p.last_name}
              </strong>
              <br />
              Age: {p.age} | Gender: {p.gender}
              <br />
              Contact: {p.contact}
              <div style={{ marginTop: 5 }}>
                <EditButton onClick={() => handleEdit(p.patient_id)} />
                <DeleteButton
                  onClick={() => handleDelete(p.patient_id)}
                  className="ml-2"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
