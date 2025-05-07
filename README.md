# ConPave Adviser v3.5

## Intelligent IRC-Based Concrete Pavement Recommendation System

ConPave Adviser is a sophisticated decision support tool that helps civil engineers and road construction professionals select the most appropriate concrete pavement type based on Indian Roads Congress (IRC) standards and project requirements.

## Key Features

- **IRC Standard Compliance**: All recommendations follow the latest IRC guidelines (IRC:58-2015, IRC:118-2015, IRC:SP:62-2014, IRC:SP:140-2024)
- **Intelligent Recommendation Engine**: Using input parameters to suggest optimal pavement types (JPCP, JRCP, CRCP, or PCP)
- **Detailed Construction Guidelines**: Specific material requirements, construction sequences, and joint details
- **Lifecycle Cost Analysis**: Comprehensive analysis of initial construction and long-term maintenance costs
- **Environmental Factor Handling**: Based on IRC standards for different climate zones
- **Professional PDF Export**: Save and share detailed recommendations
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Reduces eye strain in low-light environments

## New in Version 3.5

- **Probability Calculator**: Analyze the distribution of pavement type recommendations
- **Admin Panel**: Track usage statistics and fine-tune the recommendation engine
- **Enhanced IRC References**: Detailed references to specific IRC standards for each scoring matrix
- **Improved Scoring System**: Better balancing between pavement types based on IRC standards
- **Popular Parameter Combinations**: Track and analyze the most common input parameters
- **System Calibration**: Fine-tune recommendation weights for specific project requirements
- **Usage Statistics**: Track form completion rates, user sessions, and recommendation distribution

## Standard Features

- **Dark Mode**: Toggle between light and dark themes
- **Enhanced UI**: Improved layout with card hover effects
- **Improved PDF Export**: Better formatting and multi-page support
- **Toast Notifications**: User-friendly status messages
- **Floating Help Button**: Quick access to system documentation
- **Improved Form Validation**: Real-time feedback on input fields
- **Enhanced Data Visualization**: Updated charts with better responsiveness
- **Reference Table Toggle**: Quick access to IRC parameter references

## Usage

1. Fill in all required input parameters in the form
2. Click "Generate Recommendation" to receive tailored pavement advice
3. Review the detailed recommendation including material specifications, construction guidelines, and lifecycle cost analysis
4. Use the "Export to PDF" button to save and share your results
5. View the pavement type probability distribution by clicking the "Calculate Pavement Type Probabilities" button
6. Access the admin panel by adding `?admin` to the URL (for developers and administrators only)

## Probability Calculator

The new probability calculator uses Monte Carlo simulation to estimate the probability of each pavement type being recommended based on random combinations of input parameters. This provides valuable insights into the distribution of recommendations across the parameter space.

To use the probability calculator:
1. Scroll down to the "IRC Parameter Reference" section
2. Click the "Calculate Pavement Type Probabilities" button
3. View the distribution chart and table showing the probabilities of each pavement type

## Admin Panel

The admin panel provides advanced features for monitoring and fine-tuning the system. It includes:

- **Usage Statistics**: Track total recommendations, form completion rates, and user sessions
- **Recommendation Distribution**: Visualize the distribution of recommended pavement types
- **Popular Parameter Combinations**: See which input combinations are most commonly used
- **System Calibration**: Adjust weights for each pavement type to fine-tune recommendations

To access the admin panel, simply add `?admin` to the URL.

## Setup

This is a standalone web application that can be run directly in a browser without any server-side requirements. To get started:

1. Clone this repository
2. Open index.html in any modern web browser
3. Alternatively, use a local development server:
   - Python: `python -m http.server 3000`
   - Node.js: `npx serve -l 3000`

## GitHub Pages Deployment

The application is deployed on GitHub Pages and can be accessed at [https://YOUR-USERNAME.github.io/concrete-pavement-recommender](https://YOUR-USERNAME.github.io/concrete-pavement-recommender).

To deploy your own version:
1. Fork this repository
2. Go to Settings > Pages in your repository
3. Select "GitHub Actions" as the build and deployment source
4. The site will automatically deploy when you push changes to the main branch
5. You can check the deployment status in the Actions tab

### Troubleshooting GitHub Pages Deployment

If recommendations don't show after selecting parameters on GitHub Pages:

1. **Check Browser Console**: Open your browser's developer tools (F12) and check the console tab for error messages
   
2. **Verify Script Loading**: 
   - Ensure all JavaScript files are properly uploaded to your repository
   - The load order is important: scoring → recommendations → training → main → other scripts
   
3. **Path Issues**:
   - GitHub Pages serves content from a subdirectory with your repository name
   - All paths should be relative (e.g., `assets/js/script.js`, not `/assets/js/script.js`)
   
4. **Clear Browser Cache**: 
   - Try opening the site in an incognito/private window
   - Clear your browser cache and reload the page
   
5. **CORS Issues**:
   - GitHub Pages enforces strict security policies
   - Ensure all resources are loaded from HTTPS sources

For persistent issues, try adding `?debug=true` to your URL to enable additional diagnostic information.

## Project Structure

```
concrete-pavement-recommender/
├── assets/
│   ├── js/
│   │   ├── scoring.js              # Main scoring algorithm with IRC standards
│   │   ├── conpave.js              # Core application functionality
│   │   ├── probability_calculator.js # Probability distribution calculator
│   │   ├── probability_display.js  # UI for probability visualization
│   │   └── admin_panel.js          # Admin panel functionality
├── index.html                      # Main application HTML
├── README.md
└── LICENSE
```

## License

MIT License - See LICENSE file for details

## References

The system is based on the following IRC standards:
- IRC:58-2015 - Guidelines for the Design of Plain Jointed Rigid Pavements for Highways
- IRC:118-2015 - Guidelines for Design and Construction of Continuously Reinforced Concrete Pavement
- IRC:SP:62-2014 - Guidelines for the Design and Construction of Cement Concrete Pavements for Low Volume Roads
- IRC:SP:140-2024 - Guidelines for Quality Control during Construction of Concrete Pavements

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/your-github-username/concrete-pavement-recommender](https://github.com/your-github-username/concrete-pavement-recommender) 