$unusedClasses = @(
    "about_wei", "ajaxcomm", "archive-comment-count", "archive-count",
    "article-link", "comment_at", "comment-respond", "douban",
    "douban-box", "doubanicon", "fenye", "figure", "figure-item",
    "headermenu", "movie-box", "qrcodeicon", "qrcode-page", "qrcode-scanimg",
    "rightbox", "righticon", "search-box", "shang-title", "socialicon",
    "timeline-archive", "top-comment", "touchingpic", "v_demo", "vv_demo",
    "wave", "widget-comment", "widget-comment-commentator", "widget-comment-contnet",
    "widget-comment-date", "wp-block-code"
)

$cssPath = "assets\css\style.css"
$content = Get-Content $cssPath -Raw

$removed = @()
$failed = @()

foreach ($cls in $unusedClasses) {
    $pattern = "(?s)\.$cls\s*\{[^}]*\}"
    $newContent = $content -replace $pattern, ""
    if ($newContent -ne $content) {
        $content = $newContent
        $removed += $cls
    } else {
        $failed += $cls
    }
}

Set-Content -Path $cssPath -Value $content -NoNewline
Write-Host "Removed $($removed.Count) CSS classes"
if ($failed.Count -gt 0) {
    Write-Host "Not found: $($failed -join ', ')"
}
