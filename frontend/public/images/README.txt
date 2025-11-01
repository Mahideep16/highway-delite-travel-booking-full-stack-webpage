Place image files here to override experience images by name.

Naming rules (case-insensitive):
- Use the experience name as the base, slugged: spaces -> '-', punctuation removed.
  Example: 'Bunjee Jumping' -> bunjee-jumping.jpg
- To target a specific location variant, append '-' + the location slug.
  Examples:
    - 'Nandi Hills Sunrise' in 'Bangalore' -> nandi-hills-sunrise-bangalore.jpg
    - 'Kayaking' in 'Udupi, Karnataka' -> kayaking-udupi-karnataka.jpg
- Supported extensions tried (in order): .jpg then .png
- Fallback: if no local file matches, the API-provided image URL is used automatically.

Suggested files based on current seed data:
- kayaking.jpg (or kayaking-udupi.jpg, kayaking-udupi-karnataka.jpg)
- nandi-hills-sunrise-bangalore.jpg
- coffee-trail-coorg.jpg
- boat-cruise-sundarban.jpg
- bunjee-jumping-manali.jpg
