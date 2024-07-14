const Property = require("../models/Property");
const cloudinary = require("../config/cloudinary");

exports.createProperty = async (req, res) => {
  const { title, description, price, location, type } = req.body;
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "properties",
    });

    const newProperty = new Property({
      title,
      description,
      price,
      location,
      type,
      image: result.secure_url,
      agentId: req.user.id,
    });
    const property = await newProperty.save();
    res.json(property);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("agentId", [
      "name",
      "email",
    ]);
    res.json(properties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "agentId",
      ["name", "email"]
    );
    if (!property) {
      return res.status(404).json({ msg: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPropertiesAgent = async (req, res) =>{
  const agentId = req.user.id

  try {
    const properties = await Property.find({ agentId: agentId });

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties for agent:", error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.updateProperty = async (req, res) => {
  const { title, description, price, location, type } = req.body;
  const image = req.file; 

  try {
    let updatedProperty = await Property.findById(req.params.id);

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "properties",
      });
      updatedProperty.image = result.secure_url;
    }

    updatedProperty.title = title;
    updatedProperty.description = description;
    updatedProperty.price = price;
    updatedProperty.location = location;
    updatedProperty.type = type;

    const savedProperty = await updatedProperty.save();

    res.status(200).json(savedProperty);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    let property = await Property.findById({_id:req.params.id});
    if (!property) {
      return res.status(404).json({ msg: "Property not found" });
    }

    if (property.agentId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Property.deleteOne({_id:req.params.id});
    res.status(200).json({ msg: "Property removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.searchProperties = async (req, res) => {
  const { location, minPrice, maxPrice, type } = req.query;
  let query = {};

  if (location) query.location = location;
  if (minPrice) query.price = { $gte: minPrice };
  if (maxPrice) query.price = { ...query.price, $lte: maxPrice };
  if (type) query.type = type;

  try {
    const properties = await Property.find(query).populate("agentId", [
      "name",
      "email",
    ]);
    res.json(properties);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
