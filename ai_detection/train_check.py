import torch
import json
from model import self_net
from pathlib import Path
from torchvision.transforms.v2 import functional as F
from PIL import Image
import numpy as np
import cv2

frame_count = 0  # Initialize frame count

model = self_net(1, 4)
state_dict = torch.load("model.pth", map_location="cpu").state_dict()
model.load_state_dict(state_dict)
print("param: ", sum(p.numel() for p in model.parameters()))

model.eval()

def cal_segmentation(src):
    # 将帧转换为灰度图像
    gray_frame = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)

    # 调整图像大小为200x200
    resized_frame = cv2.resize(gray_frame, (200, 200))

    # 转换为PIL图像
    pil_img = resized_frame

    # 转换为模型输入格式
    img_tensor = F.to_dtype(F.to_image(pil_img), torch.float32, True)[None]


    with torch.no_grad():
        pred = model(img_tensor).argmax(1)[0].cpu().numpy()
        print("预测结果的形状:", pred.shape)
        pred = pred.astype(np.uint8)
    assert pred.shape == (200, 200)
    # Convert numpy array to list for JSON serialization
    pred_list = pred.tolist()

    # output_dir = Path(__file__).parent / "c_test_predictions"
    # output_dir.mkdir(parents=True, exist_ok=True)


    # output_path = output_dir / f"prediction_{frame_count}.json"
    # with open(output_path, 'w') as f:
    #     json.dump(pred.tolist(), f)
    # print(f"Saved prediction for frame {frame_count} to {output_path}")

    # frame_count += 1
    return pred.tolist()

