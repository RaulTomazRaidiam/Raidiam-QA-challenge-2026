# Java & Maven Setup Guide

This project requires:

- Java **17 or higher**
- Maven **3.9 or higher**

This guide explains how to install and verify them on macOS, Windows, and Linux.

---

## macOS (Homebrew)

Install Homebrew if needed:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install Java:
```bash
brew install openjdk@17
sudo ln -sfn "$(brew --prefix)/opt/openjdk@17/libexec/openjdk.jdk" /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

Set environment variables:
```bash
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Install Maven:
```bash
brew install maven
```

Verify:
```bash
java -version
mvn -version
```

---

## Windows (Winget)

Open PowerShell as Administrator.

Install Java:
```powershell
winget install -e --id EclipseAdoptium.Temurin.17.JDK
```

Install Maven:
```powershell
winget install -e --id Apache.Maven
```

Restart terminal and verify:
```powershell
java -version
mvn -version
```

---

## Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y openjdk-17-jdk maven
```

Verify:
```bash
java -version
mvn -version
```

---

## Required Versions

| Tool  | Version |
|-------|---------|
| Java | 17+ |
| Maven | 3.9+ |

---

## Quick Check

```bash
java -version && mvn -version
```

If both return valid versions — you're ready.
