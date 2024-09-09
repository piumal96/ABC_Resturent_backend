const nodemailer = require('nodemailer');
const Query = require('../models/Query');

// Set up Nodemailer transporter with the provided credentials
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'abcicbtresturent@gmail.com',  
    pass: 'wnfp aidf jqil rhjk'                    
  }
});

// Submit a New Query (Customer)
exports.submitQuery = async (req, res) => {
  const { subject, message } = req.body;
  const customerId = req.session.user._id;  // Use session data

  try {
    const query = new Query({
      customer: customerId,
      subject,
      message,
    });

    await query.save();
    res.status(201).json({
      success: true,
      message: 'Query submitted successfully',
      query: {
        id: query._id,
        customer: query.customer,
        subject: query.subject,
        message: query.message,
        status: query.status,
        createdAt: query.createdAt,
      }
    });
  } catch (err) {
    console.error('Error submitting query:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Queries (Staff/Admin)
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find()
      .populate('customer', 'name email')
      .populate('respondedBy', 'name');

    res.status(200).json({
      success: true,
      message: 'Queries fetched successfully',
      queries,
    });
  } catch (err) {
    console.error('Error fetching queries:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get a Single Query by ID (Staff/Admin)
exports.getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('respondedBy', 'name');
    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Query fetched successfully',
      query,
    });
  } catch (err) {
    console.error('Error fetching query:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Respond to a Query (Staff/Admin) - Updated to Send Email
exports.respondToQuery = async (req, res) => {
  const { response } = req.body;
  const staffId = req.session.user._id;  
  const name = req.session.user.name;  

  try {
    const query = await Query.findById(req.params.id).populate('customer', 'name email'); 
    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }

    query.response = response;
    query.status = 'Resolved';
    query.respondedBy = staffId;
    query.updatedAt = Date.now();

    await query.save();


    const mailOptions = {
      from: 'abcicbtresturent@gmail.com', 
      to: query.customer.email,          
      subject: `Response to your query: ${query.subject}`,
      text: `Dear ${name},\n\nWe have responded to your query:\n\n${response}\n\nThank you for contacting us.\n\nBest Regards,\n ABC Resturent`
    };

    // Send email to customer
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
          success: false,
          message: 'Error sending email to customer',
        });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({
          success: true,
          message: 'Query responded to successfully and email sent to customer',
          query,
        });
      }
    });

  } catch (err) {
    console.error('Error responding to query:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Delete a Query (Admin Only)
exports.deleteQuery = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found',
      });
    }

    await query.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Query deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting query:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
