# FOIA Doc Review Scraper
Scrapes records from FOIA document review PDFs to CSVs with extracted information

<br>

#### 🎯 TODO • Improvements 
* Group pages ranges together into a single row
* Clean up exemption parsing (when parenthesis are off)
* Text summarization?
* Infer document title

<br>

#### 📦 Dependencies
* Python3
* ImageMagick
* Pillow
* Pytesseract

<br>

#### ✨ To run
* Navigate to this folder in the terminal
```
python3 -m http.server
```
Then, go to http://localhost:8000/ in your browser (your server logs should tell you where this is running).
