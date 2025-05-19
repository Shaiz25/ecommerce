import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true, // Each user has only one cart
	},
	products: [
		{
			productId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			quantity: {
				type: Number,
				default: 1,
			},
		},
	],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
