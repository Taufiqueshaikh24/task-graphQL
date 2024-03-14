const mongoose = require('mongoose');
const ProjectsSchema = new mongoose.Schema({
    name: { type : String }, 
    description : { type : String}, 
    status : { type : String , enum:['Completed', 'In Progess', 'Not Started']}, 
    userId : { type : mongoose.Schema.Types.ObjectId , ref : 'Users' }
})

module.exports = mongoose.model('Projects',ProjectsSchema );