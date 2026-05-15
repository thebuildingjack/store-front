import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/Prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists."},
        { status: 400 }
      );
    }

    // hash the password
    const hashed = await bcrypt.hash(password, 10);

    // create the user
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    return NextResponse.json(
      { message: "Account created sucessfully.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error", error);
    return NextResponse.json(
      { error: "An error occurred during registration." },
      { status: 500 }
    );
  }
}