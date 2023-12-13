const blogModel = require('../../models/v1/blogModel')
const categoryModel = require('../../models/v1/categoryModel')
const Joi = require('joi');

module.exports = {

    add: async (req, res) => {

        try {
            const { name, description, categoryId } = req.body;
            
            // Validate request body using Joi
            const schema = Joi.object({
                name: Joi.string().trim().min(1).required(),
                description: Joi.string().trim().min(1).required(),
                categoryId: Joi.string().required()
            }).unknown(true);

            const { error } = schema.validate(req.body);

            // If there's an error, send a 400 Bad Request response
            if (error) {
                return res.status(400).json({ error: error.details.map(detail => detail.message) });
            }

            // Generate slug from the name
            const slug = name.toLowerCase().replace(/\s+/g, '-');

            // Check for duplicate slug
            const slugExist = await blogModel.findOne({ slug });

            if (slugExist) {
                return res.status(400).json({ error: 'Duplicate slug!' });
            }

            // Create a new blog instance using the req.body
            const blog = new blogModel(req.body);

            // Set the generated slug
            blog.slug = slug;

            // Save the new blog
            await blog.save();

            // Return a success response with the created blog data
            return res.status(200).json({ success: 'Done!', data: blog.toJSON() });

        } catch (error) {
            // Handle any unexpected errors
            console.error('Error creating blog:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

    },

    list: async (req, res) => {

        try {
            const blogs = await blogModel.find({ status: 1 });
            const result = [];

            for (let blog of blogs) {
                const { _id, categoryId, name, slug, description, createdAt, updatedAt } = blog;

                try {
                    const category = await categoryModel.findById(categoryId);

                    if (category) {
                        blog.categoryData = category;
                    } else {
                        console.log(`Category not found for blog with ID: ${_id}`);
                    }
                } catch (error) {
                    console.error(`Error fetching category for blog with ID: ${_id}`, error);
                }

                result.push({
                    _id,
                    name,
                    slug,
                    categoryData: blog.categoryData,
                    description,
                    createdAt,
                    updatedAt,
                    // Add other modified properties
                });
            }

            return res.status(200).json({ success: 'Successful!', data: result });

        } catch (error) {
            console.error('Error fetching blogs', error);
            return res.status(400).json({ error: 'Error fetching blogs' });
        }

    },

    detail: async (req, res) => {

        try {
            const { _id } = req.body;

            // Use findOne with direct property matching instead of passing an object
            const blog = await blogModel.findOne({ _id, status: 1 });

            if (!blog) {
                return res.status(404).json({ error: 'Blog Not Found' });
            }

            const { categoryId, name, slug, description, createdAt, updatedAt } = blog;

            try {
                const category = await categoryModel.findById(categoryId);

                if (!category) {
                    return res.status(404).json({ error: 'Category not found!' });
                }

                // Build the result object
                const result = {
                    _id: blog._id,
                    name,
                    slug,
                    categoryName: category.name,
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
            console.error('Error fetching blog', e);
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
                description: Joi.string().trim().min(1).required(),
                categoryId: Joi.string().required()
            }).unknown(true);

            const { error } = schema.validate(req.body);

            // If there's an error, send a 400 Bad Request response
            if (error) {
                return res.status(400).json({ error: error.details.map(detail => detail.message) });
            }

            // Check if the blog with the provided _id exists
            const existingBlog = await blogModel.findOne({ _id, status: 1 });

            if (!existingBlog) {
                return res.status(404).json({ error: 'Blog not found!' });
            }

            // Update the existing blog with the new information
            existingBlog.name = name;
            existingBlog.description = description;
            existingBlog.categoryId = categoryId;

            // Save the updated blog
            await existingBlog.save();

            // Return a success response with the updated blog data
            return res.status(200).json({ success: 'Blog updated successfully!', data: existingBlog.toJSON() });

        } catch (error) {
            // Handle any unexpected errors
            console.error('Error updating blog:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }


    },

    delete: async (req, res)  => {

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
        
            // Check if the blog with the provided _id exists
            const existingBlog = await blogModel.findById(_id);
        
            if (!existingBlog) {
                return res.status(404).json({ error: 'Blog not found!' });
            }
        
            // Delete the blog
            await existingBlog.deleteOne()
        
            // Return a success response
            return res.status(200).json({ success: 'Blog deleted successfully!' });
        
        } catch (error) {
            // Handle any unexpected errors
            console.error('Error deleting blog:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
    }
}