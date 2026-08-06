from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import InMemorySaver

from app.graph.state import MessagesState
from app.graph.nodes import chat_node

graph_builder = StateGraph(MessagesState)

graph_builder.add_node("chat", chat_node)

graph_builder.add_edge(START, "chat")
graph_builder.add_edge("chat", END)

memory = InMemorySaver()

graph = graph_builder.compile(checkpointer=memory)