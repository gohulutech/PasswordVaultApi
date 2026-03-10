namespace Domain;

public record Password
{
    public string Value { get; }

    private Password(string value)
    {
        Value = value;
    }

    public static Password Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Password cannot be empty");

        if (value.Length < 8)
            throw new ArgumentException("Password must be at least 8 characters");

        return new Password(value);
    }
}

