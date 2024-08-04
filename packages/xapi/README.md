<div align="center">
  <picture>
    <img height="40" alt="Equistamp's logo" src="../../.github/assets/logoBlue.png">
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

# Installation

This can be installed from [npm](https://www.npmjs.com/):

    npm install @equistamp/api

# Basic usage

Once you've installed the package, you can create a new API instance with:

    import API from '@equistamp/api'

    const api = new API({ server: 'https://equistamp.net' })

This will allow you to access most Equistamp endpoints with `await api.<endpoint>.<method>()`, e.g.:

    await api.models.list()

will return the first 50 public models.

# Initialization

The `API` object can be configured with a server URL (use `https://equistamp.net`) and access tokens. Quite a few
endpoints can be accessed for reading without authentication, but for any actual changes you'll have to be
authenticated. This is done by providing an appropriate token header.

We support two kinds of access tokens - session and API tokens.

### Session-Token

Session tokens are relatively short lived tokens (7 days) that are assumed to be used by browser sessions. After
7 days they will expire. Logging in, via the `auth` endpoint, will return the user's `Session-Token` or generate
a new one if expired. Logging in will automatically rotate the Session-Token.

Session-Tokens are provided to the server by setting the `Session-Token` header, e.g.

    const res = await fetch('https://equistamp.net/models', {
      method: 'GET',
      headers: {
          'Session-Token': '1200685e-614b-4296-940b-42493967d889',
      },
    })

### Api-Token

Api-Tokens are long lived tokens which are generated once and will live until explicitly revoked by a user.

To get your Api-Token, run:

    await api.auth.login({login: '<your user email address>', password: '<your password>'})
    const apiToken = await api.auth.getSessionId()

The `API` class can manage the token for you, e.g.:

    await api.auth.login({login: '<your user email address>', password: '<your password>', storage: 'api_token'})
    console.log(api.auth.apiToken)

    console.log(await api.auth.me())

#### Revoking Api-Tokens

To reset all of your tokens, run:

    await api.auth.revokeTokens()

Once you log back in, you can fetch your new Api-Token with `await api.auth.getApiToken()`.

### Token management

Tokens can either be explicitly provided to the `API` object when creating it, can be extracted from cookies (when
in browser), or fetched by logging into the server. In each case, you only have to do this one - all subsequent
calls will use your tokens.

#### Explicit tokens

To explicitly provide tokens, run either

    const api = new API({server: 'https://equistamp.net', sessionToken: '<your session token>'})

or

    const api = new API({server: 'https://equistamp.net', apiToken: '<your API token>'})

depending on whether you want to use session or API tokens.

#### Cookie sessions

When in the browser, you can specify that you want to store your session token as a cookie. By default, when
a user logs in, the `API` class will try to set a cookie. You can then use it with:

    const api = new API({server: 'https://equistamp.net'})
    api.auth.getSessionId()

    // Do a manual log in if no cookies were found
    if (!api.auth.sessionToken) {
        await api.auth.login({login: '<your user email address>', password: '<your password>'})
    }

From now on all calls will use your session token

#### Manual log in

You can also configure the tokens by logging into the service. This will automatically set a cookie with the session token if
possible:

    const api = new API({server: 'https://equistamp.net'})
    await api.auth.login({login: '<your user email address>', password: '<your password>'})

If you don't want to set the cookie you can use the following to just get the session token:

    const api = new API({server: 'https://equistamp.net'})
    await api.auth.login({login: '<your user email address>', password: '<your password>', storage: 'session_token'})

or the following if you want to use the API token:

    const api = new API({server: 'https://equistamp.net'})
    await api.auth.login({login: '<your user email address>', password: '<your password>', storage: 'api_token'})

# Endpoints

The `API` object represents the [available Equistamp endpoints](https://www.equistamp.com/docs/api/) as separate
properties for each endpoint.

These endpoints have the following methods defined:

- `create(data: T) => Promise<T>` - receives a JSON object and creates an appropriate entry in the database (if possible)
- `fetch(id: string) => Promise<T>` - fetches the object with the given `id`
- `list(query: FilterConfig) => Promise<SearchResult>` - returns all items that match the filter configuration
- `update(item: T & {id: string}) => Promise<string>` - updates the item with the provided id
- `remove((item: T & {id: string}) => Promise<string>` - deletes the given item (when possible)
