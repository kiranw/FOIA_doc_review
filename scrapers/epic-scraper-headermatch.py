import io
from PIL import Image
import pytesseract
from wand.image import Image as wi
import csv
import re

def PDFtoText(pathToFile):
	print("Start executing...🤞...")
	foia_exemptions_pattern = re.compile('(\([b|0]\)\([123456789]\)\(?[A|B|C|D|E]?\)?)')
	filename_bates_pattern = re.compile("([^\n\r\s]*ICLI[^ ]*) ([^\n\r\s]*)")

	with open(pathToFile[:-4]+"-headermatch.csv", 'w', newline='') as file:
		writer = csv.writer(file)
		fields = ["Filename", "Beginning Bates Page", "Ending Bates Page", "Exemptions"]
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
		previous_header = ""
		filename = "None"
		bates_start = ""
		bates_end = ""
		foia_exemptions = set()

		for imgBlob in imageBlobs:
			with Image.open(io.BytesIO(imgBlob)) as image:
				text = pytesseract.image_to_string(image, lang = 'eng')

				print(text[:100])

				filename_bates = filename_bates_pattern.findall(text)

				# Headers don't match - publish previous document range and start a new range
				if text[:30] != previous_header:
					row = [filename, bates_start, bates_end, ", ".join(sorted(foia_exemptions))]
					print(row)
					writer.writerow(row)
					previous_header = text[:30]
					bates_start = ""
					bates_end = ""
					if len(filename_bates): bates_start = filename_bates[0][1]
					foia_exemptions = set()

				# Regardless, keep incrementing the end of the Bates range, and update the set of exemptions
				if len(filename_bates): 
					if filename_bates[0][0]: filename = filename_bates[0][0]
					if filename_bates[0][1]: bates_end = filename_bates[0][1]
				foia_exemptions.update(foia_exemptions_pattern.findall(text))

		# publish the last row
		writer.writerow([filename, bates_start, bates_end, ", ".join(sorted(foia_exemptions))])

		print("✨ Completed Extraction ✨")


# TODO - use sysargs, take inputs from the command line
PDFtoText("../../2022-ICLI-00037 Nov.pdf")

