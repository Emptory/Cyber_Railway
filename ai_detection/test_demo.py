import train_check as demo
import time
import cv2
if __name__ == "__main__":
    cap = cv2.VideoCapture(0)
    while True:
        # Capture frame-by-frame    q
        if not cap.isOpened():
            print("无法打开摄像头")
            exit()

        ret, frame = cap.read()
        if not ret:
            print("无法接收帧（流结束？）")
            exit()
        
        # Call the segmentation function
        start_time = time.time()
        result = demo.cal_segmentation(frame)
        end_time = time.time()
        
        print(f"Segmentation took {end_time - start_time:.2f} seconds")
        # Break the loop on 'q' key press

