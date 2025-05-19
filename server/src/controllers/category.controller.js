const categoryService = require("../services/category.service");

exports.getAllCategory = async (req, res) => {
  try {
    const categoryList = await categoryService.getAllCategories();
    if (categoryList.length === 0) {
      return res.status(204).send();
    }
    res.status(200).json(categoryList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { type } = req.body;
    const categoryType = type.toUpperCase();

    const existingCategory = await categoryService.getCategoryByType(
      categoryType
    );
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category is extisted!" });
    }

    const category = {
      type: categoryType,
    };
    const newCategory = await categoryService.create(category);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: "CategoryType không hợp lệ." });
  }
};
