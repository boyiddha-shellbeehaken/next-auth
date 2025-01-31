import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDataFromToken } from "@/app/helpers/getDataFromToken";

connect(); // connect DB

export async function POST(req) {
  // extract data from token

  const userId = await getDataFromToken(req);
  const user = await User.findOne({ _id: userId }).select("-password");
  // check if there is no user
  return NextResponse.json({
    message: "User found",
    data: user,
  });
}
