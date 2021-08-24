import fastify from 'fastify'
import ajvCompiler from '@fastify/ajv-compiler'

const factory = ajvCompiler()

// provide the new ajv8 factory to your fastify server
const app = fastify({
  logger: true,
  schemaController: {
    compilersFactory: {
      buildValidator: factory
    }
  }
})

// define your schemas
const jsonSchemaDraft201909 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    happyDay: {
      $ref: '#/$defs/toggle',
      default: true
    }
  },
  $defs: {
    toggle: {
      type: 'boolean',
      default: null
    }
  }
}

// provide the schemas to your routes
app.post('/validate', {
  schema: {
    body: jsonSchemaDraft201909
  },
  handler: function echo (request, reply) {
    reply.send(request.body)
  }
})

app.listen(8080)

// REQUEST SUCCESS
// curl --location --request POST 'http://localhost:8080/validate' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "happyDay": true
// }'

// REQUEST FAIL
// curl --location --request POST 'http://localhost:8080/validate' \
// --header 'Content-Type: application/json' \
// --data-raw '{
//     "happyDay": 42
// }'
