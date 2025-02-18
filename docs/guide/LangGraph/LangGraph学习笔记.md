# LangGraph学习笔记

 简而言之：节点（ Nodes ）完成工作。边（edges）告诉下一步该做什么。 

参考：https://www.ionio.ai/blog/a-comprehensive-guide-about-langgraph-code-included



## 名词解释

### 边（edges） 

 就像指路牌，告诉程序下一步该去哪里 

 直接从一个节点到下一个节点。 

```python
graph.add_edge("node_a", "node_b")# 想从节点 A 到节点 B
```



### 条件边（conditional edges） 

是一种特殊的指路牌，会根据当前状态来决定走哪条路 

调用一个函数来确定接下来要去哪个节点 

具体来看代码的工作方式：

```python
pythonCopydef route_tools(state: State):
    # 这个函数的作用是检查AI是否想要使用工具
    # 如果AI要用工具，就转到"tools"节点
    # 如果AI不需要用工具，就结束对话（返回END）
    if isinstance(state, list):
        ai_message = state[-1]
    elif messages := state.get("messages", []):
        ai_message = messages[-1]
    else:
        raise ValueError(f"No messages found in input state to tool_edge: {state}")
    if hasattr(ai_message, "tool_calls") and len(ai_message.tool_calls) > 0:
        return "tools"
    return END
```

整个流程是这样的：

1. AI聊天机器人（chatbot）说完话后
2. 程序会检查： 
   - 如果AI想用工具 → 就去执行工具
   - 如果AI不需要用工具 → 就结束对话

就像是这样的对话流程：

```
CopyAI: "我需要计算一下..." → 使用计算器工具
AI: "好的，我知道答案了" → 结束对话
```

关键设置：

```python
pythonCopygraph_builder.add_conditional_edges(
    "chatbot",  # 从chatbot节点出发
    route_tools,  # 使用route_tools来做决策
    {"tools": "tools", END: END}  # 定义可能的去向
)
```

这就像是设置了一个路口：

- 从chatbot出来后
- 看看AI是否需要用工具
- 然后决定是去用工具还是结束对话

最后两行代码：

```python
pythonCopygraph_builder.add_edge("tools", "chatbot")  # 用完工具后回到chatbot
graph_builder.add_edge(START, "chatbot")    # 开始时就去找chatbot
```

这是在说：

- 用完工具后要回去问AI下一步怎么办
- 整个过程从chatbot开始

这样设计的好处是：

1. 流程清晰：每一步该做什么都很明确
2. 灵活性强：AI可以根据需要决定是否使用工具
3. 自动结束：当AI不需要继续使用工具时，对话自然结束



### 检查点（ checkpointer ）

 它就像是一个"存档点"，保存了对话的所有状态信息，每次聊天都会发送所有上下文 

 不同thread_id的对话相互独立 - 因为历史记录是按thread_id分开存储的



### 节点（nodes）

 在 LangGraph 中，节点通常是 python 函数（同步或异步），其中第一个位置参数是状态，第二个位置参数（可选）是一个“config”，包含可选的可配置参数（例如 `thread_id` ）。 

 使用 add_node 方法将这些节点添加到图中 ：

```python
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph

builder = StateGraph(dict)


def my_node(state: dict, config: RunnableConfig):
    print("In node: ", config["configurable"]["user_id"])
    return {"results": f"Hello, {state['input']}!"}


def my_other_node(state: dict):
    return state


builder.add_node("my_node", my_node)
builder.add_node("other_node", my_other_node)
```



### 起点（`START`  Node）

标记工作流的起始点

指定接收用户输入的第一个节点

相当于"入口点"

```python
graph.add_edge(START, "node_a")  # 从START开始，先执行node_a
```



### 终点（ `END`   Node）

标记工作流的结束点

表示某个节点执行后应该终止

相当于"出口点"

```python
graph.add_edge("node_a", END)  # node_a执行完就结束
```



## api

### 人机协作

当使用 `interrupt()` 收集用户输入时， `Command` 然后被用于提供输入并通过 `Command(resume="User input")` 恢复执行 

在节点内部调用 `interrupt` 将暂停执行。通过传入一个`Command` ，可以恢复执行，并结合来自人类的新输入。 `interrupt` 在 ergonomically 上类似于 Python 的内置 `input()` ，但有一些注意事项。我们在下面演示一个示例 

```python
from langgraph.graph import interrupt, Command
from langchain.tools import tool

# 1. input方式 - 仅用于控制台程序
def console_approval():
    user_input = input("请输入确认信息: ")  # 直接在控制台等待输入
    return user_input

# 2. interrupt方式 - 用于工作流系统
@tool
def workflow_approval(proposal: str) -> str:
    # 暂停执行，保存状态，等待外部系统提供数据响应
    response = interrupt({"proposal": proposal})
    return response["data"]

# ===== 使用场景示例 =====

# 场景1: 简单的控制台程序
def run_console_demo():
    print("=== 控制台程序示例 ===")
    result = console_approval()
    print(f"获得输入: {result}")

# 场景2: Web应用工作流
def run_workflow_demo():
    print("=== 工作流程序示例 ===")
    
    # 1. 工作流执行到需要审核的步骤
    print("工作流暂停，等待审核...")
    response = workflow_approval("这是需要审核的内容")
    
    # 2. 在实际应用中，这里会暂停执行
    # 3. 外部系统（如Web界面）可以稍后通过以下方式恢复执行：
    """
    # 在Web后端或其他地方：
    human_command = Command(resume={"data": "审核通过"})
    graph.stream(human_command, config)
    """
```



### 倒带（还原）



```python
to_replay = None
for state in graph.get_state_history(config):
    print("Num Messages: ", len(state.values["messages"]), "Next: ", state.next)
    print("-" * 80)
    if len(state.values["messages"]) == 6:# 找到具体的某个状态.
        to_replay = state
        
# 从该状态重新开始执行
if to_replay:
    # 使用原始状态的配置（包含checkpoint_id）
    events = graph.stream(None, to_replay.config, stream_mode="values")
```

