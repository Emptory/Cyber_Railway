import torch
from model import self_net  # 导入模型定义

# 1. 直接加载整个模型对象
model = torch.load('model.pth', map_location='cpu')

# 2. 获取state_dict（转换成字典）
state_dict = model.state_dict()

# 3. 用state_dict重新加载到新模型（可选，确保结构一致）
model_new = self_net()
model_new.load_state_dict(state_dict)
model_new.eval()


# 3. 创建示例输入（1*1*200*200，如果是3通道改为1*3*200*200）
dummy_input = torch.randn(1, 1, 200, 200)

# 4. 导出为ONNX
torch.onnx.export(
    model, 
    dummy_input, 
    "model.onnx", 
    input_names=['input'], 
    output_names=['output'],
    opset_version=11
)

print("模型已成功导出为 model.onnx")