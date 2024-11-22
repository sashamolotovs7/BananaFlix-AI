# QR_Generator.py
# To install the qrcode module, run: pip install qrcode[pil]
# To generate the QR code, run this script: python QR_Generator.py

# To install the qrcode module: pip install qrcode[pil]

import qrcode
import os

# Define the directory for saving QR codes
qr_image_directory = 'client/src/assets'

# Ensure the directory exists
os.makedirs(qr_image_directory, exist_ok=True)

# Here you can generate QR codes by defining the url and filename
# The QR code will be saved in the "client/src/assets" directory
qr_codes = [
    {"content": "git@github.com:bmw-dev0p/BananaFlix.git", "filename": "GitHub_BananaFlix_Repo.png"},
    {"content": "https://bananaflix.onrender.com", "filename": "BananaFlix_onRender.png"},
    {"content": "https://docs.google.com/presentation/d/14orPGbxQocfxTU0-85zaSroy88kXk9IbeBiFUTAvj7Q/edit?usp=sharing", "filename": "BananaFlix_Presentation.png"},
]

# Generate and save each QR code
for qr in qr_codes:
    try:
        # Generate the QR code
        qr_image = qrcode.make(qr["content"])

        # Define the full path for the QR code image
        qr_image_path = os.path.join(qr_image_directory, qr["filename"])

        # Save the QR code image
        qr_image.save(qr_image_path)
        print(f"QR code saved at: {qr_image_path}")

    except Exception as e:
        print(f"An error occurred while saving {qr['filename']}: {e}")

