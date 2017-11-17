// https://nuxtjs.org/guide/development-tools#end-to-end-testing
import test from 'ava'
import { Nuxt, Builder } from 'nuxt'
import { resolve } from 'path'

// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt = null

// Init Nuxt.js and start listening on localhost:4000
test.before('Init Nuxt.js', async t => {
  const rootDir = resolve(__dirname, '..')
  let config = {}
  try { config = require(resolve(rootDir, 'nuxt.config.js')) } catch (e) {}
  config.rootDir = rootDir // project folder
  config.dev = true // false = production build
  nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  nuxt.listen(4000, 'localhost')
})

// Example of testing only generated html
test('Route / exits and has the text: Healthy food in Los Angeles', async t => {
  let context = {}
  const { html } = await nuxt.renderRoute('/locations/', context)
  t.true(html.includes('Healthy food in Los Angeles'))
})

// Example of testing via DOM checking
// test('Route / exits and has a title that says: Healthy food in Los Angeles', async t => {
//   const window = await nuxt.renderAndGetWindow('http://localhost:3000/')
//   const element = window.document.querySelector('title')
//   t.not(element, null)
//   t.is(element.textContent, 'Healthy food in Los Angeles')
//   t.is(element.className, 'red')
//   t.is(window.getComputedStyle(element).color, 'red')
// })

// Close the Nuxt server
test.after('Closing server', t => {
  nuxt.close()
})
