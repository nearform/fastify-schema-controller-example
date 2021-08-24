
import ajvCompiler from '@fastify/ajv-compiler/standalone.js'
import sanitize from 'sanitize-filename'
import fs from 'fs'
import path from 'path'
import fastify from 'fastify'

const factoryWrite = ajvCompiler({
  readMode: false,
  storeFunction (routeOpts, schemaValidationCode) {
    const fileName = generateFileName(routeOpts)
    fs.writeFileSync(path.join(process.cwd(), fileName), schemaValidationCode)
  }
})

function generateFileName ({ method, url, httpPart }) {
  return `/generated-${method}-${httpPart}-${sanitize(url)}.cjs`
}

const app = fastify({
  logger: true,
  schemaController: {
    compilersFactory: {
      buildValidator: factoryWrite
    }
  }
})

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
