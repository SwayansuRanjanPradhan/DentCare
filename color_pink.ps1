Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("c:\Users\swaya\Downloads\DentCare\DentCare\img\index_img.jpeg")
$colors = @()
for ($y = 0; $y -lt $bmp.Height; $y+=5) {
    for ($x = 0; $x -lt $bmp.Width; $x+=5) {
        $c = $bmp.GetPixel($x, $y)
        # Looking for pink/magenta colors where R is prominent, B is also prominent, G is lower
        if ($c.R -gt ($c.G + 50) -and $c.B -gt ($c.G + 20)) {
            $colors += "{0:X2}{1:X2}{2:X2}" -f $c.R, $c.G, $c.B
        }
    }
}
$colors | Group-Object | Sort-Object Count -Descending | Select-Object Name, Count -First 5
