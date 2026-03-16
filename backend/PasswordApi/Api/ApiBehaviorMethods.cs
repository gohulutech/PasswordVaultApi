using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Api;

internal static class ApiBehaviorMethods
{
    internal static string MapValidationError(ModelError error)
    {
        var message = error.ErrorMessage.ToLower();

        if (message.Contains("required"))
            return "REQUIRED";

        if (message.Contains("missing required"))
            return "REQUIRED";

        if (message.Contains("minimum length"))
            return "TOO_SHORT";

        return "INVALID";
    }

    internal static string ToCamelCase(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        if (input == "$")
            return "body";

        return char.ToLowerInvariant(input[0]) + input.Substring(1);
    }
}
