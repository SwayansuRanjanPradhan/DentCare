Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("c:\Users\swaya\Downloads\DentCare\DentCare\img\index_img.jpeg")
$colors = @()
for ($y = 0; $y -lt $bmp.Height; $y+=5) {
    for ($x = 0; $x -lt $bmp.Width; $x+=5) {
        $c = $bmp.GetPixel($x, $y)
        # Looking for teal/blue colors where G and B are prominent, R is lower
        if ($c.G -gt ($c.R + 20) -and $c.B -gt ($c.R + 20)) {
            $colors += "{0:X2}{1:X2}{2:X2}" -f $c.R, $c.G, $c.B
        }
    }
}
$colors | Group-Object | Sort-Object Count -Descending | Select-Object Name, Count -First 10
