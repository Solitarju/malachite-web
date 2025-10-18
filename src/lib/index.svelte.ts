// place files you want to import through the `$lib` alias in this folder.

// We need to build twice, the server requires 2 separate builds, one with localhost and one with actual domain, so we can still access web in dev.
// prod = https://vn.solitarju.uk
// dev = http://localhost:8080
// this should always be set to localhost / dev before committing.
export const DOMAIN = "http://localhost:8080";