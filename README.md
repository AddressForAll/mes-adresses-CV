# Mes Adresses CV

The [French project "Mes Adresses"](https://github.com/BaseAdresseNationale/mes-adresses) is being adapted as Community Version (CV), to become multilingual and open to community requests. The original Mes Address is an online tool that allows you to easily manage your addresses, from creating a Local Address Base to updating it. It is accessible without technical skills and includes a built-in tutorial.

For France, it is available online at [mes-adresses.data.gouv.fr](https://mes-adresses.data.gouv.fr).

## Guide

https://adresse.data.gouv.fr/data/docs/guide-mes-adresses-v4.0.pdf

## Documentation

https://adresse-data-gouv-fr.gitbook.io/bal/mes-adresses

## Prerequisites

- [Node.js](https://nodejs.org) 22
- [yarn](https://www.yarnpkg.com)

## Usage

### Installation

Installing Node.js dependencies

```
$ yarn
```

Create the list of available flags for regional languages

```
$ yarn build-available-flags
```

Create environment variables

```bash
cp .env.sample .env
```

You can then edit the environment variables in the `.env` file if necessary.

### Development

Start the development server:

```
$ yarn dev
```

### Production

Create a production version:

```
$ yarn build
```

Start the server (default port 3000):

```
$ yarn start
```

### Linter

Linter report (eslint):

```
$ yarn lint
```

## Configuration

This application uses environment variables for its configuration. They can be set conventionally or by creating a `.env` file based on the `.env.sample` template.

| Variable Name                    | Description                                                 |
| --------------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_BAL_API_URL`        | Base URL of the BAL API                                     |
| `NEXT_PUBLIC_GEO_API_URL`        | Base URL of the Geo API                                    |
| `NEXT_PUBLIC_ADRESSE_URL`        | Base URL of the adresse.data.gouv.fr website               |
| `NEXT_PUBLIC_EDITEUR_URL`        | Base URL for redirections to the My Addresses editor       |
| `NEXT_PUBLIC_API_BAN_URL`        | Base URL of the BAN platform                              |
| `NEXT_PUBLIC_BAN_API_DEPOT`      | Base URL of the deposit API                               |
| `NEXT_PUBLIC_PEERTUBE`           | Peertube URL                                              |
| `NEXT_PUBLIC_MATOMO_TRACKER_URL` | Matomo URL                                                |
| `NEXT_PUBLIC_MATOMO_SITE_ID`     | Site ID on Matomo                                         |
| `NEXT_PUBLIC_API_SIGNALEMENT`    | URL of the reporting API                                  |
| `NEXT_PUBLIC_BAL_ADMIN_URL`      | Base URL of BAL admin                                     |
| `PORT`                           | Application port                                          |

All these variables have default values that you can find in the `.env.sample` file.

## Governance

This tool was designed at the initiative of Etalab. Since 2020, it has been jointly managed by Etalab and the ANCT.

## License

MIT

