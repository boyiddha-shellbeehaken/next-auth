import { connect } from "@/app/dbConfig/dbConfig";
import User from "@/app/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect(); // connect DB

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    // validation
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does'nt exists" },
        { status: 400 }
      );
    }

    console.log("User Exists");
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      // Invalid Password
      return NextResponse.json(
        { error: "Check your credentials" },
        { status: 400 }
      );
    }

    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = await jwt.sign(tokenPayload, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Logged in successfully",
      success: true,
    });

    response.cookies.set("jwtToken", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
