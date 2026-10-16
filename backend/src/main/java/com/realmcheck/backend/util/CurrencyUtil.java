package com.realmcheck.backend.util;

/**
 * Utility for mapping ISO currency codes to display symbols.
 * Supports common currencies used by the application. If a currency is unknown,
 * the code itself is returned (e.g. "EUR") allowing the caller to decide how to display it.
 */
public class CurrencyUtil {
    public static String mapSymbol(String currencyCode) {
        if (currencyCode == null) {
            return "";
        }
        switch (currencyCode.toUpperCase()) {
            case "USD":
                return "$";
            case "INR":
                return "₹";
            case "GBP":
                return "£";
            case "EUR":
                return "€";
            default:
                // Return the code itself for unknown currencies
                return currencyCode.toUpperCase();
        }
    }
}
