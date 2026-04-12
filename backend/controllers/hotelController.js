import Hotel from '../models/Hotel.js';

export const getHotels = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, rating } = req.query;
    let filter = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = minPrice;
      if (maxPrice) filter.pricePerNight.$lte = maxPrice;
    }
    if (rating) {
      filter.rating = { $gte: rating };
    }

    const hotels = await Hotel.find(filter);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('reviews.user', 'name');
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createHotel = async (req, res) => {
  try {
    const hotelData = {
      ...req.body,
      owner: req.user.id,
    };

    const hotel = new Hotel(hotelData);
    await hotel.save();

    res.status(201).json({
      message: 'Hotel created successfully',
      hotel,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHotel = async (req, res) => {
  try {
    let hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this hotel' });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: 'Hotel updated successfully',
      hotel,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    if (hotel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this hotel' });
    }

    await Hotel.findByIdAndDelete(req.params.id);

    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const review = {
      user: req.user.id,
      rating,
      comment,
    };

    hotel.reviews.push(review);
    await hotel.save();

    res.status(201).json({
      message: 'Review added successfully',
      hotel,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
