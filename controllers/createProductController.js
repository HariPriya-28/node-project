// Factory function to create a product controller
module.exports = (Model, productType) => {
    return {
        getAll: async (req, res) => {
            try {
                const products = await Model.find();
                res.status(200).json(products);
            } catch (err) {
                res.status(500).json({ "message": "Internal Server Side Error" });
            }
        }
    };
};
