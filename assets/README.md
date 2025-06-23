# Assets Folder

This folder contains all the sock product images for the Sock Drop e-commerce website.

## Current Image Files

All sock products now use real images from this folder:

- `Pizza socks.png` - Used by Pizza Socks product
- `Dinosaur Socks.jpg` - Used by Dinosaur Socks product  
- `Dad Joke socks.jpg` - Used by Dad Joke Socks product
- `Christmas Tree Socks.jpg` - Used by Christmas Tree Socks product
- `Cat Socks.jpg` - Used by Cat Socks product
- `Taco Socks.jpg` - Used by Taco Socks product
- `Pun Socks.jpg` - Used by Pun Socks product
- `halloween socks.jpeg` - Used by Halloween Socks product

## Image Implementation

The website now uses local images instead of placeholder URLs:
- All images are loaded from the `assets/` folder
- Fallback system still exists in case images fail to load
- Images are optimized for web display (300x200px for products, 80x80px for cart)

## File Naming Convention

Images follow a descriptive naming pattern:
- Product name + file extension
- Spaces are preserved in filenames
- Mixed case for readability

## Technical Details

- **Formats**: JPG, PNG, JPEG supported
- **Loading**: Lazy loading implemented for better performance
- **Fallbacks**: Colored backgrounds with product names if images fail
- **Responsive**: Images scale properly on all devices

## Adding New Images

When adding new sock products:

1. Save the image in this `assets/` folder
2. Use descriptive filename (e.g., `New Sock Product.jpg`)
3. Update the `image` property in `script.js`:
   ```javascript
   {
       id: 9,
       name: "New Sock Product",
       image: "assets/New Sock Product.jpg",
       fallbackColor: "#YOUR_COLOR"
   }
   ```

## Troubleshooting

If images don't display:
1. Check file paths in `script.js`
2. Ensure filenames match exactly (case-sensitive)
3. Verify images are in the correct format
4. Check browser console for errors 