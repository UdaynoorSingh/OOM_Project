package com.secureattend.verification;

import org.springframework.stereotype.Component;

@Component
public class LocationVerification implements VerificationStrategy {
    @Override
    public String getName() {
        return "LOCATION";
    }

    @Override
    public boolean verify(VerificationInput input) {
        if (input == null) return false;
        // Mock: accept if within a simple bounding box or if Wi-Fi SSID matches expected (omitted)
        if (input.latitude == null || input.longitude == null) return false;
        double lat = input.latitude;
        double lon = input.longitude;
        // Example campus bounding box
        return lat > -90 && lat < 90 && lon > -180 && lon < 180;
    }
}


