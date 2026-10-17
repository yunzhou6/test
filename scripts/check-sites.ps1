<#
.SYNOPSIS
  检查 yunzhou6/test 两个 Netlify 站点的线上健康状态。

.DESCRIPTION
  验证首页、robots.txt、sitemap.xml 是否返回 HTTP 200，
  并检查首页标题、canonical 与 HSTS 安全响应头。
  任一检查失败时以退出码 1 结束，适合接入定时任务或 CI。

.EXAMPLE
  pwsh -File .\scripts\check-sites.ps1
#>
[CmdletBinding()]
param(
  [int]$TimeoutSec = 20
)

$ErrorActionPreference = 'Stop'

$sites = @(
  [pscustomobject]@{
    Name            = '企业落地页'
    BaseUrl         = 'https://stirring-elf-614467.netlify.app'
    ExpectedTitle   = '云启 CloudStart'
    ExpectedCanonical = 'https://stirring-elf-614467.netlify.app/'
  },
  [pscustomobject]@{
    Name            = '联盟营销主页'
    BaseUrl         = 'https://yunzhou6-affiliate.netlify.app'
    ExpectedTitle   = '优选清单'
    ExpectedCanonical = 'https://yunzhou6-affiliate.netlify.app/'
  }
)

$results = @()

function Add-Result {
  param(
    [string]$Site,
    [string]$Check,
    [bool]$Passed,
    [string]$Detail
  )
  $script:results += [pscustomobject]@{
    Site   = $Site
    Check  = $Check
    Passed = $Passed
    Detail = $Detail
  }
}

foreach ($site in $sites) {
  $base = $site.BaseUrl.TrimEnd('/')

  try {
    $homeResponse = Invoke-WebRequest -Uri "$base/" -UseBasicParsing -TimeoutSec $TimeoutSec
    Add-Result $site.Name '首页 HTTP 200' ($homeResponse.StatusCode -eq 200) "HTTP $($homeResponse.StatusCode)"

    $title = [regex]::Match($homeResponse.Content, '<title[^>]*>(.*?)</title>', 'IgnoreCase').Groups[1].Value
    Add-Result $site.Name '首页标题' ($title -like "*$($site.ExpectedTitle)*") $title

    $canonicalMatch = [regex]::Match($homeResponse.Content, '<link\s+rel="canonical"\s+href="([^"]+)"', 'IgnoreCase')
    $canonical = if ($canonicalMatch.Success) { $canonicalMatch.Groups[1].Value } else { '' }
    Add-Result $site.Name 'canonical 地址' ($canonical -eq $site.ExpectedCanonical) $canonical

    $hsts = [string]$homeResponse.Headers['Strict-Transport-Security']
    Add-Result $site.Name 'HSTS 响应头' ($hsts -match 'max-age=\d+') $hsts
  }
  catch {
    Add-Result $site.Name '首页请求' $false $_.Exception.Message
  }

  foreach ($path in @('robots.txt', 'sitemap.xml')) {
    try {
      $response = Invoke-WebRequest -Uri "$base/$path" -UseBasicParsing -TimeoutSec $TimeoutSec
      Add-Result $site.Name $path ($response.StatusCode -eq 200) "HTTP $($response.StatusCode), $($response.RawContentLength) bytes"
    }
    catch {
      Add-Result $site.Name $path $false $_.Exception.Message
    }
  }
}

$results | Format-Table -AutoSize

$failed = @($results | Where-Object { -not $_.Passed })
if ($failed.Count -gt 0) {
  Write-Host ""
  Write-Host "站点巡检失败：$($failed.Count) 项" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "站点巡检通过：$($results.Count) 项全部正常" -ForegroundColor Green
exit 0
