import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";

//Define user schema
const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password } = userSchema.parse(body);

    // check if email exists
    const userByEmail = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (userByEmail) {
      return NextResponse.json(
        { user: null, error: "User already exists" },
        { status: 409 }
      );
    }

    // check if username exists
    const userByUsername = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (userByUsername) {
      return NextResponse.json(
        { user: null, error: "Username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    // create user
    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const { password: _, ...user } = newUser;

    return NextResponse.json(
      {
        user: user,
        message: "User created successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
