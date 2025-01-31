import { connect } from "@/app/dbConfig/dbConfig";
import { NextResponse, NextRequest } from "next/server";

connect(); // connect DB

export async function GET(req) {
  try {
    const response = NextResponse.json({
      message: "Log out successfully",
      success: true,
    });

    response.cookies.set("jwtToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
