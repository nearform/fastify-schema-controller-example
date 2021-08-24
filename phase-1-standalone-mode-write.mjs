
import ajvCompiler from '@fastify/ajv-compiler/standalone.js'
import sanitize from 'sanitize-filename'
import fs from 'fs'
import path from 'path'
import fastify from 'fastify'

// provide a new configuration to the ajvCompiler
const factoryWrite = ajvCompiler({
  readMode: false,
  storeFunction (routeOpts, schemaValidationCode) {
    const fileName = generateFileName(routeOpts)
    fs.writeFileSync(path.join(process.cwd(), fileName), schemaValidationCode)
  }
})

// this function generates an identifier that relates an endpoint to its schemas
function generateFileName ({ method, url, httpPart }) {
  return `/generated-${method}-${httpPart}-${sanitize(url)}.cjs`
}

// as before provide the factory to the Fastify server
const app = fastify({
  logger: true,
  schemaController: {
    compilersFactory: {
      buildValidator: factoryWrite
    }
  }
})

// … your routes and schemas
const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    lang: {
      type: 'string',
      maxLength: 2
    }
  },
  required: [
    'lang'
  ]
}

app.get('/hello', {
  handler: () => { return 'hi!' },
  schema: {
    querystring: schema
  }
})

app.ready()
  .then(() => {
    console.log('Validation functions generation completed!')
  })
