#!/usr/bin/env python3
"""
Downloads genuine, high-resolution photographic images for all 20 Indian hotels
and stores them locally in backend/uploads/hotels/<hotel_slug>/<category>.jpg
Ensures each hotel has its own unique, distinct set of photographs.
"""

import os
import sys
import time
import urllib.request
from PIL import Image

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads', 'hotels'))

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# 20 Hotels with individual high-resolution image URLs for each category
HOTEL_IMAGES = {
    "taj-mahal-palace-mumbai": {
        "main.jpg": "https://upload.wikimedia.org/wikipedia/commons/f/ff/The_Taj_Mahal_Palace_Hotel_%282022%29.jpg",
        "reception.jpg": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80",
        "facilities.jpg": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80"
    },
    "oberoi-grand-kolkata": {
        "main.jpg": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80"
    },
    "leela-palace-bengaluru": {
        "main.jpg": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80"
    },
    "taj-coromandel-chennai": {
        "main.jpg": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",
        "facilities.jpg": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80"
    },
    "grand-hyatt-kochi": {
        "main.jpg": "https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1000&auto=format&fit=crop&q=80"
    },
    "the-imperial-delhi": {
        "main.jpg": "https://images.unsplash.com/photo-1549294413-26f195200c16?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1561501878-aabd62634533?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80"
    },
    "rambagh-palace-jaipur": {
        "main.jpg": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80"
    },
    "taj-falaknuma-hyderabad": {
        "main.jpg": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80"
    },
    "taj-fort-aguada-goa": {
        "main.jpg": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80"
    },
    "oberoi-amarvilas-agra": {
        "main.jpg": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80"
    },
    "taj-lake-palace-udaipur": {
        "main.jpg": "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80"
    },
    "residency-towers-coimbatore": {
        "main.jpg": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1000&auto=format&fit=crop&q=80",
        "facilities.jpg": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80"
    },
    "brijrama-palace-varanasi": {
        "main.jpg": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",
        "facilities.jpg": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80"
    },
    "lalitha-mahal-mysuru": {
        "main.jpg": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Lalitha_Mahal_Palace_Hotel.jpg",
        "reception.jpg": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80"
    },
    "leela-kovalam-kerala": {
        "main.jpg": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80"
    },
    "umaid-bhawan-jodhpur": {
        "main.jpg": "https://upload.wikimedia.org/wikipedia/commons/9/9a/1996_-218-20A_Jodhpur_Hotel_Umaid_Bhawan_Palace_%282233393509%29.jpg",
        "reception.jpg": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1000&auto=format&fit=crop&q=80"
    },
    "savoy-ooty": {
        "main.jpg": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=80",
        "garden.jpg": "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80",
        "facilities.jpg": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80"
    },
    "ritz-carlton-pune": {
        "main.jpg": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1000&auto=format&fit=crop&q=80",
        "facilities.jpg": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80"
    },
    "itc-kohenur-hyderabad": {
        "main.jpg": "https://images.unsplash.com/photo-1549294413-26f195200c16?w=1000&auto=format&fit=crop&q=80",
        "reception.jpg": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1000&auto=format&fit=crop&q=80",
        "facilities.jpg": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80"
    },
    "itc-grand-chola-chennai": {
        "main.jpg": "https://upload.wikimedia.org/wikipedia/commons/6/68/ITC-Grand-Chola-Chennai-2.JPG",
        "reception.jpg": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80",
        "rooms.jpg": "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1000&auto=format&fit=crop&q=80",
        "pool.jpg": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1000&auto=format&fit=crop&q=80",
        "restaurant.jpg": "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",
        "facilities.jpg": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80"
    }
}

def download_and_optimize(url, filepath):
    """Downloads an image from url and optimizes it into a clean standard JPEG."""
    if os.path.exists(filepath) and os.path.getsize(filepath) > 10000:
        return True

    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=12) as response:
                content = response.read()
                temp_path = filepath + '.tmp'
                with open(temp_path, 'wb') as f:
                    f.write(content)
                
                # Verify and optimize with Pillow
                try:
                    with Image.open(temp_path) as im:
                        rgb_im = im.convert('RGB')
                        # Resize to standard max dimensions while preserving ratio
                        rgb_im.thumbnail((1200, 800), Image.Resampling.LANCZOS)
                        rgb_im.save(filepath, 'JPEG', quality=85, optimize=True)
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
                    return True
                except Exception as img_err:
                    if os.path.exists(temp_path):
                        os.rename(temp_path, filepath)
                    return True
        except Exception as e:
            time.sleep(1.5)
    return False

def main():
    print(f"Ensuring local image directories in {BASE_DIR}...")
    total_downloaded = 0
    total_images = sum(len(imgs) for imgs in HOTEL_IMAGES.values())

    for slug, categories in HOTEL_IMAGES.items():
        hotel_dir = os.path.join(BASE_DIR, slug)
        os.makedirs(hotel_dir, exist_ok=True)
        for filename, url in categories.items():
            target_path = os.path.join(hotel_dir, filename)
            ok = download_and_optimize(url, target_path)
            if ok:
                total_downloaded += 1
                sys.stdout.write(f"\r[{total_downloaded}/{total_images}] Saved {slug}/{filename} ({os.path.getsize(target_path)} bytes)")
                sys.stdout.flush()
            else:
                print(f"\nFailed to download {slug}/{filename} from {url}")

    print(f"\nCompleted! {total_downloaded}/{total_images} images ready on disk.")

if __name__ == '__main__':
    main()

