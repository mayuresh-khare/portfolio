# Copy-Images.ps1
# Run this script once to copy AI-generated project images into the portfolio folder.
# Right-click > "Run with PowerShell" or run in terminal.

$brain = "C:\Users\admin\.gemini\antigravity\brain\c38d99ea-9b7a-47fd-8380-2fbaeef1b57e"
$dest  = $PSScriptRoot

$map = @{
    "img_vegetation.png" = "proj_vegetation_1783954770765.png"
    "img_events.png"     = "proj_events_1783954781587.png"
    "img_spenddna.png"   = "proj_spenddna_1783954790991.png"
    "img_redflag.png"    = "proj_redflag_1783954801452.png"
}

foreach ($destName in $map.Keys) {
    $srcFile = Join-Path $brain $map[$destName]
    $dstFile = Join-Path $dest $destName
    if (Test-Path $srcFile) {
        Copy-Item $srcFile $dstFile -Force
        Write-Host "✓ Copied $destName" -ForegroundColor Green
    } else {
        Write-Host "✗ Source not found: $($map[$destName])" -ForegroundColor Red
    }
}

Write-Host "`nDone! Open index.html in your browser." -ForegroundColor Cyan
