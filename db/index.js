const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid
require('dotenv').config();


// Connect to MongoDB
if (!process.env.DB_CONNECTION_STRING) {
    console.error("DB_CONNECTION_STRING is not defined in .env file");
    process.exit(1); // Exit the process with failure
}

mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
        console.log("Successfully connected to the database.");
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });

const generateRandomOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit random number
};

// User Schema
const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4, // Generate a UUID by default
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password_hash: {
        type: String,
        required: true
    },
    registration_otp: {
        type: String,
        default: generateRandomOTP // Default to a random 6-digit number
    },
    reset_otp: {
        type: String,
        default: generateRandomOTP // Default to a random 6-digit number
    },
    state: {
        type: String,
        enum: ['pending', 'verified', 'blocked'], // Enum for state
        default: 'pending' // Default state is pending
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    last_login: Date
});

// Admin Schema
const AdminSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password_hash: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    last_login: Date
});

// Project Schema
const ProjectSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deadline: Date,
    creator_id: {
        type: String,
        ref: 'User',
        required: true
    },
    is_approved: {
        type: Boolean,
        default: false
    }
});

// Project Approval Schema
const ProjectApprovalSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    project_id: {
        type: String,
        ref: 'Project',
        required: true
    },
    admin_id: { // Fixed duplicate `id` field
        type: String,
        ref: 'Admin',
        required: true
    },
    approval_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['approved', 'rejected'],
        required: true,
    }
});

// Project User Schema
const ProjectUserSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    project_id: {
        type: String,
        ref: 'Project',
        required: true
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    joined_at: {
        type: Date,
        default: Date.now
    }
});

// Task Schema
const TaskSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    project_id: {
        type: String,
        ref: 'Project',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    deadline: Date,
    status: {
        type: String,
        required: true
    },
    creator_id: {
        type: String,
        ref: 'User',
        required: true
    },
    assignee_id: {
        type: String,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Task History Schema
const TaskHistorySchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    task_id: {
        type: String,
        ref: 'Task',
        required: true
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    old_value: String,
    new_value: String,
    action_time: {
        type: Date,
        default: Date.now
    }
});

// Comment Schema
const CommentSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    project_id: {
        type: String,
        ref: 'Project',
        required: true
    },
    creator_id: {
        type: String,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    file_name: String,
    file_path: String,
    file_size: Number,
    file_type: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Project Statistic Schema
const ProjectStatisticSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    project_id: {
        type: String,
        ref: 'Project',
        required: true
    },
    total_tasks: {
        type: Number,
        default: 0
    },
    completed_tasks: {
        type: Number,
        default: 0
    },
    overdue_tasks: {
        type: Number,
        default: 0
    },
    completion_percentage: {
        type: Number,
        default: 0
    },
    last_updated: {
        type: Date,
        default: Date.now
    }
});

// Project Tag Schema
const ProjectTagSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    project_id: {
        type: String,
        ref: 'Project',
        required: true
    },
    tag_name: String,
    tagged_at: {
        type: Date,
        default: Date.now
    }
});

// Models
const User = mongoose.model('User', UserSchema);
const Admin = mongoose.model('Admin', AdminSchema);
const Project = mongoose.model('Project', ProjectSchema);
const ProjectApproval = mongoose.model('ProjectApproval', ProjectApprovalSchema);
const ProjectUser = mongoose.model('ProjectUser', ProjectUserSchema);
const Task = mongoose.model('Task', TaskSchema);
const TaskHistory = mongoose.model('TaskHistory', TaskHistorySchema);
const Comment = mongoose.model('Comment', CommentSchema);
const ProjectStatistic = mongoose.model('ProjectStatistic', ProjectStatisticSchema);
const ProjectTag = mongoose.model('ProjectTag', ProjectTagSchema);


// Export models
module.exports = {
    User,
    Admin,
    Project,
    ProjectApproval,
    ProjectUser,
    Task,
    TaskHistory,
    Comment,
    ProjectStatistic,
    ProjectTag
};
