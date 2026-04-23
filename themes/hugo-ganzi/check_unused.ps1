$total = 0
$unused = @()

$classes = Get-Content "css_classes.txt"
$total = $classes.Count

foreach ($cls in $classes) {
    $found = $false
    $escapedCls = [regex]::Escape($cls)

    $htmlFiles = Get-ChildItem -Path "layouts","assets\js" -Recurse -Include "*.html","*.js" -ErrorAction SilentlyContinue
    foreach ($file in $htmlFiles) {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -match $escapedCls) {
            $found = $true
            break
        }
    }

    if (-not $found) {
        $cssFiles = Get-ChildItem -Path "assets\css" -Include "*.css"
        foreach ($file in $cssFiles) {
            $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
            if ($content -match "(?<!-)$escapedCls[^a-zA-Z0-9_-]") {
                $found = $true
                break
            }
        }
    }

    if (-not $found) {
        $unused += $cls
    }
}

Write-Host "======================================"
Write-Host "     CSS Unused Detection Report"
Write-Host "======================================"
Write-Host "Total CSS classes: $total"
Write-Host "Potentially unused: $($unused.Count)"
Write-Host "Potentially used rate: $([math]::Round(($total - $unused.Count)/$total*100, 1))%"
Write-Host "======================================"
Write-Host ""
Write-Host "Potentially unused CSS classes (verify manually):"
$unused | ForEach-Object { Write-Host "  .$_" }
