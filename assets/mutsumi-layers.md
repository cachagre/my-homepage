# Living illustration assets

Made with the built-in image generation tool. Reference/edit target: `mutsumi-greeting.webp`. Delivered as static WebP (quality 88, alpha quality 100), with the original canvas size retained at 1672 × 941. Motion is applied to separate layers in the page, not baked into the images.

## Foreground prompt

Use case: background-extraction. Edit target: supplied anime rooftop portrait. Extract ONLY the girl including all hair strands, raised hand, clothing, and rim lighting onto genuinely transparent alpha background. Preserve her exact face, pose, expression, proportions, colors, location and scale within the original full landscape 1672x941 canvas (16:9); preserve empty left space. Do not center, enlarge, redraw, or change her. Remove the entire rooftop, sky, fence, buildings, and water. No ground shadow or text. This is a compositing foreground layer, not a new illustration.

Output: `mutsumi-foreground.webp`.

## Background prompt

Use case: precise-object-edit. Edit target: supplied anime rooftop portrait. Remove the girl completely, including every hair strand, raised hand and clothing. Inpaint the covered rooftop, fence, distant waterfront, evening sky and sunset seamlessly. Preserve exact original 16:9 landscape framing, perspective, skyline height, blue-hour colors, anime paint texture and light direction. This is an empty background plate to composite the same girl back on top. No people, silhouettes, new objects, text, or borders.

Output: `mutsumi-background.webp`.
