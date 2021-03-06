const { requireAuth } = require('./lib/auth')

exports.handler = requireAuth(async (event, context) => {
  try {
    const { claims } = context.identityContext

    return {
      statusCode: 200,
      body: JSON.stringify({ claims }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error_description: err.message }),
    }
  }
})

// This module can be used to serve the GraphQL endpoint
// as a lambda function

const { ApolloServer } = require('apollo-server-lambda')
import { applyMiddleware } from 'graphql-middleware'
import { Neo4jGraphQL } from '@neo4j/graphql'
const neo4j = require('neo4j-driver')
const express = require('express')
import permissions from '../../permissions'
// This module is copied during the build step
// Be sure to run `npm run build`
const { typeDefs } = require('./graphql-schema')

const driver = neo4j.driver(process.env.NEO4J_URI || 'bolt://localhost:7687', neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'neo4j'))

const neoSchema = new Neo4jGraphQL({ typeDefs, driver })

const server = new ApolloServer({
  schema: applyMiddleware(neoSchema.schema, permissions),
  context: { driver, neo4jDatabase: process.env.NEO4J_DATABASE },
})

exports.handler = server.createHandler()
