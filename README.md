# JDCreations

Static site for JDCreations — designed and built by Jari De Coen.

## Pages

- `index.html` — home
- `over.html` — about

## Deploy (Cloudflare Pages)

1. Push this folder to a GitHub repository.
2. In Cloudflare Pages, create a new project and connect the repo.
3. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `/`
4. Deploy.

## Local preview

```sh
python3 -m http.server 8000
```

Open http://localhost:8000
