#requires -Version 7.1

# Read the lychee result.json file and generate a markdown report
[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$InputJsonFile = "result.json",

    [Parameter(Mandatory = $false)]
    [string]$OutputMarkdownFile = "result.md",
    
    [Parameter(Mandatory = $false)]
    [string]$LycheeIgnoreFile = ".lycheeignore"
)

# Read the JSON file
try {
    $lycheeResults = Get-Content -Path $InputJsonFile -Raw | ConvertFrom-Json
}
catch {
    Write-Error "Failed to read or parse $InputJsonFile`: $_"
    exit 1
}

# Read the lycheeignore file to get patterns to exclude
$ignorePatterns = @()
if (Test-Path -Path $LycheeIgnoreFile) {
    try {
        $ignorePatterns = Get-Content -Path $LycheeIgnoreFile | Where-Object { $_ -and -not $_.StartsWith('#') }
        Write-Verbose "Loaded $($ignorePatterns.Count) ignore patterns from $LycheeIgnoreFile"
    }
    catch {
        Write-Warning "Failed to read ignore patterns from $LycheeIgnoreFile`: $_"
    }
}

# Initialize the markdown report
$markdownReport = @"
# Summary

| Status        | Count |
|---------------|-------|
| 🔍 Total      | $($lycheeResults.total)  |
| ✅ Successful | $($lycheeResults.successful)  |
| ⏳ Timeouts   | $($lycheeResults.timeouts)  |
| 🔀 Redirected | $($lycheeResults.redirects)  |
| 👻 Excluded   | $($lycheeResults.excludes)  |
| ❓ Unknown    | $($lycheeResults.unknown)  |
| 🚫 Errors     | $($lycheeResults.errors)  |

## Errors per input

"@

# Process each page that has errors
$errorPages = $lycheeResults.error_map | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name | Sort-Object

foreach ($page in $errorPages) {
    # Get error URLs for this page
    $errorUrls = $lycheeResults.error_map.$page
    
    # Check if any errors remain after filtering excluded URLs
    $filteredErrors = @()
    
    foreach ($errorUrl in $errorUrls) {
        $url = $errorUrl.url
        
        # Skip this URL if it's in the excluded_map for this page
        $isExcluded = $false
        
        if ($lycheeResults.excluded_map.PSObject.Properties.Name -contains $page) {
            $excludedUrls = $lycheeResults.excluded_map.$page | ForEach-Object { $_.url }
            if ($excludedUrls -contains $url) {
                $isExcluded = $true
            }
        }
        
        # Skip if the URL matches any of the ignore patterns from .lycheeignore
        if (-not $isExcluded -and $ignorePatterns.Count -gt 0) {
            foreach ($pattern in $ignorePatterns) {
                if ($url -match $pattern) {
                    Write-Verbose "URL $url matches ignore pattern: $pattern"
                    $isExcluded = $true
                    break
                }
            }
        }
        
        if (-not $isExcluded) {
            $filteredErrors += $errorUrl
        }
    }
    
    # Only add this page to the report if it has non-excluded errors
    if ($filteredErrors.Count -gt 0) {
        $markdownReport += "### Errors in $page`n`n"
        
        foreach ($error in $filteredErrors) {
            # Extract URL and error message
            $url = $error.url
            $errorMessage = $error.status.text
            
            $markdownReport += "* [ERROR] [$url]($url) | $errorMessage`n"
        }
        
        $markdownReport += "`n"
    }
}

# Write the markdown report to file
try {
    $markdownReport.Trim() | Out-File -FilePath $OutputMarkdownFile -Encoding utf8
    Write-Host "Report successfully written to $OutputMarkdownFile"
}
catch {
    Write-Error "Failed to write report to $OutputMarkdownFile`: $_"
    exit 1
}
