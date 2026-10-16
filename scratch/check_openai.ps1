$lines = Get-Content 'backend/src/main/resources/.env'
$key = ""
foreach ($line in $lines) {
    if ($line.StartsWith("OPENAI_API_KEY=")) {
        $key = $line.Substring("OPENAI_API_KEY=".Length).Trim()
    }
}
$headers = @{
    "Authorization" = "Bearer $key"
    "Content-Type" = "application/json"
}
try {
    $res = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" -Method Post -Headers $headers -InFile "scratch/openai_test.json"
    $res | ConvertTo-Json -Depth 4
} catch {
    Write-Host "Error: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response body: " $reader.ReadToEnd()
    }
}
