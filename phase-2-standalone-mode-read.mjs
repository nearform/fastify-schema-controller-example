
import ajvCompiler from '@fastify/ajv-compiler/standalone.js'
import sanitize from 'sanitize-filename'
import path from 'path'
import fastify from 'fastify'
import { createRequire } from 'module'

// The `restoreFunction` option is synchronous, so we need the CommonJS require() function.
const require = createRequire(import.meta.url)

const factoryRead = ajvCompiler({
  readMode: true,
  restoreFunction (routeOpts, schemaValidationCode) {
    const fileName = generateFileName(routeOpts)
    return require(path.join(process.cwd(), fileName))
  }
})

function generateFileName ({ method, url, httpPart }) {
  return `/generated-${method}-${httpPart}-${sanitize(url)}.cjs`
}

const app = fastify({
  logger: true,
  schemaController: {
    compilersFactory: {
      buildValidator: factoryRead
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

app.listen(8080)

// REQUEST SUCCESS
// curl --location --request GET 'http://localhost:8080/hello?lang=it'

// REQUEST FAIL
// curl --location --request GET 'http://localhost:8080/hello?lang=itit'
