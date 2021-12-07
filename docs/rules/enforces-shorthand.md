# Replace multiple Tailwind CSS classnames by their shortand equivalent (enforces-shorthand)

Same property values can be merged inside shorthand declaration resulting in shorter class list.

## Rule Details

The rule aims to simplify the classnames by making it shorter, without affecting the final properties.

Examples of **incorrect** code for this rule:

```html
<div class="ml-2 mr-2">No need for 2 classnames in here</div>
```

Examples of **correct** code for this rule:

```html
<div class="mx-2">Shorter and easier to read.</div>
```

### Options

```js
...
"tailwindcss/enforces-shorthand": [<enabled>, {
  "callees": Array<string>,
}]
...
```

### `callees` (default: `["classnames", "clsx", "ctl"]`)

If you use some utility library like [@netlify/classnames-template-literals](https://github.com/netlify/classnames-template-literals), you can add its name to the list to make sure it gets parsed by this rule.

For best results, gather the declarative classnames together, avoid mixing conditional classnames in between, move them at the end.

### `config` (default: `"tailwind.config.js"`)

By default the plugin will try to load the file `tailwind.config.js` at the root of your project.

This allows the plugin to use your customized `colors`, `spacing`, `screens`...

You can provide another path or filename for your Tailwind CSS config file like `"config/tailwind.js"`.

If the external file cannot be loaded (e.g. incorrect path or deleted file), an empty object `{}` will be used instead.

It is also possible to directly inject a configuration as plain `object` like `{ prefix: "tw-", theme: { ... } }`.

Finally, the plugin will [merge the provided configuration](https://tailwindcss.com/docs/configuration#referencing-in-java-script) with [Tailwind CSS's default configuration](https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js).
