# Node.js & npm Setup Guide

This project requires:

- Node.js **14 or higher**
- npm (bundled with Node.js)

---

## macOS (Homebrew)

```bash
brew install node
```

Verify:
```bash
node -version
npm -version
```

---

## Windows (Winget)

Open PowerShell as Administrator:

```powershell
winget install -e --id OpenJS.NodeJS
```

Restart terminal and verify:
```powershell
node -version
npm -version
```

---

## Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify:
```bash
node -version
npm -version
```

---

## Required Versions

| Tool | Version |
|------|---------|
| Node.js | 14+ |
| npm | Bundled |

---

## Quick Check

```bash
node -version && npm -version
```

If both return valid versions — you're ready.
