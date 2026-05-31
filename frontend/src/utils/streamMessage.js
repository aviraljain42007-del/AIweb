const API_URL = import.meta.env.VITE_API_URL;

export const streamMessage = async ({
  conversationId,
  prompt,
  mode,
  onChunk,
  onDone,
  onError,
}) => {
  const response = await fetch(
    `${API_URL}/chat/${conversationId}/message/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        prompt,
        mode,
      }),
    }
  );

  if (!response.ok) {
    let message = "Streaming request failed";

    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch (error) {
      // response may not be JSON
    }

    throw new Error(message);
  }

  if (!response.body) {
    throw new Error("Streaming not supported by browser");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop();

    for (const event of events) {
      if (!event.startsWith("data: ")) continue;

      const jsonString = event.replace("data: ", "");

      const parsed = JSON.parse(jsonString);

      if (parsed.type === "chunk") {
        onChunk(parsed.content);
      }

      if (parsed.type === "done") {
        onDone(parsed);
      }

      if (parsed.type === "error") {
        onError(parsed.message);
      }
    }
  }
};