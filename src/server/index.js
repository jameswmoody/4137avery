const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
const {
	buildASTSchema
} = require('graphql');

const POSTS = [{
		author: 'John Doe',
		body: 'Hello world',
		createdAt: '2020-05-25T12:30:00.000Z'
	},
	{
		author: 'Jane Doe',
		body: 'Hi, planet!',
		createdAt: '2020-05-26T12:30:00.000Z'
	},
];

const schema = buildASTSchema(gql `
  type Query {
    posts: [Post]
    post(id: ID!): Post
  }

  type Post {
    id: ID
    author: String
    body: String
	createdAt: String
  }
`);

const mapPost = (post, id) => post && ({
	id,
	...post
});

const root = {
	posts: () => POSTS.map(mapPost),
	post: ({
		id
	}) => mapPost(POSTS[id], id),
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
	schema,
	rootValue: root,
	graphiql: true,
}));

const port = process.env.PORT || 4000
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);