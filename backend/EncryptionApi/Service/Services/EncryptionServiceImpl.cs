using EncryptionGrpcService;
using Grpc.Core;

namespace Service.Services
{
    public class EncryptionServiceImpl : EncryptionService.EncryptionServiceBase
    {
        public override Task<EncryptResponse> Encrypt(EncryptRequest request, ServerCallContext context)
        {
            var encrypted = Service.Utilities.SimpleEncryptor.Encrypt(request.Plaintext);
            return Task.FromResult(new EncryptResponse { Ciphertext = encrypted });
        }

        public override Task<DecryptResponse> Decrypt(DecryptRequest request, ServerCallContext context)
        {
            var decrypted = Service.Utilities.SimpleEncryptor.Decrypt(request.Ciphertext);
            return Task.FromResult(new DecryptResponse { Plaintext = decrypted });
        }
    }
}