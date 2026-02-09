
$body = Get-Content -Path "c:\\ECOMMERCE\\Order-Management\\patch_data.json" -Raw
try {
    $response = Invoke-RestMethod -Method Patch -Uri "http://localhost:8080/api/products/update/2" -Body $body -ContentType "application/json"
    Write-Output "Update Response:"
    Write-Output $response
} catch {
    Write-Error $_
}

Write-Output "`nVerifying update..."
try {
    $product = Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/products/2"
    Write-Output "Current Product:"
    Write-Output $product
} catch {
    Write-Error $_
}
