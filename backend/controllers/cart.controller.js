import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

/**
 * @desc Get cart products for a user
 * @route GET /api/cart
 * @access Private
 */
export const getCartProducts = async (req, res) => {
	try {
		const userId = req.user._id;
		const cart = await Cart.findOne({ userId }).populate("products.productId");

		if (!cart) {
			return res.json([]); // Empty cart if not found
		}

		// Format products with quantity
		const cartItems = cart.products.map((item) => ({
			...item.productId.toObject(),
			quantity: item.quantity,
		}));

		res.json(cartItems);
	} catch (error) {
		console.error("Error in getCartProducts:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * @desc Add product to cart
 * @route POST /api/cart
 * @access Private
 */
export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const userId = req.user._id;

		let cart = await Cart.findOne({ userId });

		if (!cart) {
			cart = new Cart({ userId, products: [] });
		}

		const existingItem = cart.products.find((item) => item.productId.toString() === productId);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			cart.products.push({ productId, quantity: 1 });
		}

		await cart.save();
		res.json(cart);
	} catch (error) {
		console.error("Error in addToCart:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * @desc Remove all or specific product from cart
 * @route DELETE /api/cart
 * @access Private
 */
export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const userId = req.user._id;

		let cart = await Cart.findOne({ userId });

		if (!cart) return res.json([]);

		if (!productId) {
			cart.products = []; // Clear entire cart
		} else {
			cart.products = cart.products.filter((item) => item.productId.toString() !== productId);
		}

		await cart.save();
		res.json(cart);
	} catch (error) {
		console.error("Error in removeAllFromCart:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * @desc Update quantity of product in cart
 * @route PUT /api/cart/:id
 * @access Private
 */
export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const userId = req.user._id;

		let cart = await Cart.findOne({ userId });

		if (!cart) return res.status(404).json({ message: "Cart not found" });

		const existingItem = cart.products.find((item) => item.productId.toString() === productId);

		if (!existingItem) {
			return res.status(404).json({ message: "Product not found in cart" });
		}

		if (quantity === 0) {
			cart.products = cart.products.filter((item) => item.productId.toString() !== productId);
		} else {
			existingItem.quantity = quantity;
		}

		await cart.save();
		res.json(cart);
	} catch (error) {
		console.error("Error in updateQuantity:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
