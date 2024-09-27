const fs = require('fs');
const path = require('path');

// List of your HTML files
const files = ['NA_Manual.html', 'Res_Manual.html', 'GSA_Manual.html', 'iHMS.html'];

// Function to process each file
const renumberSlidesInFile = (fileName) => {
  const filePath = path.join(__dirname, fileName);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;

    // Find and replace slide numbers
    let slideNumber = 1;
    const updatedData = data.replace(/<!-- Slide \d{2} -->/g, () => {
      return `<!-- Slide ${String(slideNumber++).padStart(2, '0')} -->`;
    });

    fs.writeFile(filePath, updatedData, 'utf8', (err) => {
      if (err) throw err;
      console.log(`Slide numbers updated in ${fileName}!`);
    });
  });
};

// Loop through the list of files and renumber slides in each
files.forEach(renumberSlidesInFile);
