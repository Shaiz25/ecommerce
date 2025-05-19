import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		// 1️⃣ Ensure cookies are present
		const accessToken = req.cookies?.accessToken;
		if (!accessToken) {
			console.error("❌ No access token in cookies");
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		// 2️⃣ Verify token and extract userId
		try {
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			if (!decoded.userId) {
				console.error("❌ Token is missing userId:", decoded);
				return res.status(401).json({ message: "Unauthorized - Invalid token" });
			}

			// 3️⃣ Fetch user from database
			const user = await User.findById(decoded.userId).select("-password");
			if (!user) {
				console.error("❌ No user found with ID:", decoded.userId);
				return res.status(401).json({ message: "User not found" });
			}

			// 4️⃣ Attach user to request
			req.user = user;
			console.log("✅ User authenticated:", user._id);
			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				console.error("❌ Token expired:", accessToken);
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			console.error("❌ Token verification failed:", error.message);
			return res.status(401).json({ message: "Unauthorized - Invalid access token" });
		}
	} catch (error) {
		console.error("❌ Error in protectRoute middleware:", error.message);
		return res.status(401).json({ message: "Unauthorized - Something went wrong" });
	}
};

export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		console.error("❌ Access denied - User is not admin:", req.user?.role);
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};
