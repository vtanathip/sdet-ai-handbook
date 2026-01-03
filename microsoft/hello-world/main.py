import os
import asyncio
from dotenv import load_dotenv
from agent_framework import ChatAgent
from agent_framework.openai import OpenAIChatClient


async def main() -> None:
    # Simple agent using OpenAI client
    # Requires environment variable: OPENAI_API_KEY
    # Load environment variables from .env in the current folder
    load_dotenv()

    model_id = os.environ.get("OPENAI_CHAT_MODEL_ID", "gpt-4o-mini")

    agent = ChatAgent(
        chat_client=OpenAIChatClient(model_id=model_id),
        instructions="You are a friendly assistant. Respond concisely.",
    )

    result = await agent.run("Say 'Hello, world!' and one quick tip.")
    print(result)


if __name__ == "__main__":
    asyncio.run(main())
