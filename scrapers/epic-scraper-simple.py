import io
from PIL import Image
import pytesseract
from wand.image import Image as wi
import csv
import re

def PDFtoText(pathToFile):
	print("Start executing...🤞...")
	foia_exemptions_pattern = re.compile('(\(b\)\([1234567]\)\(?[E|C]?\)?)')
	filename_bates_pattern = re.compile("([^\n\r\s]*ICLI[^ ]*) ([^\n\r\s]*)")

	with open(pathToFile[:-3]+"csv", 'w', newline='') as file:
		writer = csv.writer(file)
		fields = ["Filename", "Bates Number","Exemptions"]
		writer.writerow(fields)

		print("Convert PDF to images...")
		# Set up PDF -- TODO, change to a stream with one page at a time -- this takes up too much memory
		pdfFile = wi(filename = pathToFile, resolution = 300)
		image = pdfFile.convert('jpeg')
		imageBlobs = []

		print("Beginning image sequencing...")
		for img in image.sequence:
			imgPage = wi(image = img)
			imageBlobs.append(imgPage.make_blob('jpeg'))


		print("Begin text extraction...")
		for imgBlob in imageBlobs:
			with Image.open(io.BytesIO(imgBlob)) as image:
				text = pytesseract.image_to_string(image, lang = 'eng')

				# TODO - group pages with similar headers
				foia_exemptions = ", ".join(sorted({*foia_exemptions_pattern.findall(text)}))
				filename = "None"
				bates = ""
				filename_bates = filename_bates_pattern.findall(text)
				if len(filename_bates): 
					filename = filename_bates[0][0]
					bates = filename_bates[0][1]
				row = [filename, bates, foia_exemptions]
				print(row)
				writer.writerow(row)

		print("✨ Completed Extraction ✨")


# TODO - use sysargs, take inputs from the command line
PDFtoText("2022-ICLI-00037 Nov.pdf")


