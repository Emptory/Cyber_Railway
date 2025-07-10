'''
from flask import Flask, request, jsonify
import torch
import json
from model import self_net
from pathlib import Path
from torchvision.transforms.v2 import functional as F
from PIL import Image
import numpy as np
import time

if __name__ == "__main__":
    model = self_net(1, 4)
    state_dict = torch.load("model.pth", map_location="cpu").state_dict()
    model.load_state_dict(state_dict)
    print("param: ", sum(p.numel() for p in model.parameters()))
    data_root = Path(__file__).parent / "DataC" / "Img"
    datas = sorted(data_root.glob("*.jpg"))

    model.eval()

    for d in datas:
        img = Image.open(d).convert("L")
        img = F.to_dtype(F.to_image(img), torch.float32, True)[None]
        with torch.no_grad():
            pred = model(img).argmax(1)[0].cpu().numpy()
            pred: np.array = pred.astype(np.uint8)
        assert pred.shape == (200, 200)
        # Convert numpy array to list for JSON serialization
        pred_list = pred.tolist()

        output_path = d.with_suffix(".json").name
        # 在当前文件夹中创建目标文件夹和文件路径
        output_path = Path(__file__).parent / "c_test_predictions" / f"c_prediction_{output_path}"

        # 如果文件夹不存在，则创建它
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Save as JSON
        with open(output_path, 'w') as f:
            json.dump(pred_list, f)
        print(f"Saved prediction for {d.name} to {output_path}")


'''

import cv2
import numpy as np
import cv2    # AidLux内置的摄像头库（可选）
import os
import json
from pathlib import Path
import aidlite_gpu 
# ----------------------------
# 1. 初始化USB摄像头
# ----------------------------
# def init_camera():
#     cap = cv2.VideoCapture("/dev/video0")  # 明确指定video0
#     if not cap.isOpened():
#         print("Error: Could not open camera")
#         exit()
#     cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
#     cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
#     return cap

# ----------------------------
# 2. 加载AidLite加速模型
# ----------------------------
def load_model():
    # 模型路径（需替换为你的模型文件）
    import os
    print('1'*10)
    # 初始化AidLite
    aidlite1 = aidlite_gpu.aidlite()
    print('1'*10)
    model_path = os.path.join(os.path.dirname(__file__), 'model_fp32.tflite')
    inShape =[1 * 1 * 200 * 200 * 4]
    outShape = [1 * 4 * 200 * 200 * 4]  # 假设输出是4通道的200x200图像
    print('gpu:',aidlite1.FAST_ANNModel(model_path,inShape,outShape,4,0))

    return aidlite1   # 必须加上这一行  
    # 加载模型（TFLite示例）
   

# ----------------------------
# 3. 预处理函数
# ----------------------------
def preprocess(img_path, target_size=(200, 200)):
    img = cv2.imread(str(img_path), cv2.IMREAD_GRAYSCALE)  # 读取为灰度
    img = cv2.resize(img, target_size)
    img = img.astype(np.float32)/255                   # 归一化到[0,1]
    img = np.expand_dims(img, axis=0)                      # [1, 200, 200]
    img = np.expand_dims(img, axis=0)                      # [1, 1, 200, 200]
    return img

# ----------------------------
# 4. 主推理循环
# ----------------------------
# def main():
#     # 初始化
#     cap = init_camera()
#     aidlite = load_model()

#     save_dir = os.path.join(os.path.dirname(__file__), "c_test_prediction")
#     os.makedirs(save_dir, exist_ok=True)
#     img_idx = 0  # 用于文件命名
    
#     while True:
#         # 读取摄像头帧
#         ret, frame = cap.read()
#         if not ret:
#             print("Error: Frame read failed")
#             break
        
#         # 预处理
#         input_data = preprocess(frame)
        
#         # 推理（AidLite加速）
#         aidlite.setInput_Uint8(input_data)
#         aidlite.invoke()
        
#         # 获取输出（示例：分类模型）
#         output = aidlite.getOutput_Float32(0) 
#         output = np.array(output)
#         output = output.reshape(200, 200)  # 根据实际输出调整
#         # 若是分类概率，取argmax
#         output = np.argmax(output, axis=0)  # 若需要

#         # 保存为json
#         output_list = output.astype(np.uint8).tolist()
#         save_path = os.path.join(save_dir, f"c_prediction_{img_idx:05d}.json")
#         with open(save_path, "w") as f:
#             json.dump(output_list, f)
#         print(f"Saved prediction to {save_path}")
#         img_idx += 1

#         # # 退出条件
#         # if cv2.waitKey(1) & 0xFF == ord('q'):
#         #     break
    
#     # 释放资源
#     cap.release()
#     cv2.destroyAllWindows()

def main():
    aidlite = load_model()
    # 读取DataC/Img下所有jpg图片
    data_root = Path(__file__).parent / "DataC" / "Img"
    datas = sorted(data_root.glob("*.jpg"))

    save_dir = os.path.join(os.path.dirname(__file__), "c_test_prediction")
    os.makedirs(save_dir, exist_ok=True)

    for d in datas:
        input_data = preprocess(d)
        aidlite.setInput_Float32(input_data)
        aidlite.invoke()

        output = aidlite.getOutput_Float32(0)
        # output: np.array = output.astype(np.uint8)
        print(f"Processing {d.name}, output shape: {output}")
        output = output.reshape(200, 200)
        assert output.shape == (200, 200)  # 根据实际输出调整
  
        output_list = output.tolist()

        output_path = d.with_suffix(".json").name
        # 在当前文件夹中创建目标文件夹和文件路径
        output_path = Path(__file__).parent / "c_test_predictions" / f"c_prediction_{output_path}"

        # 如果文件夹不存在，则创建它
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Save as JSON
        with open(output_path, 'w') as f:
            json.dump(output_list, f)
        print(f"Saved prediction for {d.name} to {output_path}")

if __name__ == "__main__":
    main()

