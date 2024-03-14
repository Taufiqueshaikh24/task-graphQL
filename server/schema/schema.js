const { projects , users } = require('../SampleData');
const { GraphQLObjectType  , GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } =  require('graphql')
const Projects = require('../models/projectsDB');
const Users   = require('../models/usersDB');
const { argsToArgsConfig } = require('graphql/type/definition');



// Users Type 

const usertype = new GraphQLObjectType({
    name : 'user', 
    fields: () => ({
        id : { type : GraphQLID}, 
        name : { type : GraphQLString}, 
        gmail : { type : GraphQLID}, 
        phone : { type : GraphQLID}, 
    })
})


// Projetcs Type 
const projectType = new GraphQLObjectType({
    name : 'ProjectsType', 
    fields: () => ({
        id: { type: GraphQLID},
        name : { type : GraphQLString}, 
        description : { type : GraphQLString}, 
        status : { type : GraphQLString}, 
        user: {
            type: usertype, 
            resolve( parent , args){
                return Users.findById(parent.userId);
            }
        }
    })
})


const query = new GraphQLObjectType({
    name : 'RootQueryType',
    fields :{
        projects: {
            type: new GraphQLList(projectType),
            resolve(parent, args){
                return Projects.find()
            }
        },
        project: {
            type : projectType , 
            args: { id : { type : GraphQLID}}, 
            resolve(parent,args){
                return Projects.findById(args.id);
            }
        },
        users: {
            type : new GraphQLList(usertype), 
            resolve(parent , args){
                return Users.find();
            }
        },
        user:{
             type: usertype, 
             args: { id: { type : GraphQLID }},
             resolve(parent , args ){
                return Users.findById(args.id);
             }
        },
    }
})


const mutation = new GraphQLObjectType({
    name:'mutations',
    fields: {
        //  Mutation for Projects
        addProject:{
              type : projectType , 
              args: {
                  name : { type : new GraphQLNonNull(GraphQLString)},
                  description: { type : new GraphQLNonNull(GraphQLString)}, 
                  status : {
                      type : new GraphQLEnumType({
                        name : 'ProjectStatus', 
                           values: {
                               'new': { value : 'Not Started'}, 
                               'progrees': { value : 'In Progress'}, 
                               'completed' : { value : 'Completed'}
                           }
                      }), 
                      defaultValue: 'Not Started', 
                  },
                  userId : { type : new GraphQLNonNull(GraphQLID)} 
              }, 
              resolve(parents , args){
                    const project = new Projects({
                         name : args.name , 
                         description : args.description ,
                         status : args.status , 
                         userId: args.userId 
                    })
                   return project.save();
              } 
        },
        delProject: {
            type : projectType , 
            args : { id : { type : new GraphQLNonNull(GraphQLID)}}, 
            resolve(parents , args){
                return Projects.findByIdAndDelete(args.id);
            }
        },
        editProject : {
            type : projectType, 
            args : {
                id : { type : new  GraphQLNonNull(GraphQLID)}, 
                name : { type :  GraphQLString}, 
                description : { type :  GraphQLString}, 
                status : { 
                    type : new GraphQLEnumType({
                        name : 'ProjectStatusUpdate', 
                        values : {
                            'new': { value : 'Not Started'}, 
                            'progress' : { value : 'In Progress'}, 
                            'completed' : { value : 'Completed'}
                        }
                    })
                }, 
                userId :  { type : GraphQLID}
            }, 
            resolve(parents , args){
                 return Projects.findByIdAndUpdate(args.id, {
                        $set : {
                            name : args.name, 
                            description : args.description, 
                            status : args.status,
                            userId : args.userId
                        }
                 }, { new : true })
            }
        }, 
        //  Mutations for Users
        addUser: {
            type : usertype , 
            args : { 
                name  : { type : new GraphQLNonNull( GraphQLString )}, 
                gmail : { type : new GraphQLNonNull( GraphQLString )} , 
                phone : { type : new GraphQLNonNull( GraphQLString )}, 
            }, 
            resolve(parent, args){
                const user = new Users({
                     name : args.name , 
                     gmail : args.gmail, 
                     phone : args.phone, 
                })
                return user.save();
            }
           
        },
        delUser: {
            type:usertype ,
            args : { id : { type : new GraphQLNonNull(GraphQLID)}}, 
            resolve(parent , args){
                return Users.findByIdAndDelete(args.id);
            }
        }, 
        editUser : {
            type : usertype ,  
            args : {
                  id : { type : new GraphQLNonNull(GraphQLID) },
                  name : { type : GraphQLString}, 
                  gmail : { type : GraphQLString}, 
                  phone : { type : GraphQLString},  
            },
            resolve(parent , args ){
                return Users.findByIdAndUpdate(args.id, {
                        $set : {
                            name: args.name, 
                            gmail : args.gmail, 
                            phone : args.phone
                        }
                }, { new : true}) 
            }
        }, 

    }
})


module.exports = new GraphQLSchema({
      query,
      mutation, 
})



