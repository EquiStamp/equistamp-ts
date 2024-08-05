<div align="center">
  <picture>
    <img height="40" alt="Equistamp's logo" src="/blob/.github/assets/logoBlue.png">
  </picture>

  <br />
  <br />

  <strong>
    Bindings for the <a href="https://equistamp.com">Equistamp API</a>
  </strong>
  <br />
  <br />
  <a href="https://npmjs.org/package/@equistamp/api">
    <img src="https://img.shields.io/npm/v/@equistamp/api.svg" alt="version" />
  </a>
  <!-- <a href="https://github.com/equistamp/equistamp-ts/actions"> -->
  <!--   <img src="https://github.com/equistamp/equistamp-ts/actions/workflows/tests.yml/badge.svg" alt="CI Tests" /> -->
  <!-- </a> -->
  <a href="https://npmjs.org/package/@equistamp/api">
    <img src="https://img.shields.io/npm/dm/@equistamp/api.svg" alt="downloads" />
  </a>
  <a href="https://github.com/equistamp/equistamp-ts/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/equistamp/equistamp-ts.svg?maxAge=2592000" alt="license" />
  </a>
</div>

## Installation

This can be installed from [npm](https://www.npmjs.com/):

    npm install @equistamp/api

## Basic usage

Once you've installed the package, you can create a new API instance with:

    import API from '@equistamp/api'

    const api = new API({ server: 'https://equistamp.net' })
    await api.auth.login({login: '<your user email address>', password: '<your password>'})

Now you can fetch data from various endpoints, e.g.:

    await api.auth.me()
    await api.models.list()

# Endpoints

The `API` object represents the [available Equistamp endpoints](https://www.equistamp.com/docs/api/) as separate
properties for each endpoint. More information can be found in [the docs](https://equistamp.com/docs/clients/typescript/).

These endpoints have the following methods defined:

- `create(data: T) => Promise<T>` - receives a JSON object and creates an appropriate entry in the database (if possible)
- `fetch(id: string) => Promise<T>` - fetches the object with the given `id`
- `list(query: FilterConfig) => Promise<SearchResult>` - returns all items that match the filter configuration
- `update(item: T & {id: string}) => Promise<string>` - updates the item with the provided id
- `remove((item: T & {id: string}) => Promise<string>` - deletes the given item (when possible)
