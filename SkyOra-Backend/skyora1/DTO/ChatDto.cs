namespace skyora1.DTO
{
    public class ChatRequestDto
    {
        public string Message { get; set; } = string.Empty;
        public List<ChatMessageDto> ChatHistory { get; set; } = new List<ChatMessageDto>();
    }

    public class ChatMessageDto
    {
        public string Role { get; set; } = string.Empty; // "user" or "assistant"
        public string Content { get; set; } = string.Empty;
    }
}
