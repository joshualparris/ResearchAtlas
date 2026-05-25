# Manifest Workflow

Research Atlas keeps production data in `src/data/researchManifest.ts`. The app does not need Google auth, an API key, or a database.

## Validate Current Links

```bash
npm run validate:manifest
```

The validator checks that every document has:

- a unique id
- title, region, summary, tags, type, and map coordinates
- a real public Google Docs, Drive file, or Drive folder URL
- no placeholder, empty, hash-only, or example URLs

## Import From CSV

Export a Google Sheet or Drive metadata list to CSV with these exact headers:

```text
id,title,category,region,tags,summary,url,type,x,y
```

Run:

```bash
npm run import:manifest -- docs/research-manifest-template.csv
npm run validate:manifest
npm run build
```

Use pipe-separated tags in the `tags` field:

```text
longevity|sleep|recovery
```

Allowed categories:

```text
Health, Mind, Family, Faith, Tech, Life, Archive
```

Allowed types:

```text
pdf, google-doc, folder, docx, other
```

The importer writes `src/data/researchManifest.ts`. Review the diff before committing.
