const contactsOperations = require("../../models/contacts");

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsOperations.getContactById(contactId);
    if (!contact) {
      const error = new Error(`Not found`);
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      status: "Success",
      code: 200,
      data: {
        result: contact,
      },
    });
  } catch (error) {
    next(error);
  }

  res.json({ message: "template message" });
};

module.exports = getById;