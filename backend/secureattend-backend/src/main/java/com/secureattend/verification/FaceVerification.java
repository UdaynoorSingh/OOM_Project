package com.secureattend.verification;

import org.springframework.stereotype.Component;

@Component
public class FaceVerification implements VerificationStrategy {
    @Override
    public String getName() {
        return "FACE";
    }

    @Override
    public boolean verify(VerificationInput input) {
        // Mocked facial recognition with liveness: pass if livenessPassed true and some image provided
        return input != null && input.livenessPassed && input.faceImageBase64 != null && !input.faceImageBase64.isBlank();
    }
}


