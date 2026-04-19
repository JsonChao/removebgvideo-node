# Releasing (Node)

## 1) Prerequisites

- npm package name available (`removebgvideo-node`)
- GitHub secret configured:
  - `NPM_TOKEN`

## 2) Bump version

Update version in `package.json` and add changelog entry.

## 3) Tag and push

```bash
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions will run checks and publish to npm.
