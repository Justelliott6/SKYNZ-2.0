# SKYNZ one-click local launcher.
# Never downloads, changes accounts, starts database services, or modifies a checkout.
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'
$runDir = Join-Path $root 'runtime'
$backendUrl = 'http://127.0.0.1:3000'
$frontendUrl = 'http://127.0.0.1:3001'
function Say([string]$message) { Write-Host ('SKYNZ: ' + $message) -ForegroundColor Cyan }
function Fail([string]$message) { Write-Host ('SKYNZ NEEDS ATTENTION: ' + $message) -ForegroundColor Yellow; exit 1 }
function PortOwner([int]$port) {
  $listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($listener) { return [int]$listener.OwningProcess }
  return 0
}
function IsOurs([int]$processId,[string]$expectedFile) {
  if ($processId -le 0) { return $false }
  try {
    $proc = Get-CimInstance Win32_Process -Filter "ProcessId=$processId" -ErrorAction Stop
    if (!$proc) { return $false }
    return ($proc.CommandLine -like ('*' + $expectedFile + '*'))
  } catch { return $false }
}
function WaitFor([string]$url,[int]$seconds) {
  for ($i = 0; $i -lt $seconds; $i++) {
    try {
      $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
      if ($response.StatusCode -eq 200) { return $true }
    } catch {}
    Start-Sleep -Seconds 1
  }
  return $false
}
if (!(Test-Path (Join-Path $backend 'server.js'))) { Fail 'Backend missing from this release.' }
if (!(Test-Path (Join-Path $frontend 'package.json'))) { Fail 'Frontend missing from this release.' }
if (!(Test-Path (Join-Path $backend 'node_modules'))) { Fail 'Backend dependencies missing. Ask Work to build the complete release package once.' }
if (!(Test-Path (Join-Path $frontend 'node_modules\react-scripts\bin\react-scripts.js'))) { Fail 'Frontend dependencies missing. Ask Work to build the complete release package once.' }
if (!(Test-Path (Join-Path $backend '.env'))) { Fail 'Private database configuration not provisioned for this installation. Ask Work to perform first-time setup.' }
$node = Get-Command node.exe -ErrorAction SilentlyContinue
if (!$node) { Fail 'Node.js not available; connect the existing Windows runtime during first-time setup.' }
New-Item -ItemType Directory -Force -Path $runDir | Out-Null
$backendMain = Join-Path $backend 'server.js'
$frontendMain = Join-Path $frontend 'node_modules\react-scripts\bin\react-scripts.js'
$bp = PortOwner 3000
$fp = PortOwner 3001
if ($bp -and !(IsOurs $bp $backendMain)) { Fail "Port 3000 belongs to another process (PID $bp). Nothing was stopped." }
if ($fp -and !(IsOurs $fp $frontendMain)) { Fail "Port 3001 belongs to another process (PID $fp). Nothing was stopped." }
if (!$bp) {
  Say 'Starting SKYNZ backend...'
  $env:PORT='3000'
  $env:FRONTEND_URL='http://127.0.0.1:3001'
  $arg = '"' + $backendMain + '"'
  $p = Start-Process -FilePath $node.Source -ArgumentList $arg -WorkingDirectory $backend -RedirectStandardOutput (Join-Path $runDir 'backend.log') -RedirectStandardError (Join-Path $runDir 'backend-errors.log') -WindowStyle Hidden -PassThru
  Set-Content -Path (Join-Path $runDir 'backend.pid') -Value $p.Id
}
if (!(WaitFor ($backendUrl + '/api/health') 25)) { Fail ('Backend failed startup health check. See ' + (Join-Path $runDir 'backend-errors.log')) }
if (!$fp) {
  Say 'Starting Creator Page Builder...'
  $env:PORT='3001'
  $env:HOST='127.0.0.1'
  $env:BROWSER='none'
  $env:REACT_APP_API_URL=$backendUrl
  $env:REACT_APP_SOCKET_URL=$backendUrl
  $arg = '"' + $frontendMain + '" start'
  $p = Start-Process -FilePath $node.Source -ArgumentList $arg -WorkingDirectory $frontend -RedirectStandardOutput (Join-Path $runDir 'frontend.log') -RedirectStandardError (Join-Path $runDir 'frontend-errors.log') -WindowStyle Hidden -PassThru
  Set-Content -Path (Join-Path $runDir 'frontend.pid') -Value $p.Id
}
if (!(WaitFor $frontendUrl 90)) { Fail ('Creator Page Builder failed startup. See ' + (Join-Path $runDir 'frontend-errors.log')) }
Say 'Ready. Opening Creator Control Center.'
Start-Process $frontendUrl
