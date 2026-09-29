package com.serviceops.service;

import com.serviceops.entity.Impact;
import com.serviceops.entity.Priority;
import com.serviceops.entity.Urgency;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PriorityCalculationServiceTest {

    private PriorityCalculationService service;

    @BeforeEach
    void setUp() {
        service = new PriorityCalculationService();
    }

    @ParameterizedTest(name = "Impact {0} + Urgency {1} should calculate {2}")
    @CsvSource({
        "HIGH, HIGH, P1",
        "HIGH, MEDIUM, P2",
        "MEDIUM, HIGH, P2",
        "MEDIUM, MEDIUM, P3",
        "LOW, HIGH, P3",
        "HIGH, LOW, P3",
        "MEDIUM, LOW, P4",
        "LOW, MEDIUM, P4",
        "LOW, LOW, P4"
    })
    @DisplayName("Verify deterministic ITIL priority matrix combinations")
    void testPriorityMatrix(Impact impact, Urgency urgency, Priority expectedPriority) {
        Priority result = service.calculatePriority(impact, urgency);
        assertEquals(expectedPriority, result, 
            String.format("Expected %s for Impact=%s and Urgency=%s", expectedPriority, impact, urgency));
    }

    @Test
    @DisplayName("Null safety: Fallback to lowest priority P4 when parameters are null")
    void testNullSafetyFallback() {
        assertEquals(Priority.P4, service.calculatePriority(null, Urgency.HIGH));
        assertEquals(Priority.P4, service.calculatePriority(Impact.HIGH, null));
        assertEquals(Priority.P4, service.calculatePriority(null, null));
    }
}
