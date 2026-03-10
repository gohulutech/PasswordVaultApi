using System.Security.Cryptography;
using System.Text;

namespace Infrastructure;

internal static class CryptoHelper
{
    private static readonly byte[] Key = Encoding.UTF8.GetBytes("16byteslongkey!"); // 16 bytes AES-128
    private static readonly byte[] IV = Encoding.UTF8.GetBytes("16byteslongiv!!");   // 16 bytes

    public static string Encrypt(string plainText)
    {
        using var aes = Aes.Create();
        aes.Key = Key;
        aes.IV = IV;
        var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

        var plainBytes = Encoding.UTF8.GetBytes(plainText);
        var encryptedBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);
        return Convert.ToBase64String(encryptedBytes);
    }

    public static string Decrypt(string cipherText)
    {
        using var aes = Aes.Create();
        aes.Key = Key;
        aes.IV = IV;
        var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

        var cipherBytes = Convert.FromBase64String(cipherText);
        var decryptedBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);
        return Encoding.UTF8.GetString(decryptedBytes);
    }
}
