using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using skyora1.DTO;
using skyora1.Repository;
using System.Text.Json;
using System.Text;
using System.Linq;
using System.Net.Http.Headers;

namespace skyora1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class ChatController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        private readonly IChatKnowledge _knowledge;

        public ChatController(IConfiguration config, IHttpClientFactory httpClientFactory, IChatKnowledge knowledge)
        {
            _config = config;
            _httpClient = httpClientFactory.CreateClient();
            _knowledge = knowledge;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { error = "Message cannot be empty." });

            var apiKey = _config["AI:ApiKey"];
            var model = _config["AI:Model"] ?? "llama-3.3-70b-versatile";
            var configuredEndpoint = _config["AI:Endpoint"];

            if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(configuredEndpoint))
            {
                Console.WriteLine("AI service unavailable; returning local fallback response.");
                return Ok(new { reply = GetFallbackReply(request.Message) });
            }

            string endpoint = configuredEndpoint.TrimEnd('/');
            if (!endpoint.Contains("/openai/v1/chat/completions"))
            {
                if (endpoint.Contains("groq.com"))
                    endpoint = "https://api.groq.com/openai/v1/chat/completions";
                else
                    endpoint = endpoint.TrimEnd('/') + "/openai/v1/chat/completions";
            }

            try
            {
                var liveSchedules = await _knowledge.GetLiveFlightSchedulesAsync();
                var staticPolicies = _knowledge.GetStaticAirlinePolicies();

                string systemInstruction =
                    "You are SkyOra Bot, the official AI concierge for SkyOra Airways. " +
                    "Use the following real-time database knowledge to answer queries accurately. " +
                    "If data is missing, suggest checking our direct schedules page. Be polite, concise, and professional.\n\n" +
                    $"[AIRLINE POLICIES]\n{staticPolicies}\n\n" +
                    $"[LIVE FLIGHT STATUS & PRICING]\n{liveSchedules}";

                var messages = new List<object> { new { role = "system", content = systemInstruction } };
                foreach (var history in request.ChatHistory)
                {
                    messages.Add(new { role = history.Role, content = history.Content });
                }
                messages.Add(new { role = "user", content = request.Message });

                var requestBody = new { model = model, messages = messages, temperature = 0.2 };

                var httpRequest = new HttpRequestMessage(HttpMethod.Post, endpoint)
                {
                    Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json")
                };

                httpRequest.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey.Trim());

                var response = await _httpClient.SendAsync(httpRequest);
                var responseString = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Groq Server Rejection: {responseString}");
                    return Ok(new { reply = GetFallbackReply(request.Message) });
                }

                using var doc = JsonDocument.Parse(responseString);
                var aiReply = doc.RootElement
                    .GetProperty("choices").EnumerateArray().First()
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString();

                return Ok(new { reply = aiReply });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Internal Exception: {ex}");
                return Ok(new { reply = GetFallbackReply(request.Message) });
            }
        }

        private string GetFallbackReply(string message)
        {
            if (string.IsNullOrWhiteSpace(message))
                return "AI is unavailable in this environment. Please try again later or use the support page.";

            var lower = message.ToLowerInvariant();
            if (lower.Contains("flight") || lower.Contains("booking") || lower.Contains("schedule") || lower.Contains("price"))
                return "AI is unavailable here. For flight schedules, booking details, and pricing, please use the main SkyOra portal or contact support.";

            if (lower.Contains("help") || lower.Contains("support"))
                return "AI is unavailable in this environment. Please visit the contact page for support or retry later.";

            return "AI is unavailable in this environment. I can’t provide a smart answer right now, but I’m here when the AI service becomes available.";
        }
    }
}
