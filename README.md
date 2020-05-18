# Mailik

Mailik is a ecosystem for send mail in you'r app :

- Send mail with nodemailer
- Template HTML with mjml
- html, text and subject is a template with handlebars

# Exemple

Prepare templates :

Html version :

```mjml
{{! invoice.html }}
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text><h1>Hello {{name}}</h1></mj-text>
        <p>You'r Invoice :</p>
        <mj-table>
          {{#each products}}
          <tr>
            <td>{{name}}</td>
            <td>{{price}}€</td>
          </tr>
          {{~/each products}}
        </mj-table>
        <mj-text>
          <p>Total : <strong>{{total}}€</strong></p>
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

Text version :

```text
{{! invoice.text }}
Hello {{name}}

You'r Invoice :

{{#each products}}
- {{name}} : {{price}}€
{{~/each products}}

Total : {{total}}€
```

Subject of mail :

```text
{{! invoice.subject }}
{{name}}, you'r invoice is ready ;)
```

On start of you'r app, init mailik with you'r config :

```javascript
const mailik = requrie('mailik')

mailik.init({
  directory: path.join(__dirname, './templates'),
  mail: {
    /* default config for mail */
    from: 'John Doe <admin@exemple.com>',
  },
  nodemailer: {
    /* nodemailer transport config */
    host: 'smtp.domain.com',
    port: 25,
    auth: {
      user: 'xxxxxxxxxxxxxxxx',
      pass: 'xxxxxxxxxxxxxxxx',
    },
  },
})
```

And use

```javascript
const welcome = mailik('welcome')

welcome('to@exemple.com', {
  name: 'Simon',
  products: [
    { name: 'Product A', price: 42 },
    { name: 'Product B', price: 4242 },
  ],
  total: 4284,
})
  .then((infos) => {
    console.log(infos)
  })
  .catch((err) => {
    console.error(err)
  })
```

## Directory

All templates must has 3 versions :

- /templates/directory/[nameOfTemplate].html
- /templates/directory/[nameOfTemplate].text
- /templates/directory/[nameOfTemplate].subject

Exemples :

- /templates/directory/welcome.html
- /templates/directory/welcome.text
- /templates/directory/welcome.subject
- /templates/directory/forgetPassword.html
- /templates/directory/forgetPassword.text
- /templates/directory/forgetPassword.subject
- /templates/directory/youHavAMessage.html
- /templates/directory/youHavAMessage.text
- /templates/directory/youHavAMessage.subject
