using System.Security.Cryptography;
using System.Text;

namespace Infrastructure;

internal static class CryptoHelper
{
    // Exactly 16 ASCII characters → 16 bytes for AES-128
    private static byte[] Key = Encoding.ASCII.GetBytes("1234567890abcdef"); // 16 bytes
    private static byte[] IV = Encoding.ASCII.GetBytes("abcdef1234567890"); // 16 bytes

    public static string Encrypt(string plainText)
    {
        using Aes aes = Aes.Create();
        aes.Key = Key;
        aes.IV = IV;
        aes.Padding = PaddingMode.PKCS7;
        aes.Mode = CipherMode.CBC;

        using MemoryStream ms = new();
        using CryptoStream cs = new(ms, aes.CreateEncryptor(), CryptoStreamMode.Write);
        using (StreamWriter sw = new(cs))
        {
            sw.Write(plainText);
        }

        byte[] encrypted = ms.ToArray();
        return Convert.ToBase64String(encrypted);
    }

    public static string Decrypt(string cipherText)
    {
        byte[] buffer = Convert.FromBase64String(cipherText);

        using Aes aes = Aes.Create();
        aes.Key = Key;
        aes.IV = IV;
        aes.Padding = PaddingMode.PKCS7;
        aes.Mode = CipherMode.CBC;

        using MemoryStream ms = new(buffer);
        using CryptoStream cs = new(ms, aes.CreateDecryptor(), CryptoStreamMode.Read);
        using StreamReader sr = new(cs);
        return sr.ReadToEnd();
    }
}
