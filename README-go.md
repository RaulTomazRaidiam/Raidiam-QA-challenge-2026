# Go Setup Guide

This project requires:

- Go **1.21 or higher**

---

## macOS (Homebrew)

```bash
brew install go
```

Verify:
```bash
go version
```

---

## Windows (Winget)

Open PowerShell as Administrator:

```powershell
winget install -e --id GoLang.Go
```

Restart terminal and verify:
```powershell
go version
```

---

## Linux (Manual Install – Recommended)

Download and install Go 1.21+:

```bash
curl -fsSL https://go.dev/dl/go1.21.6.linux-amd64.tar.gz -o go.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go.tar.gz
```

Add Go to PATH:
```bash
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc
```

Verify:
```bash
go version
```

---

## Required Version

| Tool | Version |
|------|---------|
| Go | 1.21+ |

---

## Quick Check

```bash
go version
```

If Go reports version 1.21+ — you're ready.
