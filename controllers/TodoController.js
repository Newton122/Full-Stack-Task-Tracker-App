const ToDoModel = require('../models/ToDoModels');

const getToDo = async (req, res) => {
    try {
        const toDo = await ToDoModel.find({ userId: req.userId });
        res.json(toDo);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

const saveToDo = async (req, res) => {
    try {
        const {title, description} = req.body || {};

        if (!title || !description) {
            return res.status(400).json({error: "Title and description are required"});
        }

        ToDoModel.create({userId: req.userId, title, description})
            .then((data) => {
                console.log("Data saved successfully:", data);
                res.json(data);
            })
            .catch((err) => {
                console.error("Error saving data:", err);
                res.status(500).json({error: "Error saving data"});
            });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({error: "Server error"});
    }
}

const updateToDo = async (req, res) => {
    try {
        let {id} = req.params || {};
        const {title, description, completed} = req.body || {};

        // Remove brackets if they exist
        id = id.replace(/[\[\]]/g, '');

        if (!id) {
            return res.status(400).json({error: "ID is required"});
        }

        // Only update fields that are provided
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (completed !== undefined) updateData.completed = completed;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({error: "At least one field (title, description, or completed) is required"});
        }

        // Verify ownership before updating
        const existingToDo = await ToDoModel.findById(id);
        if (!existingToDo) {
            return res.status(404).json({error: "ToDo not found"});
        }
        if (existingToDo.userId.toString() !== req.userId) {
            return res.status(403).json({error: "Unauthorized"});
        }

        const updatedToDo = await ToDoModel.findByIdAndUpdate(id, updateData, {returnDocument: 'after'});
        res.json(updatedToDo);
    } catch (error) {
        console.error("Update error details:", error.message);
        res.status(500).json({error: "Server error", details: error.message});
    }
}

const deleteToDo = async (req, res) => {
    try {
        const {id} = req.params || {};

        if (!id) {
            return res.status(400).json({error: "ID is required"});
        }

        // Verify ownership before deleting
        const existingToDo = await ToDoModel.findById(id);
        if (!existingToDo) {
            return res.status(404).json({error: "ToDo not found"});
        }
        if (existingToDo.userId.toString() !== req.userId) {
            return res.status(403).json({error: "Unauthorized"});
        }

        await ToDoModel.findByIdAndDelete(id);
        res.json({message: "ToDo deleted successfully"});
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({error: "Server error"});
    }
}

module.exports = {getToDo, saveToDo, updateToDo, deleteToDo};   
