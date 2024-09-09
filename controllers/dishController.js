const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Dish = require('../models/Dish');

// Set storage engine for Multer to save in uploads/dish
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/dish/';

    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir); // Set the upload folder to uploads/dish
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Only images are allowed!');
  }
}

// Initialize multer
const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB file limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single('image'); // single file upload under field 'image'

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.status(200).json({ success: true, dishes });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a single dish by ID
exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    res.status(200).json({ success: true, dish });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create a new dish (Admin only)
exports.createDish = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }
    
    const { name, description, price, category } = req.body;  // Removed customizations
    let imageUrl = req.file ? `/uploads/dish/${req.file.filename}` : '';

    try {
      const newDish = new Dish({
        name,
        description,
        price,
        category,
        imageUrl,
      });

      await newDish.save();
      res.status(201).json({ success: true, dish: newDish });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
};

// Update a dish (Admin only)
exports.updateDish = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }

    let updatedFields = req.body;

    if (req.file) {
      updatedFields.imageUrl = `/uploads/dish/${req.file.filename}`;
    }

    try {
      const updatedDish = await Dish.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
      if (!updatedDish) {
        return res.status(404).json({ success: false, message: 'Dish not found' });
      }
      res.status(200).json({ success: true, dish: updatedDish });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
};

// Delete a dish (Admin only)
exports.deleteDish = async (req, res) => {
  try {
    const deletedDish = await Dish.findByIdAndDelete(req.params.id);
    if (!deletedDish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    res.status(200).json({ success: true, message: 'Dish deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
