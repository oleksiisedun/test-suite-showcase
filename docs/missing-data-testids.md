# Missing `data-test`s worth adding

Running list of UI elements the automation has to locate by **CSS class or role/name** because they
have **no `data-test`**. Class-based selectors are the framework's last resort (unstable across app
changes), so each row here is a request for the app team to add a stable `data-test`. When one is
added, wire it up in the page object and delete the row here.

| # | Element / purpose | Current selector (fallback) | Suggested `data-test` | Used by |
|---|--------------------|------------------------------|-------------------------|---------|

_(no known gaps — SauceDemo tags most interactive elements with `data-test` already)_

## How to use this list

- **Add a row** whenever automation is forced onto a class/XPath/role fallback for lack of a `data-test`.
- Keep the *current fallback selector* accurate so it's easy to find and replace in code.
- **Remove a row** once the app adds the `data-test` and the page object is updated to use it.
