using Application;
using EncryptionGrpcService;
using Grpc.Net.Client;

namespace Infrastructure;

public class EncryptionGrpcClient : IEncryptionService
{
    private readonly EncryptionService.EncryptionServiceClient _client;

    public EncryptionGrpcClient(string serverAddress)
    {
        HttpMessageHandler httpHandler = new HttpClientHandler();

        // If the address is HTTPS, bypass certificate validation (dev only)
        if (serverAddress.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            ((HttpClientHandler)httpHandler).ServerCertificateCustomValidationCallback =
                HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;
        }

        var channel = Grpc.Net.Client.GrpcChannel.ForAddress(serverAddress, new GrpcChannelOptions
        {
            HttpHandler = httpHandler
        });

        _client = new EncryptionService.EncryptionServiceClient(channel);
    }

    public async Task<string> EncryptAsync(string plaintext)
        => (await _client.EncryptAsync(new EncryptRequest { Plaintext = plaintext })).Ciphertext;

    public async Task<string> DecryptAsync(string ciphertext)
        => (await _client.DecryptAsync(new DecryptRequest { Ciphertext = ciphertext })).Plaintext;
}
