'use strict'

const Promise = require('bluebird')

const nodemailer = require('nodemailer')
const mjml = require('mjml')
const glob = require('glob')
const fs = require('fs')
const path = require('path')
const set = require('lodash/set')
const trim = require('lodash/trim')
const Handlebars = require('handlebars')

// Global user config
let config = {}

// Cache template
const templates = {}

// nodemailer transport
let transport

const init = (userConfig) => {
  config = userConfig

  // Create cache for template (html, text and subject)
  glob
    .sync(path.join(config.directory, '/*.{mjml,html,text,subject}'))
    .map((file) => {
      const extension = path.extname(file)
      const name = path.basename(file, extension)
      let type = extension.replace(/^\./, '')
      let content = trim(fs.readFileSync(file, 'utf8'))

      if (type === 'mjml') {
        type = 'html'
        content = mjml(content).html
      }

      set(templates, [name, type], Handlebars.compile(content))
    })

  // Verify if all templates has html, text and subject
  Object.keys(templates).map((name) => {
    if (!templates[name].subject) {
      throw new Error(`Mail template ${name} not has subject`)
    }
    if (!templates[name].html) {
      throw new Error(`Mail template ${name} not has html version`)
    }
    if (!templates[name].text) {
      throw new Error(`Mail template ${name} not has text version`)
    }
  })

  // create nodemailer transport
  transport = nodemailer.createTransport(config.nodemailer)
}

const send = (templateName) => {
  // Verify if templateName exists
  if (!templates[templateName]) {
    throw new Error(
      `The mail template ${templateName} is not found in : ${Object.keys(
        templates
      ).join(', ')}`
    )
  }

  const template = templates[templateName]

  // Send mail
  return (to, datas = {}, mailOptions = {}) => {
    const mail = {
      ...config.mail, // global config for mail
      to,
      subject: template.subject(datas),
      html: template.html(datas),
      text: template.text(datas),
      ...mailOptions // specific config for this mail
    }

    return new Promise(function (resolve, reject) {
      transport.sendMail(mail, (err, infos) => {
        if (err) {
          reject(err)
        }

        resolve(infos)
      })
    })
  }
}

module.exports = send
module.exports.default = send
module.exports.init = init
