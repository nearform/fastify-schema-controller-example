# fastify-schema-controller-example
Example source code for ajv@8 within fastify@3 blog post.

Read the blog post for more details: [https://www.nearform.com/blog/upgrading-fastifys-input-validation-to-ajv-version-8/](https://www.nearform.com/blog/upgrading-fastifys-input-validation-to-ajv-version-8/)

## Requirements

You need to have Node.js >= 12.2.0 version to run the following scripts.
This is needed to use the [`createRequire`](https://nodejs.org/dist/latest-v16.x/docs/api/module.html#module_module_createrequire_filename) function.


## Installation

Run these commands to download and install this project:

```sh
git clone https://github.com/nearform/fastify-schema-controller-example.git
cd fastify-schema-controller-example
npm install
```


## Repository structure

In this repository you can find the following scripts:

- The `customize-schema-compiler.mjs` shows how to customize the schema compiler to use ajv@8.
- The `phase-1-standalone-mode-write.mjs` shows how to generate the Validation Functions in standalone mode.
- The `phase-2-standalone-mode-read.mjs` shows how to read the generated functions in standalone mode and run your application.


## Usage

To run a script, you need to run the following command:

```sh
node <script>
```
