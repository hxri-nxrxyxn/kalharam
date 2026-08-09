import os
from PIL import Image

def process_images(input_dir, output_dir_base):
    # This script assumes you place high-res JPGs/PNGs inside input_dir
    # It will optimize them into webp format at two different sizes
    
    # We output to a thumbs/ and highres/ directory structure
    thumbs_dir = os.path.join(output_dir_base, 'thumbnails')
    highres_dir = os.path.join(output_dir_base, 'highres')

    os.makedirs(thumbs_dir, exist_ok=True)
    os.makedirs(highres_dir, exist_ok=True)

    supported_formats = ('.jpg', '.jpeg', '.png')
    
    for filename in os.listdir(input_dir):
        if not filename.lower().endswith(supported_formats):
            continue
            
        file_path = os.path.join(input_dir, filename)
        base_name = os.path.splitext(filename)[0]
        
        try:
            with Image.open(file_path) as img:
                # Convert to RGB if needed (for PNGs with transparency going to WEBP, RGBA is fine)
                if img.mode not in ('RGB', 'RGBA'):
                    img = img.convert('RGB')
                
                # High Res version (Max width/height 1600px)
                high_res_img = img.copy()
                high_res_img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                high_res_out = os.path.join(highres_dir, f"{base_name}_highres.webp")
                high_res_img.save(high_res_out, 'WEBP', quality=85)
                
                # Thumbnail version (Max width/height 600px)
                thumb_img = img.copy()
                thumb_img.thumbnail((600, 600), Image.Resampling.LANCZOS)
                thumb_out = os.path.join(thumbs_dir, f"{base_name}_thumb.webp")
                thumb_img.save(thumb_out, 'WEBP', quality=75)
                
                print(f"Processed: {filename} -> WEBP (Highres & Thumb)")
                
        except Exception as e:
            print(f"Failed to process {filename}: {e}")

if __name__ == '__main__':
    print("Image optimization script initialized.")
    # Example usage:
    # input_folder = os.path.join(os.path.dirname(__file__), '../raw_images')
    # output_folder = os.path.join(os.path.dirname(__file__), '../web/static/assets/optimized')
    # process_images(input_folder, output_folder)
    print("Modify the script to point to your raw asset directory before running.")
