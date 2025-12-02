"use client";

import { useEffect, useState } from "react";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetch("/api/patients")               // call your API
      .then((res) => res.json())
      .then((data) => {
        console.log(data);               // you will see results here
        setPatients(data);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Patients</h1>

      {patients.length === 0 && <p>No patients found.</p>}

      <ul>
        {patients.map((p: any) => (
          <li key={p.patient_id}>
            <strong>{p.first_name} {p.last_name}</strong>
            <br />
            Age: {p.age} | Gender: {p.gender}
            <br />
            Contact: {p.contact}
          </li>
        ))}
      </ul>
    </div>
  );
}
