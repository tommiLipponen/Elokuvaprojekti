#Requires -Version 5.1
# Checks the local Node.js version against .nvmrc and installs backend deps exactly as locked.

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$requiredNode = (Get-Content (Join-Path $repoRoot ".nvmrc")).Trim()

function Get-InstalledNodeMajor {
    try {
        $v = (node -v) -replace '^v', ''
        return $v.Split('.')[0]
    } catch {
        return $null
    }
}

$installedMajor = Get-InstalledNodeMajor

if (-not $installedMajor) {
    Write-Host "Node.js was not found on PATH. Install Node.js $requiredNode from https://nodejs.org/ (or via nvm-windows/winget) and re-run this script." -ForegroundColor Red
    exit 1
}

if ($installedMajor -ne $requiredNode) {
    Write-Host "Node.js version mismatch: found v$installedMajor, this project requires v$requiredNode (see .nvmrc)." -ForegroundColor Yellow
    if (Get-Command nvm -ErrorAction SilentlyContinue) {
        Write-Host "nvm-windows detected. Run:  nvm install $requiredNode  then  nvm use $requiredNode" -ForegroundColor Yellow
    } else {
        Write-Host "Install Node.js $requiredNode via winget:  winget install OpenJS.NodeJS.LTS  (or nvm-windows), then re-run this script." -ForegroundColor Yellow
    }
    exit 1
}

Write-Host "Node.js v$installedMajor matches required version ($requiredNode). Proceeding." -ForegroundColor Green

Push-Location (Join-Path $repoRoot "backend")
try {
    Write-Host "Running npm ci in backend/ (installs exact versions from package-lock.json)..." -ForegroundColor Cyan
    npm ci
    if ($LASTEXITCODE -ne 0) {
        Write-Host "npm ci failed. If package.json/package-lock.json were just edited, run 'npm install' once to resync, commit the lock file, then re-run this script." -ForegroundColor Red
        exit 1
    }

    Write-Host "Note: 'npm warn deprecated glob@...' warnings above are safe to ignore (an old sub-dependency used internally by other tools)." -ForegroundColor DarkGray
    Write-Host "Note: 'npm audit' may report high-severity issues in mysql2/deepmerge-ts pulled in by the prisma CLI. This project uses PostgreSQL only, so that MySQL-related code path is never used. Do not run 'npm audit fix --force', it would downgrade prisma to an unwanted major version." -ForegroundColor DarkGray

    if (Test-Path "prisma/schema.prisma") {
        Write-Host "Generating Prisma client..." -ForegroundColor Cyan
        npx prisma generate
        if ($LASTEXITCODE -ne 0) {
            Write-Host "prisma generate failed." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "No prisma/schema.prisma yet, skipping prisma generate." -ForegroundColor DarkYellow
    }

    Write-Host "Setup complete." -ForegroundColor Green
} finally {
    Pop-Location
}
