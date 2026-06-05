const Lead = require('../models/Lead');

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;
    const lead = new Lead({ name, email, phone, company, status, notes });
    const savedLead = await lead.save();
    
    res.status(201).json({
      success: true,
      data: savedLead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads with advanced querying (search, filter, sort, pagination)
// @route   GET /api/leads
// @access  Public
const getAllLeads = async (req, res, next) => {
  try {
    const { search, status, sortBy, order, page, limit } = req.query;
    const queryObj = {};

    // 1. Search filter: Searches name, email, company via case-insensitive text index
    if (search) {
      queryObj.$text = { $search: search };
    }

    // 2. Status filter
    if (status) {
      queryObj.status = status;
    }

    // 3. Sorting configuration
    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    // 4. Pagination configuration
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    // Execute queries
    const total = await Lead.countDocuments(queryObj);
    const leads = await Lead.find(queryObj)
      .sort(sort)
      .skip(skipNum)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum) || 0;

    res.status(200).json({
      success: true,
      data: {
        leads,
        total,
        page: pageNum,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single lead by ID
// @route   GET /api/leads/:id
// @access  Public
const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Public
const updateLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    if (name !== undefined) lead.name = name;
    if (email !== undefined) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (company !== undefined) lead.company = company;
    if (status !== undefined) lead.status = status;
    if (notes !== undefined) lead.notes = notes;

    const updatedLead = await lead.save();

    res.status(200).json({
      success: true,
      data: updatedLead
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Public
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Lead deleted successfully'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get lead statistics
// @route   GET /api/leads/stats
// @access  Public
const getLeadStats = async (req, res, next) => {
  try {
    const stats = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      total: 0,
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Converted: 0,
      Lost: 0
    };

    stats.forEach(stat => {
      if (formattedStats.hasOwnProperty(stat._id)) {
        formattedStats[stat._id] = stat.count;
      }
    });

    formattedStats.total = await Lead.countDocuments();

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadStats
};
