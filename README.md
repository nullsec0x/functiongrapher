
# Function Grapher

This is a web-based function grapher with a hacker terminal aesthetic. It allows users to visualize mathematical functions with a clean, black and green interface, featuring a typewriter-style welcome message and mobile-friendly interactions.

## Features

- **Hacker Terminal Theme**: Black background with vibrant green text and glowing effects.
- **Typewriter Welcome Message**: An engaging, animated introduction with a dynamic cursor.
- **Function Plotting**: Graph various mathematical functions like `sin(x)`, `cos(x)`, `tan(x)`, `log(x)`, `sqrt(x)`, and more.
- **Exponent Support**: Supports both `x^2` and `x²` (Unicode superscript) notations for powers.
- **Interactive Graph**: Pan and zoom the graph using mouse or touch gestures.
- **Coordinate Display**: Real-time display of coordinates under the mouse/touch pointer.
- **Mobile-Friendly**: Responsive design ensures a great experience on various devices.

## How to Use

1. **Enter Function**: Type your desired mathematical function into the input field. Examples:
   - `sin(x)`
   - `x^2` or `x²`
   - `cos(x) * sin(x)`
   - `x^3 - 2*x`
   - `sqrt(abs(x))`
   - `log(x)`
   - `pi * x`
   - `e^x`

2. **Graph**: Click the "Graph Function" button or press `Enter` to visualize the function.

3. **Interact**: 
   - **Pan**: Click and drag (or touch and drag on mobile) the graph to move it.
   - **Zoom**: Use the mouse wheel (or pinch gesture on mobile) to zoom in and out.
   - **Coordinates**: Move your mouse (or touch) over the graph to see the real-time coordinates.

## Development

This project is built using HTML, CSS, and JavaScript. The core graphing functionality is implemented using the HTML Canvas API.

### Project Structure

- `index.html`: The main HTML file containing the structure of the application.
- `style.css`: Defines the visual styles, including the hacker theme and responsive design.
- `script.js`: Contains the JavaScript logic for the typewriter effect, function parsing, graphing, and user interactions.

## Hosting on GitHub Pages

To host this project on GitHub Pages:

1. **Create a new GitHub repository**.
2. **Upload** `index.html`, `style.css`, and `script.js` to the root of your repository.
3. Go to your repository's **Settings**.
4. Navigate to **Pages** in the left sidebar.
5. Under "Source," select the branch where your files are located (usually `main` or `master`) and the `/ (root)` folder.
6. Click **Save**.

Your Function Grapher will be live at `https://<your-username>.github.io/<your-repository-name>/`.

## License

[Optional: Add your license information here, e.g., MIT License]

