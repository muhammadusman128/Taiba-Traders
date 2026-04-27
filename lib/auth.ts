import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is not set");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login Type", type: "text" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please provide email and password");
          }

          await connectDB();

          const normalizedEmail = credentials.email.trim().toLowerCase();
          const escapedEmail = normalizedEmail.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          );

          const adminEmailEnv = process.env.ADMIN_EMAIL?.trim().toLowerCase();
          const adminPasswordEnv = process.env.ADMIN_PASSWORD;

          if (credentials.loginType === "admin") {
            // Admin portal login attempt
            if (!adminEmailEnv || !adminPasswordEnv) {
              throw new Error("Admin credentials not set in environment");
            }
            if (normalizedEmail !== adminEmailEnv) {
              throw new Error("Invalid admin email");
            }
            if (credentials.password !== adminPasswordEnv) {
              throw new Error("Invalid admin password");
            }

            // Valid environment admin credentials. Upsert the admin in DB string.
            let adminUser = await User.findOne({ email: adminEmailEnv });
            if (!adminUser) {
              const hashedPassword = await bcrypt.hash(adminPasswordEnv, 10);
              adminUser = await User.create({
                name: "Admin",
                email: adminEmailEnv,
                password: hashedPassword,
                role: "admin",
              });
            } else if (adminUser.role !== "admin") {
              await User.findByIdAndUpdate(adminUser._id, { role: "admin" });
              adminUser.role = "admin";
            }

            // Track active session
            try {
              const userAgent =
                req?.headers?.["user-agent"] || "Unknown Device";
              const ip =
                req?.headers?.["x-forwarded-for"] ||
                req?.headers?.["x-real-ip"] ||
                "Unknown IP";

              adminUser = await User.findByIdAndUpdate(
                adminUser._id,
                {
                  $inc: { sessionVersion: 1 },
                  lastLogin: new Date(),
                  lastActive: new Date(),
                  lastIp: ip,
                  lastDevice: userAgent,
                },
                { new: true },
              );
            } catch (updateErr) {
              console.error("Failed to update login tracking", updateErr);
            }

            if (!adminUser) return null;

            return {
              id: adminUser._id.toString(),
              email: adminUser.email,
              name: adminUser.name,
              role: adminUser.role,
              sessionVersion: adminUser.sessionVersion,
            };
          } else {
            // Normal user login attempt
            if (adminEmailEnv && normalizedEmail === adminEmailEnv) {
              throw new Error("Admins must login from the admin portal");
            }

            const user = await User.findOne({
              email: { $regex: `^${escapedEmail}$`, $options: "i" },
            });

            if (!user) {
              throw new Error("No user found with this email");
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password,
            );

            if (!isPasswordValid) {
              throw new Error("Invalid password");
            }

            // Track active session for users too
            let updatedUser = user;
            try {
              const userAgent =
                req?.headers?.["user-agent"] || "Unknown Device";
              const ip =
                req?.headers?.["x-forwarded-for"] ||
                req?.headers?.["x-real-ip"] ||
                "Unknown IP";

              const updatedDoc = await User.findByIdAndUpdate(
                user._id,
                {
                  $inc: { sessionVersion: 1 },
                  lastLogin: new Date(),
                  lastActive: new Date(),
                  lastIp: ip,
                  lastDevice: userAgent,
                },
                { new: true },
              );

              if (updatedDoc) {
                updatedUser = updatedDoc;
              }
            } catch (updateErr) {
              console.error("Failed to update login tracking", updateErr);
            }

            if (!updatedUser) return null;

            return {
              id: updatedUser._id.toString(),
              email: updatedUser.email,
              name: updatedUser.name,
              role: updatedUser.role,
              sessionVersion: updatedUser.sessionVersion,
            };
          }
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.sessionVersion = user.sessionVersion; // Store session version
      }

      // Re-validate session version for existing tokens to enable session termination
      if (token.id) {
        try {
          await connectDB();
          const dbUser = await User.findById(token.id).select("sessionVersion");
          if (!dbUser || dbUser.sessionVersion !== token.sessionVersion) {
            throw new Error("Session Terminated");
          }
        } catch (e) {
          // If session version changed or user deleted, destroy token by returning empty object
          return { ...token, exp: 0, error: "SessionTerminated" };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        if (token.error === "SessionTerminated") {
          // Effectively logging the user out visually if needed, but nextauth will just clear if we return null
          return null as any;
        }
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
