$cmd="./node_modules/nexe/index.js"
$path_to_js=(Resolve-Path ./out/mapping-generator.js).Path
$path_to_bin=(Resolve-Path ./bin).Path

# From https://stackoverflow.com/a/3593445
# Write-Output "cmd: " + $cmd 
# Write-Output "input: " + $path_to_js 
# Write-Output "output:" + $path_to_js 
# & node $cmd $parameters
# echo $parameters
$configuration = @(
    # [pscustomobject]@{platform="windows-x64"; executable="mapping-generator.exe"},
    [pscustomobject]@{platform="linux-x64-5.10.0"; executable="mapping-generator-64-510.sh"}
    # [pscustomobject]@{platform="linux-x64-4.15.0"; executable="mapping-generator-64-415.sh"}
    # [pscustomobject]@{platform="linux-x32"; executable="mapping-generator-32.sh"}
)
Foreach ($config in $configuration) { 
    $parameters='-i', $path_to_js, '--build', '-o', "$($path_to_bin)/$($config.executable)", "--target", $config.platform, "--verbose"
    node $cmd $parameters
}