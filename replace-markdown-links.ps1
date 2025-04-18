# Define the directory to search for .md files
$directory = "D:\git\astro-tutorial-blog\src\posts\"

# Define the regex pattern to match the markdown link
# [new laptop]({% post_url 2023/2023-04-26-new-laptop %})
$pattern = "\[([^\]]+)\]\(\{% post_url (\d{4})/\d{4}-(\d{2})-(\d{2})-([^\s%]+) %\}\)"

# Loop through all .md files in the directory and its subdirectories
Get-ChildItem -Path $directory -Recurse -Filter "*.md" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content -Path $filePath -Raw

    # Replace the markdown link with the desired HTML link format
    $updatedContent = $content -replace $pattern, '[$1](/$2/$3/$5)'

    # Save the updated content back to the file if changes were made
    if ($content -ne $updatedContent) {
        Set-Content -Path $filePath -Value $updatedContent
        Write-Host "Updated: $filePath"
    }
}