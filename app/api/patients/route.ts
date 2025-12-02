import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM patients ORDER BY patient_id ASC");
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { first_name, last_name, birthdate, age, gender, contact, address, philhealth_num } = body;

    const result = await pool.query(
      `INSERT INTO patients
      (first_name, last_name, birthdate, age, gender, contact, address, philhealth_num)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [first_name, last_name, birthdate, age, gender, contact, address, philhealth_num]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { patient_id, first_name, last_name, birthdate, age, gender, contact, address, philhealth_num } = body;

    const result = await pool.query(
      `UPDATE patients
      SET first_name=$1, last_name=$2, birthdate=$3, age=$4, gender=$5, contact=$6, address=$7, philhealth_num=$8
      WHERE patient_id=$9
      RETURNING *`,
      [first_name, last_name, birthdate, age, gender, contact, address, philhealth_num, patient_id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patient_id = searchParams.get("patient_id");

    if (!patient_id) return NextResponse.json({ error: "patient_id is required" }, { status: 400 });

    await pool.query("DELETE FROM patients WHERE patient_id=$1", [patient_id]);

    return NextResponse.json({ message: "Patient deleted" });
  } catch (error: any) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
