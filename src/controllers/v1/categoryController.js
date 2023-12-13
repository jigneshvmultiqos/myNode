
const categoryModel = require('../../models/v1/categoryModel')
const Joi = require('joi');
const pagination = require('pagination-express');

module.exports = {

    add: async (req, res) => {

        try {

            let { name, description } = req.body

            const schema = Joi.object({
                name: Joi.string().trim().min(1).required(),
                description: Joi.string().trim().min(1).required()
            }).unknown(true);

            const { error } = schema.validate(req.body);

            // If there's an error, send a 400 Bad Request response
            if (error) {
                return res.status(400).json({ error: error.details.map(detail => detail.message) });
            }
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const slugExist = await categoryModel.findOne({ slug: slug })
            if (slugExist) {
                return res.status(400).json({ error: 'Duplicate !' });
            }
            const category = await categoryModel(req.body);
            category.slug = slug;

            await category.save()
            return res.status(200).json({ success: 'Done !' });

        } catch (e) {
            return res.status(400).json({ error: 'Error !' });
        }
    },

    list: async (req, res) => {

        try {

            let { page, limit, search, sortBy, startDate, endDate } = req.body;

            // Build the query object
            const query = {
                status: 1
            };

            // Get page and set default values
            page = parseInt(page, 10) || 1;
            limit = parseInt(limit) || 3;
            offset = (page - 1) * limit;

            if (sortBy) {
                sortBy = sortBy.split(':');
                field = sortBy[0];
                
                order = +sortBy[1] || 1;

            }

            sortBy = sortBy ? sortBy : 'createdAt';
            
            // Get the start and end dates from query parameters
            if (startDate && endDate) {
                query.startTime = { $gte: startDate };
                query.endTime = { $lte: endDate };
            }

            if (startDate && !endDate) {
                query.startTime = { $gte: startDate };
            }

            if (endDate && !startDate) {
                query.endTime = { $lte: endDate };
            }
            
            search = search ? search : '';

            if (search) {   
                
                let orArr = [];
                let fields = ["name","description"]

                fields.forEach((element1) => {
                    //search.forEach((element) => {
                        orArr.push({ [element1]: { $regex: new RegExp(search, "i") } });
                    //});
                });
                query.$or = orArr;               
            }



            let totalCategory = await categoryModel.countDocuments(query);
            if (!totalCategory) {
                return res.status(400).json({ error: 'Error fetching categories' });
            };

            console.log('MongoDB Query:', JSON.stringify(query));

            // Fetch categories with pagination and date filtering
            const categories = await categoryModel.find(query)
                .sort({ [field]: order })
                .skip(offset)
                .limit(limit);

            return res.status(200).json({ success: 'Successful!', data: categories });
        } catch (error) {
            console.error('Error fetching categories', error);
            return res.status(400).json({ error: 'Error fetching categories' });
        }



    },

    detail: async (req, res) => {

        try {
            const { _id } = req.body;

            // Use findOne with direct property matching instead of passing an object
            const Category = await categoryModel.findOne({ _id, status: 1 });

            if (!Category) {
                return res.status(404).json({ error: 'Category Not Found' });
            }

            const { name, slug, description, createdAt, updatedAt } = Category;

            try {

                // Build the result object
                const result = {
                    _id: Category._id,
                    name,
                    slug,
                    description,
                    createdAt,
                    updatedAt,
                    // Add other modified properties
                };

                return res.status(200).json({ success: 'Successful!', data: result });
            } catch (e) {
                console.error('Error fetching category', e);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        } catch (e) {
            console.error('Error fetching Category', e);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

    },

    update: async (req, res) => {

        try {
            const { _id, name, description, categoryId } = req.body;

            // Validate request body using Joi
            const schema = Joi.object({
                _id: Joi.string().required(),
                name: Joi.string().trim().min(1).required(),
                description: Joi.string().trim().min(1).required()

            }).unknown(true);

            const { error } = schema.validate(req.body);

            // If there's an error, send a 400 Bad Request response
            if (error) {
                return res.status(400).json({ error: error.details.map(detail => detail.message) });
            }

            // Check if the Category with the provided _id exists
            const existingCategory = await categoryModel.findOne({ _id, status: 1 });


            if (!existingCategory) {
                return res.status(404).json({ error: 'Category not found!' });
            }

            // Update the existing Category with the new information
            existingCategory.name = name;
            existingCategory.description = description;

            // Save the updated Category
            await existingCategory.save();

            // Return a success response with the updated Category data
            return res.status(200).json({ success: 'Category updated successfully!', data: existingCategory.toJSON() });

        } catch (error) {
            // Handle any unexpected errors
            console.error('Error updating Category:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }


    },

    delete: async (req, res) => {

        try {
            const { _id } = req.body;

            // Validate request body using Joi
            const schema = Joi.object({
                _id: Joi.string().required()
            }).unknown(true);

            const { error } = schema.validate(req.body);

            // If there's an error, send a 400 Bad Request response
            if (error) {
                return res.status(400).json({ error: error.details.map(detail => detail.message) });
            }

            // Check if the Category with the provided _id exists
            const existingCategory = await categoryModel.findById(_id);

            if (!existingCategory) {
                return res.status(404).json({ error: 'Category not found!' });
            }

            // Delete the Category
            await existingCategory.deleteOne()

            // Return a success response
            return res.status(200).json({ success: 'Category deleted successfully!' });

        } catch (error) {
            // Handle any unexpected errors
            console.error('Error deleting Category:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

    },

    search: async (req, res) => {

        try {
            const query = req.query.query;

            // Use blogModel.find with a regular expression to perform case-insensitive search
            const blogs = await categoryModel.find({
                $or: [
                    { name: { $regex: new RegExp(query, 'i') } },
                    { desc: { $regex: new RegExp(query, 'i') } }
                ]
            });

            return res.json(blogs);
        } catch (error) {
            console.error('Error searching blogs:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}